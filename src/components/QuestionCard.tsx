/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { SurveyQuestion } from '../types/survey';
import { Check, ShieldAlert } from 'lucide-react';
import { NpsScaleQuestion } from './NpsScaleQuestion';
import { LikertMatrix } from './LikertMatrix';
import { RankPriorityQuestion } from './RankPriorityQuestion';

interface QuestionCardProps {
  question: SurveyQuestion;
  answers: Record<string, any>;
  onAnswerChange: (questionId: string, val: any) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answers,
  onAnswerChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 110)}px`;
    }
  }, [answers[question.id]]);

  // Handler for single-select
  const handleSingleSelect = (optionLabel: string, isOther?: boolean) => {
    onAnswerChange(question.id, optionLabel);
    if (!isOther) {
      onAnswerChange(`${question.id}_other`, '');
    }
  };

  // Handler for multi-select
  const handleMultiSelect = (optionLabel: string, isExclusiveNone?: boolean, isOther?: boolean) => {
    const currentList: string[] = Array.isArray(answers[question.id]) ? [...answers[question.id]] : [];
    const index = currentList.indexOf(optionLabel);

    if (index > -1) {
      // Deselecting
      currentList.splice(index, 1);
      if (isOther) {
        onAnswerChange(`${question.id}_other`, '');
      }
      onAnswerChange(question.id, currentList);
    } else {
      // Selecting
      // If exclusive none (e.g. Q21 "No change needed")
      if (isExclusiveNone) {
        onAnswerChange(question.id, [optionLabel]);
        onAnswerChange(`${question.id}_other`, '');
        return;
      }

      // If user had selected "No change needed" before, strip it out when selecting another option
      const filtered = currentList.filter((item) => item !== 'No change needed');

      // Check max limit if defined
      if (question.maxSelections && filtered.length >= question.maxSelections) {
        return; // Don't allow selecting more than max
      }

      filtered.push(optionLabel);
      onAnswerChange(question.id, filtered);
    }
  };

  const currentMultiList: string[] = Array.isArray(answers[question.id]) ? answers[question.id] : [];
  const isMaxReached = Boolean(
    question.maxSelections && currentMultiList.length >= question.maxSelections
  );

  return (
    <article
      id={`question-${question.number}`}
      aria-labelledby={`q-heading-${question.id}`}
      className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-[#045877]/20"
    >
      <header className="flex items-start gap-3 sm:gap-4 mb-4">
        {/* Number Badge: Deep Teal Circle with White Number */}
        <div
          aria-hidden="true"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#045877] text-white flex items-center justify-center font-bold text-sm sm:text-base shrink-0 shadow-xs"
        >
          {question.number}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            id={`q-heading-${question.id}`}
            className="text-base sm:text-lg font-bold text-slate-900 leading-snug"
          >
            {question.text}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs font-medium text-slate-500">
              {question.helperText}
            </span>

            {/* Live counter for "select up to N" */}
            {question.type === 'multi-select' && question.maxSelections && (
              <span
                role="status"
                aria-live="polite"
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isMaxReached
                    ? 'bg-[#83D806]/20 text-[#045877] border border-[#83D806]'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {currentMultiList.length} of {question.maxSelections} selected
              </span>
            )}
          </div>
        </div>
      </header>

      {/* QUESTION BODIES ACCORDING TO TYPE */}

      {/* 1. SINGLE SELECT: Radio Cards */}
      {question.type === 'single-select' && question.options && (
        <fieldset className="space-y-2.5 pt-1">
          <legend className="sr-only">{question.text}</legend>
          {question.options.map((opt) => {
            const isSelected = answers[question.id] === opt.label;
            return (
              <div key={opt.id} className="space-y-2">
                <label
                  htmlFor={opt.id}
                  className={`
                    w-full min-h-[52px] p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 select-none
                    ${
                      isSelected
                        ? 'border-2 border-[#83D806] bg-[#83D806]/10 text-[#045877] font-semibold shadow-xs'
                        : 'border-slate-200 hover:border-[#37C8E0] bg-white text-slate-700 hover:bg-[#F5FAFB]'
                    }
                  `}
                >
                  <span className="text-sm sm:text-base leading-snug">{opt.label}</span>
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                      ${
                        isSelected
                          ? 'border-[#045877] bg-[#83D806]'
                          : 'border-slate-300 bg-white'
                      }
                    `}
                  >
                    <input
                      id={opt.id}
                      type="radio"
                      name={`question-${question.id}`}
                      value={opt.label}
                      checked={isSelected}
                      onChange={() => handleSingleSelect(opt.label, opt.isOther)}
                      className="sr-only"
                    />
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#045877] stroke-[3]" />
                    )}
                  </div>
                </label>

                {/* OTHER / SELF-DESCRIBE CONDITIONAL INPUT */}
                {opt.isOther && isSelected && (
                  <div className="pl-4 sm:pl-6 pt-1 animate-fade-in">
                    <label htmlFor={`${question.id}_other_input`} className="sr-only">
                      Specify {opt.label}
                    </label>
                    <input
                      id={`${question.id}_other_input`}
                      type="text"
                      maxLength={150}
                      value={answers[`${question.id}_other`] || ''}
                      onChange={(e) =>
                        onAnswerChange(`${question.id}_other`, e.target.value)
                      }
                      placeholder="Please specify (optional). Avoid identifying details."
                      className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:border-[#045877] focus:ring-1 focus:ring-[#045877] bg-white placeholder:text-slate-400"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>
      )}

      {/* 2. MULTI SELECT: Checkbox Cards */}
      {question.type === 'multi-select' && question.options && (
        <fieldset className="space-y-2.5 pt-1">
          <legend className="sr-only">{question.text}</legend>
          {question.options.map((opt) => {
            const isSelected = currentMultiList.includes(opt.label);
            const isRowDisabled = !isSelected && isMaxReached;

            return (
              <div key={opt.id} className="space-y-2">
                <label
                  htmlFor={opt.id}
                  className={`
                    w-full min-h-[52px] p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 transition-all duration-150 select-none
                    ${
                      isRowDisabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                        : isSelected
                        ? 'border-2 border-[#83D806] bg-[#83D806]/10 text-[#045877] font-semibold shadow-xs cursor-pointer'
                        : 'border-slate-200 hover:border-[#37C8E0] bg-white text-slate-700 hover:bg-[#F5FAFB] cursor-pointer'
                    }
                  `}
                >
                  <span className="text-sm sm:text-base leading-snug">{opt.label}</span>
                  <div
                    className={`
                      w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                      ${
                        isSelected
                          ? 'border-[#045877] bg-[#83D806]'
                          : isRowDisabled
                          ? 'border-slate-200 bg-slate-100'
                          : 'border-slate-300 bg-white'
                      }
                    `}
                  >
                    <input
                      id={opt.id}
                      type="checkbox"
                      name={`question-${question.id}`}
                      value={opt.label}
                      checked={isSelected}
                      disabled={isRowDisabled}
                      onChange={() =>
                        handleMultiSelect(opt.label, opt.isExclusiveNone, opt.isOther)
                      }
                      className="sr-only"
                    />
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#045877] stroke-[3]" />
                    )}
                  </div>
                </label>

                {/* OTHER CONDITIONAL TEXT INPUT */}
                {opt.isOther && isSelected && (
                  <div className="pl-4 sm:pl-6 pt-1 animate-fade-in">
                    <label htmlFor={`${question.id}_other_input`} className="sr-only">
                      Specify {opt.label}
                    </label>
                    <input
                      id={`${question.id}_other_input`}
                      type="text"
                      maxLength={150}
                      value={answers[`${question.id}_other`] || ''}
                      onChange={(e) =>
                        onAnswerChange(`${question.id}_other`, e.target.value)
                      }
                      placeholder="Please specify (optional). Avoid identifying details."
                      className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:border-[#045877] focus:ring-1 focus:ring-[#045877] bg-white placeholder:text-slate-400"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>
      )}

      {/* 3. OPEN RESPONSE: Large auto-growing textarea with char counter & privacy reminder */}
      {question.type === 'open-response' && (
        <div className="space-y-2 pt-1">
          <label htmlFor={`textarea-${question.id}`} className="sr-only">
            {question.text}
          </label>
          <div className="relative">
            <textarea
              id={`textarea-${question.id}`}
              ref={textareaRef}
              rows={question.rows || 4}
              maxLength={question.maxLength || 1500}
              value={answers[question.id] || ''}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              placeholder="Type your response here..."
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-[#045877] focus:ring-2 focus:ring-[#045877]/20 text-slate-800 text-sm sm:text-base leading-relaxed bg-[#F5FAFB]/40 resize-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
            {/* Privacy reminder note */}
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShieldAlert className="w-3.5 h-3.5 text-[#045877] shrink-0" />
              <span>
                Please do not include names or details that could identify you or others.
              </span>
            </div>

            {/* Character counter */}
            <span
              className={`font-mono text-xs tabular-nums ${
                (answers[question.id] || '').length > 1400
                  ? 'text-amber-600 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {(answers[question.id] || '').length} / {question.maxLength || 1500}
            </span>
          </div>
        </div>
      )}

      {/* 4. NPS SCALE (Q25) */}
      {question.type === 'nps-scale' && (
        <NpsScaleQuestion
          questionNumber={question.number}
          value={answers[question.id]}
          onChange={(val) => onAnswerChange(question.id, val)}
        />
      )}

      {/* 5. LIKERT MATRIX (Q31-Q34) */}
      {question.type === 'likert-matrix' &&
        question.likertStatements &&
        question.likertOptions && (
          <LikertMatrix
            statements={question.likertStatements}
            options={question.likertOptions}
            answers={answers}
            onSelect={(statementId, val) => onAnswerChange(statementId, val)}
          />
        )}

      {/* 6. RANKING (Q37) */}
      {question.type === 'ranking' && question.rankingItems && (
        <RankPriorityQuestion
          items={question.rankingItems}
          maxRank={question.maxRank || 5}
          value={answers[question.id]}
          onChange={(val) => onAnswerChange(question.id, val)}
        />
      )}
    </article>
  );
};
