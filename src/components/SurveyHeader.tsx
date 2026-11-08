/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ApinLogo } from './ApinLogo';
import { Lock, Download, Database } from 'lucide-react';
import { SURVEY_SECTIONS } from '../data/surveyQuestions';

interface SurveyHeaderProps {
  currentSectionIndex: number; // 1 to 8 (or 0 for welcome, 9 for review, 10 for thank you)
  stepType: 'welcome' | 'section' | 'review' | 'submitted';
  onNavigateToSection?: (sectionIndex: number) => void;
  onGoHome?: () => void;
  onOpenDownloadModal?: () => void;
  onOpenOwnerDashboard?: () => void;
}

export const SurveyHeader: React.FC<SurveyHeaderProps> = ({
  currentSectionIndex,
  stepType,
  onNavigateToSection,
  onGoHome,
  onOpenDownloadModal,
  onOpenOwnerDashboard,
}) => {
  const currentSection = SURVEY_SECTIONS.find((s) => s.index === currentSectionIndex);

  // Compute progress percentage across 8 sections
  let progressPercent = 0;
  if (stepType === 'welcome') progressPercent = 0;
  else if (stepType === 'review') progressPercent = 100;
  else if (stepType === 'submitted') progressPercent = 100;
  else progressPercent = Math.round(((currentSectionIndex - 1) / 8) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Top-Left: APIN Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGoHome}
              title="Return to Welcome Page"
              className="focus-visible:ring-2 focus-visible:ring-[#045877] rounded-lg transition-opacity hover:opacity-90 text-left"
            >
              <ApinLogo variant="header" />
            </button>
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#045877]">
                Employee Pulse Survey
              </span>
              <span className="block text-[11px] text-slate-500 truncate max-w-[220px]">
                First 100 Days and Beyond
              </span>
            </div>
          </div>

          {/* Top-Right: Actions, Section Status & Anonymity Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenDownloadModal && (
              <button
                type="button"
                onClick={onOpenDownloadModal}
                title="Download or Print full survey questionnaire"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#045877] bg-white hover:bg-[#F5FAFB] text-xs font-bold text-[#045877] transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#045877]" />
                <span className="hidden sm:inline">Download Form</span>
                <span className="sm:hidden">Form</span>
              </button>
            )}

            {onOpenOwnerDashboard && (
              <button
                type="button"
                onClick={onOpenOwnerDashboard}
                title="Open Owner Dashboard & Cloud Sync"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#045877] bg-white hover:bg-[#F5FAFB] text-xs font-bold text-[#045877] transition-colors shadow-2xs cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-[#83D806]" />
                <span className="hidden lg:inline">Owner Dashboard</span>
              </button>
            )}

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#F5FAFB] border border-slate-200 text-xs font-medium text-[#045877]">
              <Lock className="w-3.5 h-3.5 text-[#045877]" aria-hidden="true" />
              <span>Anonymous</span>
            </div>

            {stepType === 'section' && currentSection && (
              <div className="text-right">
                <div className="text-xs font-bold text-[#045877]">
                  Section {currentSection.id} of 8
                </div>
                <div className="text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-[180px]">
                  {currentSection.title}
                </div>
              </div>
            )}

            {stepType === 'review' && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#37C8E0]/20 text-[#045877]">
                Review & Submit
              </span>
            )}

            {currentSectionIndex === -1 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#83D806]/20 text-[#045877]">
                Full Form View
              </span>
            )}
          </div>
        </div>

        {/* Sticky Progress Indicator (Shown during survey sections & review) */}
        {(stepType === 'section' || stepType === 'review') && (
          <div className="mt-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1.5 font-medium">
              <span className="truncate">
                {stepType === 'review'
                  ? 'All sections complete — ready for review'
                  : currentSection?.title}
              </span>
              <span className="font-semibold text-[#045877] tabular-nums shrink-0 ml-2">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Segmented Progress Bar (8 segments) */}
            <div
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Survey progress: ${progressPercent}%`}
              className="grid grid-cols-8 gap-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden"
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((segIdx) => {
                const isPassedOrCurrent =
                  stepType === 'review' || segIdx <= currentSectionIndex;
                const isCurrent =
                  stepType === 'section' && segIdx === currentSectionIndex;

                return (
                  <div
                    key={segIdx}
                    onClick={() => onNavigateToSection && onNavigateToSection(segIdx)}
                    title={`Go to Section ${String.fromCharCode(64 + segIdx)}`}
                    className={`
                      h-full rounded-full transition-all duration-300
                      ${
                        isCurrent
                          ? 'bg-gradient-to-r from-[#83D806] to-[#37C8E0] shadow-xs'
                          : isPassedOrCurrent
                          ? 'bg-[#83D806]'
                          : 'bg-slate-200'
                      }
                      ${onNavigateToSection ? 'cursor-pointer hover:opacity-80' : ''}
                    `}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
