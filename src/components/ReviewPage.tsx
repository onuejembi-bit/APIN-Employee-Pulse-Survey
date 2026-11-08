/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SURVEY_SECTIONS, getTotalSurveyQuestionCount } from '../data/surveyQuestions';
import { SurveyAnswers } from '../types/survey';
import {
  Edit3,
  Lock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
} from 'lucide-react';

interface ReviewPageProps {
  answers: SurveyAnswers;
  onJumpToSection: (sectionIndex: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError?: string | null;
  onOpenDownloadModal?: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  answers,
  onJumpToSection,
  onSubmit,
  isSubmitting,
  submitError,
  onOpenDownloadModal,
}) => {
  // Count total 54 questions and calculate skipped questions
  let answeredCount = 0;
  const totalQuestions = getTotalSurveyQuestionCount(); // Exactly 54 questions

  SURVEY_SECTIONS.forEach((section) => {
    section.questions.forEach((q) => {
      if (q.type === 'likert-matrix' && q.likertStatements) {
        q.likertStatements.forEach((stmt) => {
          const val = answers[stmt.id];
          if (val && typeof val === 'string' && val.trim().length > 0) {
            answeredCount++;
          }
        });
      } else if (q.type === 'ranking') {
        const rankObj = answers[q.id];
        if (rankObj && typeof rankObj === 'object' && Object.keys(rankObj).length > 0) {
          answeredCount++;
        }
      } else if (q.type === 'nps-scale') {
        const val = answers[q.id];
        if (val !== undefined && val !== null) {
          answeredCount++;
        }
      } else {
        const val = answers[q.id];
        if (val !== undefined && val !== null) {
          if (typeof val === 'string' && val.trim().length > 0) answeredCount++;
          else if (Array.isArray(val) && val.length > 0) answeredCount++;
          else if (typeof val === 'number') answeredCount++;
        }
      }
    });
  });

  const skippedCount = totalQuestions - answeredCount;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#045877]">
              Step 9 of 9 · Final Review
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#045877] mt-0.5">
              Review and submit your answers
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Check your responses before submitting. You may go back and edit any section.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            {onOpenDownloadModal && (
              <button
                type="button"
                onClick={onOpenDownloadModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#045877] text-xs font-bold text-[#045877] transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#045877]" />
                <span>Download full form</span>
              </button>
            )}

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#F5FAFB] border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-[#83D806]" />
              <div className="text-xs">
                <span className="font-bold text-[#045877] block">
                  {answeredCount} of {totalQuestions} answered
                </span>
                <span className="text-slate-500">
                  {skippedCount} skipped (allowed)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skipped questions friendly advisory note */}
        {skippedCount > 0 ? (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">
                You have {skippedCount} unanswered {skippedCount === 1 ? 'question' : 'questions'}.
              </span>{' '}
              All questions are optional; you may go back to answer them, or submit as is.
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-[#83D806]/15 border border-[#83D806]/40 text-[#045877] text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#045877]" />
            <span>Complete! All 54 questions have been addressed.</span>
          </div>
        )}
      </section>

      {/* Summary of Sections A to H */}
      <div className="space-y-6">
        {SURVEY_SECTIONS.map((section) => (
          <section
            key={section.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            <div className="bg-[#F5FAFB] px-5 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-[#045877] text-white text-xs font-bold flex items-center justify-center">
                  {section.id}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-[#045877]">
                  {section.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onJumpToSection(section.index)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#045877] hover:bg-white border border-slate-200 hover:border-[#045877] transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit section</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 divide-y divide-slate-100">
              {section.questions.map((q) => {
                // If Likert Matrix group
                if (q.type === 'likert-matrix' && q.likertStatements) {
                  return (
                    <div key={q.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-[#045877] uppercase tracking-wider">
                            {q.text}
                          </div>
                          {q.helperText && (
                            <p className="text-xs text-slate-500 mt-0.5">{q.helperText}</p>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                          {q.likertStatements.length} statements
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.likertStatements.map((stmt) => {
                          const stmtAnswer = answers[stmt.id];
                          return (
                            <div
                              key={stmt.id}
                              className="p-3 rounded-xl bg-[#F5FAFB]/60 border border-slate-100 text-xs"
                            >
                              <div className="flex items-start gap-1.5 text-slate-700 font-medium mb-1">
                                <span className="font-bold text-[#045877]">
                                  {stmt.number}.
                                </span>
                                <span>{stmt.text}</span>
                              </div>
                              <div className="mt-1.5">
                                {stmtAnswer ? (
                                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#83D806]/20 font-bold text-[#045877]">
                                    {stmtAnswer}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">
                                    Skipped
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // If Ranking Q37
                if (q.type === 'ranking') {
                  const rankObj = answers[q.id] as Record<number, string> | undefined;
                  const hasRanks = rankObj && Object.keys(rankObj).length > 0;

                  return (
                    <div key={q.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-[#045877] mt-0.5">
                          {q.number}.
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">
                            {q.text}
                          </p>
                          <div className="mt-2">
                            {hasRanks ? (
                              <div className="space-y-1">
                                {Object.entries(rankObj)
                                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                  .map(([r, item]) => (
                                    <div
                                      key={r}
                                      className="flex items-center gap-2 text-xs"
                                    >
                                      <span className="w-4 h-4 rounded-full bg-[#045877] text-white font-bold flex items-center justify-center text-[10px]">
                                        {r}
                                      </span>
                                      <span className="text-slate-700 font-medium">
                                        {item}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                Skipped
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // If NPS Scale Q25
                if (q.type === 'nps-scale') {
                  const npsVal = answers[q.id];
                  const isAnswered = npsVal !== undefined && npsVal !== null;

                  return (
                    <div key={q.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-[#045877] mt-0.5">
                          {q.number}.
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">
                            {q.text}
                          </p>
                          <div className="mt-1.5">
                            {isAnswered ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#83D806]/20 text-[#045877] font-bold text-xs">
                                <span>Rating:</span>
                                <span className="text-sm">{npsVal} / 10</span>
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                Skipped
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Standard Single/Multi/Open response
                const val = answers[q.id];
                const otherVal = answers[`${q.id}_other`];
                let displayVal: React.ReactNode = null;

                if (q.type === 'multi-select') {
                  if (Array.isArray(val) && val.length > 0) {
                    displayVal = (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {val.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2.5 py-0.5 rounded-md bg-[#F5FAFB] border border-slate-200 text-xs font-medium text-slate-800"
                          >
                            {item}
                            {item.includes('Other') && otherVal && (
                              <span className="text-[#045877] font-semibold ml-1">
                                ({otherVal})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    );
                  }
                } else if (q.type === 'open-response') {
                  if (val && typeof val === 'string' && val.trim().length > 0) {
                    displayVal = (
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-700 bg-[#F5FAFB] p-3 rounded-lg border border-slate-100 whitespace-pre-wrap leading-relaxed">
                        {val}
                      </p>
                    );
                  }
                } else {
                  // Single select
                  if (val && typeof val === 'string' && val.trim().length > 0) {
                    displayVal = (
                      <div className="mt-1 text-xs sm:text-sm text-slate-800 font-semibold flex items-center gap-1">
                        <span>{val}</span>
                        {val.includes('Other') && otherVal && (
                          <span className="text-[#045877] font-normal text-xs">
                            — "{otherVal}"
                          </span>
                        )}
                      </div>
                    );
                  }
                }

                return (
                  <div key={q.id} className="py-4 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-[#045877] mt-0.5">
                        {q.number}.
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {q.text}
                        </p>
                        {displayVal || (
                          <div className="mt-1 text-xs text-slate-400 italic">
                            Skipped
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* SUBMISSION FOOTER CARD */}
      <section className="bg-white rounded-2xl border-2 border-[#83D806]/60 p-6 sm:p-8 shadow-md">
        {submitError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-bold">Submission failed</p>
              <p className="text-xs mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Anonymity reminder */}
          <div className="flex items-center gap-3 text-slate-600 text-xs sm:text-sm">
            <div className="w-10 h-10 rounded-full bg-[#045877]/10 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#045877]" />
            </div>
            <div>
              <span className="font-bold text-[#045877] block text-sm">
                Strictly Anonymous Submission
              </span>
              <span>
                No IP address, name, device data or email is collected or stored.
              </span>
            </div>
          </div>

          {/* Submit button (green #83D806 background, deep teal bold text) */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className={`
              w-full md:w-auto min-h-[52px] px-10 py-3.5 rounded-xl font-extrabold text-base sm:text-lg transition-all duration-200 shadow-md shadow-[#83D806]/30 flex items-center justify-center gap-3 cursor-pointer
              ${
                isSubmitting
                  ? 'bg-[#83D806]/70 text-[#045877] opacity-80 cursor-wait'
                  : 'bg-[#83D806] hover:bg-[#72bf05] text-[#045877] active:scale-98'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#045877]" />
                <span>Recording responses...</span>
              </>
            ) : (
              <>
                <span>Submit survey</span>
                <Send className="w-5 h-5 text-[#045877]" />
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
