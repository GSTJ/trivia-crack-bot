export enum ErrorCode {
  LivesEnded = 2013,
  TokenExpired = 190,
  InvalidToken = 2500,
  GenericToken = 607,
}

export interface GraphResponse {
  id: string;
  email: string;
  error?: {
    code: ErrorCode;
  };
}

export interface GameResponse {
  code?: ErrorCode;
  id: string;
  session: {
    session: string;
  };
  facebook_name: string;
}

export interface Question {
  id: string;
  category: string;
  correct_answer: string;
}

export interface DuelResponse {
  code?: ErrorCode;
  game: {
    questions: Question[];
  };
  countdown: number;
}

export interface Player {
  id: string;
  correct_answers: number;
  finish_time: number;
}

export interface AnswersPayload {
  answers: {
    id: string;
    category: string;
    answer: string;
  }[];
  finish_time: number;
}
