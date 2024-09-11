import ChatForm, { InputField } from './ChatForm';
import { Context } from 'hono';
import { User } from '@models/schema';
import { updateUser } from '@models/db/users';
import { get_intro_card } from './IntroCards';
import Toast from '@components/Toast';
import { deleteThread, loadMessages } from '@models/phoebe';
import { AssistantChat, UserChat } from './personality/ChatCards';
import { marked } from 'marked';

export const onRequestDelete = async (c: Context) => {
  await deleteThread(c);
  return c.html(
    <div id="input-field" hx-swap-oob="true">
      <InputField disabled={false} />
    </div>
  );
}

export const onRequestPut = async (c: Context) => {
  const user: User = c.get('user');
  const form = await c.req.formData();
  const known_as = form.get('known_as') as string;
  await updateUser(c.env, user.uid, { known_as });
  const IntroCard = get_intro_card(user);
  if (IntroCard) {
    return c.html(<IntroCard />);
  }
  return c.html(<Toast type="alert-error">Something went wrong</Toast>);
};

export const onRequestPost = async (c: Context) => {
  const user: User = c.get('user');
  const IntroCard = get_intro_card(user);
  if (IntroCard) {
    console.log('IntroCard', IntroCard);
    return c.html(<IntroCard />);
  }
  console.log('user', user);
  if (!user.thread_id) {
    return c.html('');
  }
  try {
    const messages = (await loadMessages(c, user.thread_id!)).reverse();
    if (messages[0].role === 'assistant') {
      messages.shift();
    }
    const parsedMessages = await Promise.all(messages.map(async (message) => {
      const content = await marked.parse(message.content[0].text.value);
      return { ...message, content };
    }));
    return c.html(
    <>
      {parsedMessages.map((message) => (
          message.role === 'user' ?
            <UserChat message={message.content} /> :
            <AssistantChat message_id={message.id} target_id={message.id} message={message.content} />
      ))}
    </>)
  } catch (e) {
    console.log('error', e);
    return c.html('');
  }
}


export const onRequestGet = async (c: Context) => {
  const user: User = c.get('user');
  const IntroCard = get_intro_card(user);

  return c.render(
    <div hx-ext="ws" ws-connect="/user/_websocket" className="w-full min-h-screen bg-base-200">
      <div className="container mx-auto px-4">
        <div id="scrollview" className="max-w-4xl mx-auto pt-8 w-full h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex justify-end mb-4">
            <a href="/sign_out" className="btn btn-primary btn-outline hover:text-primary-focus">Logout</a>
          </div>
          <h1 className="text-3xl text-dark font-bold mb-8 flex items-center gap-2 justify-center">
            Chat with <span className="text-primary font-extrabold">Phoebe</span>
            <button disabled={IntroCard !== null} hx-delete="/user" hx-target="#messages" className="btn btn-primary btn-xs btn-outline hover:text-primary-focus">Clear chat</button>
          </h1>
          <div 
            id="messages" 
            className="mt-10 px-4 pb-24 flex flex-col gap-4 max-w-2xl mx-auto items-center" 
            hx-trigger="load" 
            hx-post="/user">
          </div>
        </div>
      </div>
      <ChatForm can_chat={IntroCard === null} />
    </div>
  );
};