/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ApinLogo } from './ApinLogo';
import { SURVEY_SECTIONS, getSectionQuestionCount } from '../data/surveyQuestions';
import {
  Lock,
  Clock,
  ListFilter,
  CheckCircle2,
  ArrowRight,
  Layers,
  Download,
} from 'lucide-react';

interface WelcomePageProps {
  onStartSurvey: () => void;
  hasSavedDraft?: boolean;
  onContinueDraft?: () => void;
  onStartOver?: () => void;
  onOpenDownloadModal?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onStartSurvey,
  hasSavedDraft,
  onContinueDraft,
  onStartOver,
  onOpenDownloadModal,
}) => {
  return (
    <div className="space-y-10 sm:space-y-14 animate-fade-in">
      {/* 1. HERO SECTION WITH SEGMENTED RING MOTIF */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#F5FAFB] to-white border border-slate-200/80 p-6 sm:p-10 md:p-12 shadow-sm text-center">
        {/* Subtle decorative segmented rings & arcs inspired by the APIN globe motif */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full border-[10px] border-dashed border-[#83D806]/15 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-28 w-96 h-96 rounded-full border-[12px] border-[#37C8E0]/15 opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full border border-[#045877]/5"
        />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Hero Logo */}
          <div className="mb-6">
            <ApinLogo variant="hero" />
          </div>

          {/* Badge Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#83D806]/15 border border-[#83D806]/40 text-[#045877] text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-[#045877]" />
              Anonymous
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#37C8E0]/15 border border-[#37C8E0]/40 text-[#045877] text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#045877]" />
              About 10–15 minutes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#045877]/10 border border-[#045877]/20 text-[#045877] text-xs font-semibold">
              <ListFilter className="w-3.5 h-3.5 text-[#045877]" />
              54 questions in 8 sections
            </span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#045877] tracking-tight text-balance leading-tight">
            APIN Employee Pulse Survey
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-medium text-slate-700 max-w-2xl text-balance">
            Expectations for the First 100 Days and Beyond
          </p>

          {/* Primary & Download CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            {hasSavedDraft && onContinueDraft ? (
              <>
                <button
                  type="button"
                  onClick={onContinueDraft}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-[#045877] hover:bg-[#02384d] text-white font-bold text-base shadow-md shadow-[#045877]/20 transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Continue saved response</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={onStartOver}
                  className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Start new response
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStartSurvey}
                className="w-full sm:w-auto min-h-[50px] px-9 py-3.5 rounded-xl bg-[#045877] hover:bg-[#02384d] text-white font-bold text-base sm:text-lg shadow-md shadow-[#045877]/25 transition-all duration-200 active:scale-98 flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Start the survey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {onOpenDownloadModal && (
              <button
                type="button"
                onClick={onOpenDownloadModal}
                className="w-full sm:w-auto min-h-[50px] px-6 py-3.5 rounded-xl border-2 border-[#045877] text-[#045877] hover:bg-[#045877]/5 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4 text-[#045877]" />
                <span>Download entire form</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE SURVEY / MESSAGE FROM THE CEO */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Warm quote card with left green accent bar */}
        <div className="border-l-4 border-[#83D806] pl-5 sm:pl-7 py-1">
          <h2 className="text-lg sm:text-xl font-bold text-[#045877] mb-3">
            Dear Colleagues,
          </h2>
          <div className="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <p>
              In his First 100 Days Compact, our CEO committed to understanding APIN before changing APIN. He has asked three questions: what should we protect, what should we change, and what should we create? This survey is one way to answer them, in your own voice.
            </p>
            <p>
              Your answers will help leadership shape priorities on growth, staff welfare, culture, flexibility, policies and benefits, and will set a baseline Satisfaction Index so we can measure progress together.
            </p>
            <p className="font-semibold text-[#045877]">
              The CEO will report back to all staff on what was heard and what will be done.
            </p>
          </div>
        </div>
      </section>

      {/* HOW TO RESPOND CHECKLIST */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-[#045877] mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#83D806]" />
          <span>How to respond</span>
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
          <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5FAFB] border border-slate-100">
            <span className="text-[#83D806] font-black text-base mt-0.5">✓</span>
            <span>Please answer based on your own experience.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5FAFB] border border-slate-100">
            <span className="text-[#83D806] font-black text-base mt-0.5">✓</span>
            <span>
              Unless the survey is explicitly configured otherwise, do not include your name or details that could identify you or any other staff member.
            </span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5FAFB] border border-slate-100">
            <span className="text-[#83D806] font-black text-base mt-0.5">✓</span>
            <span>There are no right or wrong answers. Answer honestly, based on your own experience.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5FAFB] border border-slate-100">
            <span className="text-[#83D806] font-black text-base mt-0.5">✓</span>
            <span>For rating questions, select one answer.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5FAFB] border border-slate-100">
            <span className="text-[#83D806] font-black text-base mt-0.5">✓</span>
            <span>For "select all" questions, choose every option that applies.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5FAFB] border border-slate-100">
            <span className="text-[#83D806] font-black text-base mt-0.5">✓</span>
            <span>We encourage you to answer as many questions as possible. If possible, please answer all the questions.</span>
          </li>
        </ul>
      </section>

      {/* 5. SURVEY MAP: 8 SECTIONS */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-[#045877]" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#045877]">
              Survey Map
            </h2>
            <p className="text-xs text-slate-500">
              Overview of all 8 sections (A to H)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SURVEY_SECTIONS.map((sec) => (
            <div
              key={sec.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-[#F5FAFB]/60 hover:bg-white hover:border-[#37C8E0] transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#045877] text-white text-xs font-bold flex items-center justify-center whitespace-nowrap">
                  Section {sec.id}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {getSectionQuestionCount(sec)} questions
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#045877] leading-snug line-clamp-2">
                {sec.title}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION & FOOTNOTE */}
      <div className="text-center py-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStartSurvey}
            className="w-full sm:w-auto min-h-[52px] px-10 py-3.5 rounded-xl bg-[#045877] hover:bg-[#02384d] text-white font-bold text-base sm:text-lg shadow-lg shadow-[#045877]/25 transition-all duration-200 active:scale-98 inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Start the survey</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {onOpenDownloadModal && (
            <button
              type="button"
              onClick={onOpenDownloadModal}
              className="w-full sm:w-auto min-h-[52px] px-7 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base transition-colors inline-flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#045877]" />
              <span>Download Form (PDF / HTML / TXT)</span>
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Thank you for helping shape the future of APIN.
        </p>
      </div>
    </div>
  );
};
