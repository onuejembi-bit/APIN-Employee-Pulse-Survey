/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ApinLogo } from './ApinLogo';
import { Lock, ShieldCheck, Database } from 'lucide-react';

interface SurveyFooterProps {
  onOpenOwnerDashboard?: () => void;
}

export const SurveyFooter: React.FC<SurveyFooterProps> = ({ onOpenOwnerDashboard }) => {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Left: APIN Logo + Name */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <ApinLogo variant="footer" />
          <div className="text-xs text-slate-500">
            <span className="font-bold text-[#045877] block sm:inline">
              APIN Employee Pulse Survey
            </span>
            <span className="hidden sm:inline"> · </span>
            <span>Expectations for the First 100 Days and Beyond</span>
          </div>
        </div>

        {/* Center: Anonymity Guarantee & Owner Dashboard Button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5FAFB] border border-slate-200 text-xs text-[#045877]">
            <Lock className="w-3.5 h-3.5 text-[#045877]" aria-hidden="true" />
            <span className="font-semibold">Responses are strictly anonymous</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#83D806]" aria-hidden="true" />
          </div>

          {onOpenOwnerDashboard && (
            <button
              type="button"
              onClick={onOpenOwnerDashboard}
              title="Open Owner Dashboard & Google Sheets Cloud Sync"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#045877] text-slate-600 hover:text-white border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Owner Dashboard</span>
            </button>
          )}
        </div>

        {/* Right: Copyright */}
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} APIN Public Health Initiatives. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
