/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuestionType =
  | 'single-select'
  | 'multi-select'
  | 'open-response'
  | 'nps-scale'
  | 'likert-matrix'
  | 'ranking';

export interface QuestionOption {
  id: string;
  label: string;
  isOther?: boolean;
  isExclusiveNone?: boolean; // For Q21 "No change needed"
}

export interface LikertStatement {
  id: string; // e.g., 'q31', 'q32', etc.
  number: number;
  text: string;
}

export interface SurveyQuestion {
  id: string; // e.g., 'q1', 'q2'
  number: number;
  text: string;
  helperText?: string;
  type: QuestionType;
  options?: QuestionOption[];
  maxSelections?: number;
  likertStatements?: LikertStatement[];
  likertOptions?: string[];
  rankingItems?: string[];
  maxRank?: number;
  rows?: number;
  maxLength?: number;
}

export interface SurveySection {
  id: string; // 'A' | 'B' | ... | 'H'
  index: number;
  title: string;
  subtitle?: string;
  introText?: string;
  questions: SurveyQuestion[];
}

export type SurveyAnswers = Record<string, any>;

export interface SurveySubmissionPayload {
  submissionId: string;
  submittedAt: string;
  surveyVersion: string;
  answers: SurveyAnswers;
}
