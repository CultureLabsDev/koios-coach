import Icon from '@components/Icon';

export const InputField = ({ disabled }: { disabled: boolean }) => (
  <div id="input-field" className="relative">
    <input
      id="prompt-textarea"
      tabIndex={0}
      placeholder="Message Phoebe"
      name="message"
      disabled={disabled}
      className={`w-full text-dark placeholder-neutral border-none px-6 py-3 rounded-full shadow-inner ${disabled ? 'bg-base-300' : 'bg-white'}`}
    />
    <button
      type="submit"
      disabled={disabled}
      className={`absolute right-1 top-1 btn-none flex items-center justify-center w-10 h-10 rounded-full 
        bg-primary text-white hover:bg-primary-focus transition-colors duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon id="send" size={20} />
    </button>  
  </div>
);

export default ({ can_chat }: { can_chat: boolean }) => (
  <form ws-send className="fixed bottom-0 left-0 w-full py-4">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex-grow">
          <InputField disabled={!can_chat} />
        </div>
      </div>
    </div>
  </form>
);