export type Status =
  | 'queued'
  | 'in_progress'
  | 'completed'
  | 'requires_action'
  | 'expired'
  | 'cancelling'
  | 'cancelled'
  | 'failed';

type AssistantError = {
  message: string;
  code: string | null;
  type: string;
  param: string | null;
};

export type AssistantRun = {
  id: string;
  object: string;
  created_at: number;
  assistant_id: string;
  thread_id: string;
  status: Status;
  started_at: number;
  expires_at: number | null;
  cancelled_at: number | null;
  failed_at: number | null;
  completed_at: number | null;
  last_error: string | null;
  model: string;
  instructions: string | null;
  tools: { type: string }[];
  file_ids: string[];
  metadata: object;
  error: AssistantError | null;
};

export type AssistantMessage = {
  id: string;
  object: string;
  created_at: number;
  thread_id: string;
  role: string;
  content: {
    type: string;
    text: {
      value: string;
      annotations: object[];
    };
  }[];
  file_ids: string[];
  assistant_id: string;
  run_id: string;
  metadata: object;
};

export type AssistantThread = {
  id: string;
  object: string;
  created_at: number;
  metadata: object;
};

export type VectorStoreFiles = {
  object: 'list';
  data: {
    id: string;
    object: string;
    usage_bytes: number;
    created_at: number;
    vector_store_id: string;
    status: string;
  }[];
  first_id: string;
  last_id: string;
  has_more: boolean;
};
