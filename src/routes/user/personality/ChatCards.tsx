type UserProps = {
  message: string;
}

type AssistantProps = {
  message?: string;
  message_id: string;
  target_id: string;
}


export const UserChat = ({message}:  UserProps) => (
  <div class="w-full flex justify-end max-w-3xl">
    <div class="card bg-gradient max-w-xl">
      <div class="card-body p-4 text-white" dangerouslySetInnerHTML={{ __html: message }}></div>
    </div>
  </div>
)

export const AssistantChat = ({message_id, target_id, message}: AssistantProps) => (
  <div class="card bg-base-100 w-full max-w-3xl my-8">
    <div id={message_id} class="hidden" data-md-parse={target_id}></div>
    <div id={target_id} class="card-body p-4 text-primary" dangerouslySetInnerHTML={{ __html: message ? message : '' }}></div>
  </div>
)