import { AssistantMessage, AssistantThread, VectorStoreFiles } from '@interfaces/assistant';
import { getAssessment } from './db/assessments';
import { assistant_instructions, first_message } from '@prompts/assistant';
import { getMyUser, getUser, updateUser } from './db/users';
import { Context } from 'hono';

const BASE_URL = 'https://api.openai.com/v1/';

const callAPI = async (c: Context, route: string, method: string, body?: string, isStream: boolean = false) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method,
    headers: {
      Authorization: `Bearer ${c.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2',
    },
    body,
  });
  if (!response.ok) {
    console.error(`OpenAIAPI "${method}:${route}" failed with status: ${response.status}`);
    throw new Error(`OpenAIAPI "${method}:${route}" failed with status: ${response.status}`);
  }
  return isStream ? response.body : await response.json();
};

export const createAssistant = async (c: Context, client_id: string) => {
  const user = await getUser(c.env, client_id);
  if (!user) throw new Error('User not found');
  if (user.assistant_id) {
    console.log('already has assistant', user.assistant_id);
    return user.assistant_id;
  } else {
    console.log('creating assistant');
    const assistant = (await callAPI(
      c,
      'assistants',
      'POST',
      JSON.stringify({
        instructions: assistant_instructions(user?.name || 'Unknown', '', ''),
        name: 'Phoebe Mindset Coach',
        tools: [{ type: 'file_search' }],
        tool_resources: {
          file_search: {
            vector_store_ids: [c.env.VECTOR_STORE_ID],
          },
        },
        model: 'gpt-4o-mini',
      })
    )) as { id: string } | null;
    console.log('assistant', assistant);
    if (assistant === null) {
      throw new Error('Assistant creation failed');
    }
    await updateUser(c.env, user.uid, { assistant_id: assistant.id });
    return assistant.id;
  }
};

export const getFileList = async (c: Context, client_id: string) => {
  const user = await getUser(c.env, client_id);
  if (!user) throw new Error('User not found');
  console.log(`vector_stores/${user.vector_store_id}/files`);
  const vector_store_id = await createVectorStore(c, client_id);
  const response = (await callAPI(c, `vector_stores/${vector_store_id}/files`, 'GET')) as VectorStoreFiles;
  console.log('files', response);
  return response || [];
};

const createVectorStore = async (c: Context, client_id: string) => {
  const user = await getUser(c.env, client_id);
  if (!user) throw new Error('User not found');
  if (user.vector_store_id) {
    return user.vector_store_id;
  } else {
    console.log('creating vector store');
    const vector_store = (await callAPI(c, 'vector_stores', 'POST')) as { id: string } | null;
    if (vector_store === null) {
      throw new Error('Vector Store creation failed');
    }
    await updateUser(c.env, user.uid, { vector_store_id: vector_store.id });
    return vector_store.id;
  }
};

export const deleteRAGFile = async (c: Context, client_id: string, file_id: string) => {
  const user = await getUser(c.env, client_id);
  if (!user) throw new Error('User not found');
  await callAPI(c, `vector_stores/${user.vector_store_id}/files/${file_id}`, 'DELETE');
};

export const uploadRAGFile = async (c: Context, client_id: string, file: File) => {
  const user = await getUser(c.env, client_id);
  if (!user) throw new Error('User not found');
  let vector_store_id = user.vector_store_id;
  if (!user.vector_store_id) {
    vector_store_id = await createVectorStore(c, client_id);
  }
  // upload file
  const formData = new FormData();
  formData.append('file', file);
  console.log('uploading file', file);
  formData.append('purpose', 'assistants');
  const file_upload = await fetch(`${BASE_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${c.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });
  console.log('file_upload', file_upload);
  if (!file_upload.ok) throw new Error('File upload failed');
  const { id } = (await file_upload.json()) as { id: string };

  // store file to vector store
  await callAPI(c, `vector_stores/${vector_store_id}/files`, 'POST', JSON.stringify({ file_id: id }));
};

export const deleteThread = async (c: Context) => {
  const user = await getMyUser(c);
  if (!user) throw new Error('User not found');
  try {
    await callAPI(c, `threads/${user.thread_id}`, 'DELETE');
  } catch (error) {
    console.error('Error deleting thread', error);
    throw error;
  } finally {
    await updateUser(c.env, user.uid, { thread_id: null });
  }
};

export const createThread = async (c: Context) => {
  try {
    const user = await getMyUser(c);
    if (!user) throw new Error('User not found');
    console.log('calling API');
    const assessment = await getAssessment(c.env, user.assessment_id!);
    if (!assessment) throw new Error('Assessment not found');
    const content = first_message(assessment);
    const thread = (await callAPI(
      c,
      'threads',
      'POST',
      JSON.stringify({ messages: [{ role: 'assistant', content }] }),
      false
    )) as AssistantThread;
    console.log('thread', thread);
    await updateUser(c.env, user.uid, { thread_id: thread.id });
    return thread.id;
  } catch (error) {
    console.error('Error creating thread', error);
    throw error;
  }
};

const runThread = async (c: Context, threadId: string, assistantId: string) => {
  console.log('running thread', assistantId);
  return (await callAPI(
    c,
    `threads/${threadId!}/runs`,
    'POST',
    JSON.stringify({
      assistant_id: assistantId,
      stream: true,
    }),
    true
  )) as ReadableStream<Uint8Array>;
};

export const loadMessages = async (c: Context, threadId: string) => {
  const messages = (await callAPI(c, `threads/${threadId}/messages`, 'GET')) as { data: AssistantMessage[] };
  return messages.data;
};

const addMessage = async (c: Context, threadId: string, messageContent: string) => {
  await callAPI(c, `threads/${threadId}/messages`, 'POST', JSON.stringify({ role: 'user', content: messageContent }));
};

export const callPhoebe = async (
  c: Context,
  userMessage: string,
  threadId: string | null,
  assistantId: string | null
): Promise<ReadableStream<Uint8Array>> => {
  console.log('threadId', threadId);
  console.log('assistantId', assistantId);
  if (!assistantId) {
    throw new Error('Assistant not found');
  }
  if (!threadId) {
    threadId = await createThread(c);
    if (!threadId) throw new Error('Thread failed');
  }
  await addMessage(c, threadId, userMessage);
  return runThread(c, threadId, assistantId);
};
