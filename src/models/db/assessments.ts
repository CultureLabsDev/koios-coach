import type { Env } from '@interfaces';
import type { Assessment, AssessmentInsert } from '@models/schema';
import { assessments } from '@models/schema';
import { getDB } from '.';
import { eq } from 'drizzle-orm';

export const getAssessment = async (env: Env, assessment_id: string): Promise<Assessment | undefined> =>
  getDB(env).query.assessments.findFirst({
    where: eq(assessments.assessment_id, assessment_id),
  }) as Promise<Assessment>;

export const addAssessment = async (env: Env, data: AssessmentInsert) => {
  const results = await getDB(env).insert(assessments).values(data).returning();
  return results[0] as Assessment;
};

export const updateAssessment = async (env: Env, assessment_id: string, data: Partial<Assessment>) => {
  const results = await getDB(env)
    .update(assessments)
    .set(data)
    .where(eq(assessments.assessment_id, assessment_id))
    .returning();
  return results[0] as Assessment;
};

export const deleteAssessment = async (env: Env, assessment_id: string) =>
  getDB(env).delete(assessments).where(eq(assessments.assessment_id, assessment_id));
