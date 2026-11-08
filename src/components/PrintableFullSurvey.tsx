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
  Layers,
  Heart,
  Printer,
  Download,
  ArrowLeft,
} from 'lucide-react';

interface PrintableFullSurveyProps {
  onBackToSurvey?: () => void;
  onDownloadHtml?: () => void;
}

export const PrintableFullSurvey: React.FC<PrintableFullSurveyProps> = ({
  onBackToSurvey,
  onDownloadHtml,
}) => {
  return (
    <div id="full-survey-printable-root" className="w-full max-w-4xl mx-auto space-y-10 pb-16">
      {/* Top Action Bar (Hidden during printing) */}
      <div className="no-print sticky top-3 z-50 bg-[#045877] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 border border-white/10">
        <div className="flex items-center gap-2">
          {onBackToSurvey && (
            <button
              type="button"
              onClick={onBackToSurvey}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Survey</span>
            </button>
          )}
          <span className="text-xs sm:text-sm font-semibold hidden md:inline">
            Complete Survey Form (Cover Page + All 54 Questions)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#83D806] hover:bg-[#72bf05] text-[#045877] text-xs font-extrabold shadow-sm transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print / Save to PDF</span>
          </button>

          {onDownloadHtml && (
            <button
              type="button"
              onClick={onDownloadHtml}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download HTML File</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. COVER PAGES (HERO, INTRODUCTION, HOW TO RESPOND, SURVEY MAP) */}
      {/* ========================================================================= */}
      <div className="space-y-8 sm:space-y-10">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#F5FAFB] to-white border border-slate-200/80 p-6 sm:p-10 md:p-12 shadow-sm text-center">
          {/* Decorative segmented rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full border-[10px] border-dashed border-[#83D806]/15 opacity-70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-28 w-96 h-96 rounded-full border-[12px] border-[#37C8E0]/15 opacity-60"
          />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Logo */}
            <div className="mb-6">
              <ApinLogo variant="hero" />
            </div>

            {/* Badges */}
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
          </div>
        </section>

        {/* INTRODUCTION / MESSAGE FROM THE CEO */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
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

        {/* SURVEY MAP */}
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
                className="p-3.5 rounded-xl border border-slate-200 bg-[#F5FAFB]/60"
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
      </div>

      {/* ========================================================================= */}
      {/* 2. THE 54 SURVEY QUESTIONS (SECTIONS A TO H) */}
      {/* ========================================================================= */}
      <div className="space-y-12">
        {SURVEY_SECTIONS.map((section) => (
          <div
            key={section.id}
            className="space-y-6 pt-4 border-t-2 border-dashed border-slate-200"
          >
            {/* Section Header */}
            <div className="bg-gradient-to-r from-white via-white to-[#F5FAFB] rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#045877]">
                  {section.subtitle}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Step {section.index} of 8
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#045877] tracking-tight">
                SECTION {section.id}. {section.title.toUpperCase()}
              </h2>

              {section.introText && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#F5FAFB] border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {section.introText}
                </div>
              )}
            </div>

            {/* Questions within Section */}
            <div className="space-y-6">
              {section.questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm"
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    {/* Number badge */}
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#045877] text-white flex items-center justify-center font-bold text-sm sm:text-base shrink-0 shadow-xs">
                      {question.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {question.text}
                      </h3>
                      {question.helperText && (
                        <div className="text-xs font-medium text-slate-500 mt-1">
                          {question.helperText}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1. SINGLE SELECT */}
                  {question.type === 'single-select' && question.options && (
                    <div className="space-y-2.5 pt-1">
                      {question.options.map((opt) => (
                        <div key={opt.id} className="space-y-1">
                          <div className="w-full min-h-[48px] p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-[#F5FAFB]/50 flex items-center justify-between gap-3 text-slate-700">
                            <span className="text-sm sm:text-base">{opt.label}</span>
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white shrink-0" />
                          </div>
                          {opt.isOther && (
                            <div className="pl-4 pt-1">
                              <div className="w-full p-2.5 rounded-lg border border-dashed border-slate-300 text-xs text-slate-400 bg-white">
                                Please specify (optional): __________________________________________________
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 2. MULTI SELECT */}
                  {question.type === 'multi-select' && question.options && (
                    <div className="space-y-2.5 pt-1">
                      {question.options.map((opt) => (
                        <div key={opt.id} className="space-y-1">
                          <div className="w-full min-h-[48px] p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-[#F5FAFB]/50 flex items-center justify-between gap-3 text-slate-700">
                            <span className="text-sm sm:text-base">{opt.label}</span>
                            <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white shrink-0" />
                          </div>
                          {opt.isOther && (
                            <div className="pl-4 pt-1">
                              <div className="w-full p-2.5 rounded-lg border border-dashed border-slate-300 text-xs text-slate-400 bg-white">
                                Please specify (optional): __________________________________________________
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. OPEN RESPONSE */}
                  {question.type === 'open-response' && (
                    <div className="space-y-2 pt-1">
                      <div className="w-full p-4 rounded-xl border border-slate-200 bg-[#F5FAFB]/40 min-h-[110px] space-y-4">
                        <div className="border-b border-dashed border-slate-200 h-6" />
                        <div className="border-b border-dashed border-slate-200 h-6" />
                        <div className="border-b border-dashed border-slate-200 h-6" />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                        <span>Please do not include names or details that could identify you or others.</span>
                        <span className="font-mono text-slate-400">Limit: {question.maxLength || 1500} characters</span>
                      </div>
                    </div>
                  )}

                  {/* 4. NPS SCALE Q25 */}
                  {question.type === 'nps-scale' && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 sm:gap-2">
                        {Array.from({ length: 11 }, (_, i) => i).map((score) => (
                          <div
                            key={score}
                            className="h-12 sm:h-14 flex flex-col items-center justify-center rounded-xl font-bold text-base bg-white border border-slate-200 text-[#045877]"
                          >
                            <span className="text-base sm:text-lg">{score}</span>
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 mt-1" />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-600 px-1 font-medium">
                        <span><strong className="text-[#045877]">0</strong> = Not at all likely</span>
                        <span><strong className="text-[#045877]">10</strong> = Extremely likely</span>
                      </div>
                    </div>
                  )}

                  {/* 5. LIKERT MATRIX Q31-Q34 */}
                  {question.type === 'likert-matrix' &&
                    question.likertStatements &&
                    question.likertOptions && (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#F5FAFB] border-b border-slate-200">
                              <th className="py-3 px-4 text-xs font-semibold text-[#045877] uppercase w-[40%]">
                                Statement
                              </th>
                              {question.likertOptions.map((opt, idx) => (
                                <th
                                  key={idx}
                                  className="py-3 px-2 text-center text-xs font-semibold text-[#045877] w-[12%]"
                                >
                                  {opt}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                            {question.likertStatements.map((stmt) => (
                              <tr key={stmt.id}>
                                <td className="py-3.5 px-4 font-medium text-slate-800">
                                  <span className="font-bold text-[#045877] mr-1">
                                    {stmt.number}.
                                  </span>
                                  {stmt.text}
                                </td>
                                {question.likertOptions?.map((_, oIdx) => (
                                  <td key={oIdx} className="py-3.5 px-2 text-center">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 mx-auto" />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* 6. RANKING Q37 */}
                  {question.type === 'ranking' && question.rankingItems && (
                    <div className="space-y-4 pt-1">
                      {/* Priority Slots */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-[#F5FAFB] space-y-2 text-xs sm:text-sm">
                        <div className="font-bold text-[#045877] mb-2">
                          Your Top 5 Priorities (Write 1 to 5):
                        </div>
                        {Array.from({ length: 5 }, (_, i) => i + 1).map((r) => (
                          <div key={r} className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#045877] text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {r}
                            </span>
                            <div className="flex-1 border-b border-dashed border-slate-300 h-6" />
                          </div>
                        ))}
                      </div>

                      {/* Candidate list */}
                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <div className="font-semibold text-slate-700">Options to select from:</div>
                        {question.rankingItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2"
                          >
                            <span className="text-slate-800">{idx + 1}. {item}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              {[1, 2, 3, 4, 5].map((chip) => (
                                <span
                                  key={chip}
                                  className="w-6 h-6 rounded border border-slate-200 bg-slate-50 text-slate-500 font-bold text-[10px] flex items-center justify-center"
                                >
                                  {chip}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Section H Closing Note */}
            {section.id === 'H' && (
              <div className="p-4 rounded-xl bg-[#83D806]/15 border border-[#83D806]/40 text-center text-sm font-bold text-[#045877] flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-[#045877] fill-[#83D806]" />
                <span>Thank you. Your voice matters.</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <ApinLogo variant="footer" />
          <span className="font-bold text-[#045877]">APIN Employee Pulse Survey</span>
        </div>
        <div>Responses are strictly confidential and anonymous · © APIN</div>
      </footer>
    </div>
  );
};
