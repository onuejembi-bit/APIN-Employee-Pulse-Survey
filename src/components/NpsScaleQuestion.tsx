/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NpsScaleQuestionProps {
  value: number | null | undefined;
  onChange: (val: number) => void;
  questionNumber: number;
}

export const NpsScaleQuestion: React.FC<NpsScaleQuestionProps> = ({
  value,
  onChange,
  questionNumber,
}) => {
  const scores = Array.from({ length: 11 }, (_, i) => i); // 0 to 10

  const getGroupTag = (score: number) => {
    if (score <= 6) return '0-6: Not likely';
    if (score <= 8) return '7-8: Neutral';
    return '9-10: Highly likely';
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Visual group indicators header */}
      <div className="hidden sm:flex justify-between items-center text-xs text-[#045877]/70 px-1 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300" aria-hidden="true"></span>
          0 – 6: Needs Improvement
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#37C8E0]" aria-hidden="true"></span>
          7 – 8: Neutral / Favourable
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#83D806]" aria-hidden="true"></span>
          9 – 10: Champion / Advocate
        </span>
      </div>

      {/* Button group grid / wrap */}
      <div
        role="radiogroup"
        aria-label={`Question ${questionNumber} recommendation score`}
        className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 sm:gap-2"
      >
        {scores.map((score) => {
          const isSelected = value === score;
          return (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${score} of 10 - ${getGroupTag(score)}`}
              onClick={() => onChange(score)}
              className={`
                h-12 sm:h-14 flex flex-col items-center justify-center rounded-xl font-bold text-base transition-all duration-200 select-none
                ${
                  isSelected
                    ? 'bg-[#83D806] text-[#045877] shadow-md shadow-[#83D806]/30 ring-2 ring-[#045877] scale-105 z-10'
                    : 'bg-white hover:bg-[#F5FAFB] text-[#045877] border border-slate-200 hover:border-[#37C8E0] active:scale-95'
                }
              `}
            >
              <span className="text-base sm:text-lg tabular-nums">{score}</span>
              <span className="text-[9px] uppercase font-semibold tracking-tighter opacity-70 sm:hidden">
                {score === 0 ? 'Low' : score === 10 ? 'High' : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scale end labels */}
      <div className="flex justify-between items-center text-xs text-slate-600 px-1 pt-1 font-medium">
        <span className="flex items-center gap-1">
          <strong className="text-[#045877]">0</strong> = Not at all likely
        </span>
        <span className="flex items-center gap-1 text-right">
          <strong className="text-[#045877]">10</strong> = Extremely likely
        </span>
      </div>

      {value !== undefined && value !== null && (
        <div className="p-2.5 rounded-lg bg-[#83D806]/10 border border-[#83D806]/40 flex items-center justify-between text-xs text-[#045877] mt-2">
          <span>
            Selected rating: <strong className="font-bold text-sm">{value} / 10</strong>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // @ts-ignore
              onChange(null);
            }}
            className="text-slate-500 hover:text-[#045877] underline text-xs ml-3"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
};
