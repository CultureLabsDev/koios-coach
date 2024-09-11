import { mindsetQuestions } from '@constants';
import { Env } from '@interfaces';
import { Assessment } from '@models/schema';
import { Question } from '@routes/user/mindset/Question';

type TraitLevel = 'Very Low' | 'Low' | 'Mid' | 'High' | 'Very High' | 'Unknown';
export const traitLevel = (trait?: number | null): TraitLevel => {
  if (trait === undefined || trait === null) {
    return 'Unknown';
  }
  if (trait < 20) {
    return 'Very Low';
  }
  if (trait < 40) {
    return 'Low';
  }
  if (trait < 60) {
    return 'Mid';
  }
  if (trait < 80) {
    return 'High';
  }
  return 'Very High';
};

export const getPersonality = (assessment: Assessment) =>
  `
    Openness: ${traitLevel(assessment.openness)}
    Conscientiousness: ${traitLevel(assessment.conscientiousness)}
    Extraversion: ${traitLevel(assessment.extraversion)}
    Agreeablenes: ${traitLevel(assessment.agreeableness)}
    Neuroticism: ${traitLevel(assessment.neuroticism)}
  `;

export const sqlInsert = async (env: Env, table: string, data: Record<string, unknown>) => {
  const filteredData = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  const keys = Object.keys(filteredData);
  const values = Object.values(filteredData);
  const columns = keys.join(', ');
  const placeholders = keys.map(() => '?').join(', ');
  return await env.DB.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`)
    .bind(...values)
    .first();
};

export const extractJson = (str?: string | null) => {
  if (!str) {
    return '';
  }
  const pattern = /```json\s*([\s\S]+?)\s*```/;
  const match = pattern.exec(str);
  if (!match) {
    return str;
  }
  return match[1];
};

export const conditionalPromise = async (
  key: string,
  asyncFunction: Promise<string | null>
): Promise<{ key: string; result: string | null }> =>
  asyncFunction
    .then((result) => ({ key, result }))
    .catch((error) => {
      console.error('Error processing', key, error);
      return { key, result: null };
    });

export const processPromises = async (promises: Promise<{ key: string; result: string | null }>[]) =>
  (await Promise.all(promises)).reduce((acc, { key, result }) => {
    console.log('processPromise result', key, result);
    if (result) {
      acc[key] = result;
    }
    return acc;
  }, {} as Record<string, string>);

export const anyNulls = (results: Record<string, string | null>) =>
  Object.values(results).some((value) => value === null);

export const replaceName = (text: string, name: string, speaker: number) => {
  const speakerName = `SPEAKER_${speaker}`;
  return text.replace(new RegExp(speakerName, 'g'), `${speakerName}(${name})`);
};

export const initials = (text: string): string =>
  text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

export const generatePassword = (): string => {
  const length = 12;
  let password = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_#@!';

  while (password.length < length) {
    const byte = crypto.getRandomValues(new Uint8Array(1))[0];
    if (byte < characters.length) {
      password += characters[byte];
    }
  }

  return password;
};

const paginate = (answers: Question[], pageSize: number) => {
  const pages: Question[][] = [];
  for (let i = 0; i < answers.length; i += pageSize) {
    pages.push(answers.slice(i, i + pageSize));
  }
  return pages;
};

export const getQuestions = (inputCode: string, formData: FormData, pageSize: number) => {
  const codedAnswers = inputCode.split('');
  const answers = mindsetQuestions.map((question, index) => {
    if (formData.get(question.id)) {
      return { ...question, value: Number(formData.get(question.id)) };
    }
    return { ...question, value: Number(codedAnswers[index] || 3) };
  });
  const pages = paginate(answers, pageSize);
  const code = answers.map((question) => question.value).join('');
  return { pages, code };
};
