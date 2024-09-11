import { callPhoebe } from '@models/phoebe';
import { upgradeWebSocket } from 'hono/cloudflare-workers';
import { raw } from 'hono/html';
import sanitize from 'sanitize-html';
import { InputField } from './ChatForm';
import { getMyOwner, getMyUser } from '@models/db/users';
import { AssistantChat, UserChat } from './personality/ChatCards';

export const onRequestGet = upgradeWebSocket(async (c) => {
  return {
    async onMessage(event, ws) {
      const user = await getMyUser(c);
      if (!user) {
        return;
      }
      const owner = await getMyOwner(c);
      console.log('onMessage', event.data);
      const data = JSON.parse(event.data);
      const message = sanitize(data.message);
      if (message === '') {
        return;
      }
      const message_id = 'message-' + Math.random().toString(36).substring(7);
      const target_id = message_id + '-visible';
      ws.send(
        raw(
          <>
            <div id="messages" hx-swap-oob="beforeend" class="w-full flex justify-center">
              <UserChat message={message} />
              <AssistantChat message_id={message_id} target_id={target_id} />
            </div>
            <div id="input-field" hx-swap-oob="true">
            <InputField disabled={true} />
            </div>
          </>
        )
      );

      console.log('calling phoebe');
      const phoebeStream = await callPhoebe(c, message, user?.thread_id, owner?.assistant_id ?? null);
      const reader = phoebeStream.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        let buffer = decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop()!;

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            if (line === 'data: [DONE]') {
              continue;
            }
            const data = JSON.parse(line.substring(6));
            if (data.object === 'thread.message.delta') {
              const message = data.delta.content[0].text.value;
              // console.log(message);
              ws.send(
                raw(
                  <div id={message_id} hx-swap-oob="beforeend">
                    {message}
                  </div>
                )
              );
            }
          }
        }
        ws.send(raw(
          <div id="input-field" hx-swap-oob="true">
            <InputField disabled={false} />
          </div>));
      }
    },
    onClose: () => {
      console.log('Connection closed');
    },
  };
});
