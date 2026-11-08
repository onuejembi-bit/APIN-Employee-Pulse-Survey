/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ApinLogo } from './ApinLogo';
import { SurveySubmissionPayload } from '../types/survey';
import {
  CheckCircle,
  Download,
  RotateCcw,
  Shield,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Database,
} from 'lucide-react';

interface ThankYouPageProps {
  payload: SurveySubmissionPayload | null;
  onRestartTest: () => void;
  alreadySubmittedNotice?: boolean;
  onOpenOwnerDashboard?: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  payload,
  onRestartTest,
  alreadySubmittedNotice,
  onOpenOwnerDashboard,
}) => {
  const handleDownloadJson = () => {
    if (!payload) return;
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `apin-survey-response-${payload.submissionId.slice(0, 8)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10 animate-fade-in py-6 text-center">
      {/* Already submitted warning if returning */}
      {alreadySubmittedNotice && (
        <div
          role="status"
          className="p-4 rounded-xl bg-[#37C8E0]/15 border border-[#37C8E0] text-[#045877] text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 text-left"
        >
          <div>
            <p className="font-bold">You have already submitted. Thank you!</p>
            <p className="text-xs text-slate-600 font-normal">
              Your responses have already been recorded. Multiple submissions from the same browser are prevented.
            </p>
          </div>
          <button
            type="button"
            onClick={onRestartTest}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-[#045877] hover:bg-slate-50 shrink-0"
          >
            Override for testing
          </button>
        </div>
      )}

      {/* Main Celebratory Card */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm flex flex-col items-center">
        {/* APIN Logo */}
        <div className="mb-6">
          <ApinLogo variant="hero" />
        </div>

        {/* Large Check Icon in Green */}
        <div className="w-20 h-20 rounded-full bg-[#83D806]/20 border-4 border-[#83D806] flex items-center justify-center text-[#045877] mb-6 shadow-sm">
          <CheckCircle className="w-12 h-12 stroke-[2.2] text-[#045877]" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#045877] tracking-tight">
          Thank you for sharing your voice
        </h1>

        {/* Core Message */}
        <p className="mt-4 text-base sm:text-lg font-medium text-slate-700 max-w-xl text-balance leading-relaxed">
          The CEO will report back to all staff on what was heard and what will be done.
        </p>

        {payload && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5FAFB] border border-slate-200 text-xs text-slate-500 font-mono">
            <span>Reference ID:</span>
            <span className="font-semibold text-slate-800">
              {payload.submissionId.slice(0, 13)}...
            </span>
          </div>
        )}

        {/* Protect / Change / Create Motifs */}
        <div className="mt-10 w-full pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#83D806]/10 border border-[#83D806]/40 flex flex-col items-center text-center">
            <Shield className="w-6 h-6 text-[#045877] mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#045877]">
              Protect
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Safeguarding APIN's strengths
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#37C8E0]/15 border border-[#37C8E0]/50 flex flex-col items-center text-center">
            <RefreshCw className="w-6 h-6 text-[#045877] mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#045877]">
              Change
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Streamlining work & welfare
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#045877]/10 border border-[#045877]/30 flex flex-col items-center text-center">
            <Sparkles className="w-6 h-6 text-[#045877] mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#045877]">
              Create
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Pioneering future health solutions
            </p>
          </div>
        </div>

        {/* Action Buttons: JSON Download, Owner Dashboard & Test Restart */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 w-full">
          {payload && (
            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F5FAFB] hover:bg-slate-100 text-[#045877] font-semibold text-xs sm:text-sm border border-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#045877]" />
              <span>Download my responses (JSON)</span>
            </button>
          )}

          {onOpenOwnerDashboard && (
            <button
              type="button"
              onClick={onOpenOwnerDashboard}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#045877] font-bold text-xs sm:text-sm border border-slate-300 transition-colors cursor-pointer shadow-2xs"
            >
              <Database className="w-4 h-4 text-[#83D806]" />
              <span>Owner Dashboard & CSV Backup</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRestartTest}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Back to start (Test Mode)</span>
          </button>
        </div>
      </section>

      {/* Trust & Next Steps Info */}
      <section className="bg-[#F5FAFB] rounded-2xl border border-slate-200/80 p-5 sm:p-6 text-xs text-slate-500 max-w-xl mx-auto space-y-2">
        <p className="font-semibold text-slate-700">What happens next?</p>
        <p>
          Aggregated, anonymized themes from across all Directorates and State Offices will be synthesized into the First 100 Days Report presented by the CEO.
        </p>
        <div className="pt-2">
          <a
            href="https://apin.org.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#045877] hover:underline"
          >
            <span>Learn more at apin.org.ng</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>
    </div>
  );
};
