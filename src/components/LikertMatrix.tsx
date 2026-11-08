/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LikertStatement } from '../types/survey';
import { Check } from 'lucide-react';

interface LikertMatrixProps {
  statements: LikertStatement[];
  options: string[];
  answers: Record<string, string>;
  onSelect: (statementId: string, optionValue: string) => void;
}

export const LikertMatrix: React.FC<LikertMatrixProps> = ({
  statements,
  options,
  answers,
  onSelect,
}) => {
  return (
    <div className="space-y-6">
      {/* DESKTOP VIEW: Matrix Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse" role="table">
          <thead>
            <tr className="bg-[#F5FAFB] border-b border-slate-200">
              <th
                scope="col"
                className="py-3.5 px-4 text-xs font-semibold text-[#045877] uppercase tracking-wider w-[42%]"
              >
                Statement
              </th>
              {options.map((opt, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="py-3.5 px-2 text-center text-xs font-semibold text-[#045877] tracking-tight leading-tight w-[11.6%]"
                >
                  {opt}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {statements.map((stmt) => {
              const currentVal = answers[stmt.id];
              return (
                <tr
                  key={stmt.id}
                  className="hover:bg-[#F5FAFB]/50 transition-colors duration-150"
                >
                  <td className="py-4 px-4 text-sm font-medium text-slate-800 leading-snug">
                    <div className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#045877]/10 text-[#045877] text-xs font-bold flex items-center justify-center mt-0.5">
                        {stmt.number}
                      </span>
                      <span>{stmt.text}</span>
                    </div>
                  </td>
                  {options.map((opt, optIdx) => {
                    const isSelected = currentVal === opt;
                    return (
                      <td key={optIdx} className="py-4 px-2 text-center">
                        <label
                          htmlFor={`${stmt.id}-${optIdx}`}
                          className={`
                            mx-auto w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150
                            ${
                              isSelected
                                ? 'bg-[#83D806] text-[#045877] ring-2 ring-[#045877] shadow-sm'
                                : 'border-2 border-slate-300 hover:border-[#37C8E0] bg-white text-transparent'
                            }
                          `}
                          title={`${opt} for question ${stmt.number}`}
                        >
                          <input
                            id={`${stmt.id}-${optIdx}`}
                            type="radio"
                            name={`matrix-${stmt.id}`}
                            value={opt}
                            checked={isSelected}
                            onChange={() => onSelect(stmt.id, opt)}
                            className="sr-only"
                          />
                          {isSelected ? (
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 opacity-0 group-hover:opacity-100" />
                          )}
                        </label>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE & TABLET VIEW: Stacked Cards with Horizontal/Vertical Choice Buttons */}
      <div className="lg:hidden space-y-4">
        {statements.map((stmt) => {
          const currentVal = answers[stmt.id];
          return (
            <div
              key={stmt.id}
              className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#045877] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {stmt.number}
                </span>
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {stmt.text}
                </p>
              </div>

              <div
                role="radiogroup"
                aria-label={`Question ${stmt.number}: ${stmt.text}`}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1"
              >
                {options.map((opt, optIdx) => {
                  const isSelected = currentVal === opt;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelect(stmt.id, opt)}
                      className={`
                        min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium text-left sm:text-center flex items-center sm:flex-col justify-between sm:justify-center gap-1 transition-all duration-150
                        ${
                          isSelected
                            ? 'bg-[#83D806] text-[#045877] font-bold border-2 border-[#045877] shadow-sm'
                            : 'bg-[#F5FAFB] hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }
                      `}
                    >
                      <span>{opt}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#045877] stroke-[3] sm:mt-1 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
