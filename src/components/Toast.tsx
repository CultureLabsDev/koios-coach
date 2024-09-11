import { raw } from 'hono/html';
import { HtmlEscapedString } from 'hono/utils/html';
import { JsxElement } from 'typescript';

export type ToastType = 'alert-success' | 'alert-error' | 'alert-info' | 'alert-warning';
type Props = {
  children: string | JsxElement | Promise<HtmlEscapedString>;
  type: ToastType;
  fadeOut?: boolean;
};

export default ({ children, type, fadeOut = true }: Props) => (
  <div id="toast-queue" hx-swap-oob="afterbegin">
    <div
      class={`alert ${type} transition-opacity duration-1000 flex justify-between w-full`}
      _={fadeOut ? 'on load wait 2s add .opacity-0 wait 2s remove me' : 'on click remove me'}
    >
      {raw(children)}{' '}
      {fadeOut ? null : (
        <button class="link hover:font-bold" aria-label="Close">
          close
        </button>
      )}
    </div>
  </div>
);
