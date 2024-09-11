import { User } from "@models/schema";

const KnownAsCard = () => (
  <div id="intro_card" className="card bg-base-100 shadow-xl max-w-xl">
    <div className="card-body">
      <h2 className="card-title">Before we start...</h2>
      <p>What would you like me to call you?</p>
      <form hx-put="/user" hx-target="#intro_card" hx-swap="outerHTML" class="flex gap-4">
        <input type="text" name="known_as" placeholder="Your name" className="input input-bordered w-full max-w-xs" />
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
);

const PersonalityCard = () => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <div hx-get="/user/personality" hx-trigger="load"></div>
    </div>
  </div>
);

const MindsetCard = () => (
  <div className="card bg-base-100 shadow-xl max-w-2xl w-full">
    <div className="card-body" id="mindset_card">
      <h2 className="card-title">Finally...</h2>
      <p>I'd like to ask you a few questions to understand how you think.</p>
      <button hx-get="/user/mindset" hx-target="#mindset_card" class="btn btn-gradient w-full">
        Proceed
      </button>
    </div>
  </div>
);

export const get_intro_card = (user: User) => {
  if (user.known_as === null) {
    return KnownAsCard;
  }
  if (user.assessment_id == null) {
    return PersonalityCard;
  }
  if (user.mindset_score == null) {
    return MindsetCard;
  }  
  return null;
};