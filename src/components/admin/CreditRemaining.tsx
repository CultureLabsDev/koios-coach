type Props = {
  credit_remaining: number;
  uid: string;
  is_me: boolean;
};
export default ({ credit_remaining, uid, is_me }: Props) => (
  <div
    id="credit-remaining"
    class="mb-2 flex items-center justify-center p-3 bg-gradient rounded-2xl text-lg text-black"
  >
    {is_me ? (
      <div class=" font-bold text-3xl">{credit_remaining}</div>
    ) : (
      <input
        hx-patch={`/admin/clients/${uid}/usage`}
        hx-target="#credit-remaining"
        hx-swap="outerHTML"
        hx-trigger="keyup changed delay:1000ms"
        class="rounded w-32 pl-2 text-2xl font-normal"
        name="credit_remaining"
        value={credit_remaining}
      />
    )}
    <div class="ml-4">Credits remaining</div>
  </div>
);
