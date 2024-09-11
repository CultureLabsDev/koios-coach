import { Context } from 'hono';
import SpinnerOverlay from '@components/SpinnerOverlay';
import { User } from '@models/schema';
import { updateUser } from '@models/db/users';
import { getQuestions } from '@utils';
import QuestionsPage from './QuestionsPage';
import SubmissionPage from './SubmissionPage';

export const onRequestPut = async (c: Context) => {
  const data = await c.req.formData();
  const user: User = c.get('user');
  const scores = data.get('code') || '';
  console.log(scores);
  const mindset_score = Object.values(scores.split('')).reduce((acc, val) => acc + Number(val), 0);
  console.log({ mindset_score, user });
  await updateUser(c.env, user.uid, { mindset_score });

  c.header('HX-Redirect', '/user');
  return c.html('');
};

export const onRequestPost = async (c: Context) => {
	const data = await c.req.formData();
	const page = Number(data.get('page') || 0);
	const prevPage = data.get('prevPage') !== null;
	const nextPage = data.get('nextPage') !== null;
	const currentPage = nextPage ? page + 1 : prevPage ? page - 1 : page;
	const { code, pages } = getQuestions(String(data.get('code') || ''), data, 1);
	const finalPage = currentPage === pages.length;

	return c.html(
		<form class="w-full">
			<input type="hidden" name="page" value={currentPage} />
			<input type="hidden" name="code" value={code} />
			{finalPage ? (
        <SubmissionPage />
      ): (
        <QuestionsPage currentPage={currentPage} pageCount={pages.length} questions={pages[currentPage]} />
      )}
		</form>
	);
};

export const onRequestGet = async (c: Context) => {
  return c.html(
    <div>
      <form class="flex flex-col items-center w-full">
        <div id="page" class="max-w-xl" hx-post="/user/mindset" hx-trigger="load">
        </div>
      </form>
      <div id="processing" class="my-indicator">
        <SpinnerOverlay text="Processing Questionnaire.." />
      </div>
    </div>
  );
};
