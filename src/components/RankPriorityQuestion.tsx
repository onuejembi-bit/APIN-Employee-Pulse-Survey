/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowDown, ArrowUp, RotateCcw, Award } from 'lucide-react';

interface RankPriorityQuestionProps {
  items: string[];
  maxRank?: number; // default 5
  value: Record<number, string> | undefined; // { 1: "item", 2: "item", ... }
  onChange: (val: Record<number, string>) => void;
}

export const RankPriorityQuestion: React.FC<RankPriorityQuestionProps> = ({
  items,
  maxRank = 5,
  value = {},
  onChange,
}) => {
  const [reassignNote, setReassignNote] = useState<string | null>(null);

  // Map each item to its assigned rank (if any)
  const itemToRankMap = new Map<string, number>();
  Object.entries(value).forEach(([rankStr, itemName]) => {
    const rankNum = parseInt(rankStr, 10);
    if (rankNum >= 1 && rankNum <= maxRank && itemName) {
      itemToRankMap.set(itemName, rankNum);
    }
  });

  const handleRankSelect = (item: string, selectedRank: number) => {
    const currentRankOfThisItem = itemToRankMap.get(item);
    const updated: Record<number, string> = { ...value };

    // If user tapped the same rank that this item already has, toggle off (unrank)
    if (currentRankOfThisItem === selectedRank) {
      delete updated[selectedRank];
      setReassignNote(null);
      onChange(updated);
      return;
    }

    // If another item currently had this selected rank, move it
    const previousOwnerOfRank = updated[selectedRank];
    if (previousOwnerOfRank && previousOwnerOfRank !== item) {
      setReassignNote(`Rank #${selectedRank} reassigned to "${item.substring(0, 36)}..."`);
      setTimeout(() => setReassignNote(null), 3500);
    } else {
      setReassignNote(null);
    }

    // If this item previously held a different rank, remove that old rank
    if (currentRankOfThisItem) {
      delete updated[currentRankOfThisItem];
    }

    // Assign the new rank
    updated[selectedRank] = item;
    onChange(updated);
  };

  const handleClearAll = () => {
    onChange({});
    setReassignNote(null);
  };

  const handleMoveRank = (rank: number, direction: 'up' | 'down') => {
    const targetRank = direction === 'up' ? rank - 1 : rank + 1;
    if (targetRank < 1 || targetRank > maxRank) return;

    const itemA = value[rank];
    const itemB = value[targetRank];

    const updated = { ...value };
    if (itemA) updated[targetRank] = itemA;
    else delete updated[targetRank];

    if (itemB) updated[rank] = itemB;
    else delete updated[rank];

    onChange(updated);
  };

  const rankedCount = Object.keys(value).filter(
    (k) => parseInt(k, 10) >= 1 && parseInt(k, 10) <= maxRank && value[parseInt(k, 10)]
  ).length;

  return (
    <div className="space-y-6">
      {/* Live Reassignment Feedback Toast */}
      {reassignNote && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 bg-[#37C8E0]/15 border border-[#37C8E0] text-[#045877] text-xs font-semibold rounded-lg flex items-center justify-between animate-fade-in"
        >
          <span>{reassignNote}</span>
          <button
            type="button"
            onClick={() => setReassignNote(null)}
            className="text-xs text-[#045877] underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOP FIVE SUMMARY PANEL */}
      <div className="rounded-2xl border-2 border-[#83D806]/40 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#83D806] text-[#045877] flex items-center justify-center font-black">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#045877]">Your Top 5 Priorities</h4>
              <p className="text-xs text-slate-500">
                {rankedCount} of 5 positions ranked
              </p>
            </div>
          </div>
          {rankedCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear ranking</span>
            </button>
          )}
        </div>

        <div className="mt-3 divide-y divide-slate-100">
          {Array.from({ length: maxRank }, (_, i) => i + 1).map((rank) => {
            const item = value[rank];
            return (
              <div
                key={rank}
                className="py-2.5 flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                      ${
                        item
                          ? 'bg-[#045877] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-dashed border-slate-300'
                      }
                    `}
                  >
                    {rank}
                  </span>
                  {item ? (
                    <span className="font-medium text-slate-800 truncate">
                      {item}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">
                      Position #{rank} unassigned (select below)
                    </span>
                  )}
                </div>

                {item && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      aria-label={`Move rank ${rank} up`}
                      disabled={rank === 1}
                      onClick={() => handleMoveRank(rank, 'up')}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move rank ${rank} down`}
                      disabled={rank === maxRank}
                      onClick={() => handleMoveRank(rank, 'down')}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${item} from rank ${rank}`}
                      onClick={() => {
                        const updated = { ...value };
                        delete updated[rank];
                        onChange(updated);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 ml-1 px-1.5 py-0.5 rounded"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* LIST OF CANDIDATE ITEMS WITH RANK CHIPS */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-[#045877] uppercase tracking-wider">
          Tap 1–5 on any item to assign priority:
        </p>
        {items.map((item, index) => {
          const currentRank = itemToRankMap.get(item);
          return (
            <div
              key={index}
              className={`
                p-3.5 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3
                ${
                  currentRank
                    ? 'bg-[#83D806]/10 border-[#83D806] shadow-xs'
                    : 'bg-white border-slate-200 hover:border-[#37C8E0]'
                }
              `}
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="text-xs text-slate-400 font-mono mt-0.5 shrink-0">
                  {index + 1}.
                </span>
                <span
                  className={`text-sm leading-snug ${
                    currentRank ? 'font-bold text-[#045877]' : 'text-slate-800'
                  }`}
                >
                  {item}
                </span>
              </div>

              {/* 1-5 Chip Selectors */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <span className="text-[11px] text-slate-500 mr-1 sm:hidden">
                  Rank:
                </span>
                {Array.from({ length: maxRank }, (_, i) => i + 1).map((rank) => {
                  const isThisRank = currentRank === rank;
                  const isOccupiedByOther =
                    value[rank] && value[rank] !== item;

                  return (
                    <button
                      key={rank}
                      type="button"
                      onClick={() => handleRankSelect(item, rank)}
                      title={
                        isThisRank
                          ? `Rank #${rank} (Click to remove)`
                          : isOccupiedByOther
                          ? `Currently assigned to: "${value[rank]}". Click to move #${rank} here.`
                          : `Assign rank #${rank}`
                      }
                      className={`
                        w-9 h-9 sm:w-8 sm:h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all duration-150 relative
                        ${
                          isThisRank
                            ? 'bg-[#83D806] text-[#045877] ring-2 ring-[#045877] shadow-sm font-black scale-105'
                            : isOccupiedByOther
                            ? 'bg-slate-100 hover:bg-amber-100 text-slate-600 border border-dashed border-slate-300'
                            : 'bg-[#F5FAFB] hover:bg-[#37C8E0]/20 text-[#045877] border border-slate-200'
                        }
                      `}
                    >
                      {rank}
                      {isOccupiedByOther && !isThisRank && (
                        <span
                          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"
                          title="Occupied (will swap)"
                        />
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
