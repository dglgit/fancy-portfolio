// Request Types
export interface QueryRequest {
  question: string;
}

// Response Types
export interface HealthResponse {
  status: string;
  message: string;
  database_loaded: boolean;
}

export interface InfoResponse {
  model_name: string;
  database_path: string;
  database_exists: boolean;
  supported_textbooks: string[];
}

export interface Citation {
  sentence_number: number;
  citation: string;
}

export interface RateLimitInfo {
  message: string;
  retries_attempted: number;
  total_wait_time: number;
}

export interface QueryResponse {
  question: string;
  answer: string;
  citations?: {
    cited_sentences: Citation[];
    source_level_citations: Record<string, number[]>;
  };
  sources_retrieved?: number;
  rate_limit_info?: RateLimitInfo;
}

// Error Types
export interface ApiError {
  detail: string;
  status: number;
}

// Hook States
export interface QueryState {
  loading: boolean;
  error: string | null;
  data: QueryResponse | null;
} 