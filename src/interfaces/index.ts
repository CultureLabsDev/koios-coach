import { JWTPayload } from 'hono/utils/jwt/types';

export type MyJWTPayload = JWTPayload & { uid: string };
export interface QueueMessage {
  uid: string;
  assessment_id: string;
}

export type Env = {
  DB: D1Database;
  QUEUE: Queue<QueueMessage>;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
  OPENAI_API_KEY: string;
  OPENAI_CHAT_URL: string;
  OPENAI_EMBEDDING_URL: string;
  PREDICTION_API_URL: string;
  DIARIZE_API_URL: string;
  CF_ACCOUNT_ID: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_KEY: string;
  DEEPGRAM_KEY: string;
  DEEPGRAM_URL: string;
  VECTOR_STORE_ID: string;
};

export interface PredictionResponse {
  assessment: {
    agreeableness: number;
    conscientiousness: number;
    extraversion: number;
    neuroticism: number;
    openness: number;
  };
}

export interface Personality {
  openness: string;
  conscientiousness: string;
  extraversion: string;
  agreeableness: string;
  neuroticism: string;
}

export interface Scores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export type SpeakerData = {
  speaker: number;
  demo_audio: string;
  full_audio: string;
  transcript: string;
};

export type TrimmedAudio = {
  diarised_transcript: string;
  speakers: SpeakerData[];
};

export type Paragraph = {
  start: string;
  end: string;
  speaker: number;
  sentences: {
    text: string;
  }[];
};

type Results = {
  channels: {
    alternatives: {
      transcript: string;
      paragraphs: { paragraphs: Paragraph[] };
    }[];
  }[];
};

export interface DeepgramResponse {
  results: Results;
}
