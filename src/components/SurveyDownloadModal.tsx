/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Download,
  Check,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import {
  generatePrintableSurveyHtml,
  generatePlainTextSurvey,
  downloadFile,
  openPrintableSurveyWindow,
} from '../utils/surveyExporter';

interface SurveyDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewFullFormOnScreen?: () => void;
}

export const SurveyDownloadModal: React.FC<SurveyDownloadModalProps> = ({
  isOpen,
  onClose,
  onViewFullFormOnScreen,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const notifySuccess = (format: string) => {
    setDownloadSuccess(format);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrint = () => {
    openPrintableSurveyWindow();
    notifySuccess('Print window opened');
  };

  const handleDownloadHtml = () => {
    const htmlContent = generatePrintableSurveyHtml();
    downloadFile(
      htmlContent,
      'APIN-Employee-Pulse-Survey-Complete-Form.html',
      'text/html;charset=utf-8'
    );
    notifySuccess('Complete Form HTML downloaded');
  };

  const handleDownloadTxt = () => {
    const textContent = generatePlainTextSurvey();
    downloadFile(
      textContent,
      'APIN-Employee-Pulse-Survey-Questions.txt',
      'text/plain;charset=utf-8'
    );
    notifySuccess('Text Questionnaire downloaded');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="bg-[#045877] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#83D806] text-[#045877] flex items-center justify-center font-bold">
              <Download className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <h3 id="download-modal-title" className="text-base sm:text-lg font-bold">
                Download & Print Entire Survey Form
              </h3>
              <p className="text-xs text-slate-200">
                Exact cover pages, instructions, survey map, and all 54 questions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The full questionnaire contains the complete introductory cover pages, the CEO message, response instructions, the 8-section survey map, and all 54 questions exactly as displayed in the survey.
          </p>

          {downloadSuccess && (
            <div
              role="status"
              className="p-3 rounded-xl bg-[#83D806]/20 border border-[#83D806] text-[#045877] text-xs font-bold flex items-center gap-2 animate-fade-in"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{downloadSuccess} successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 1. Print / Save as PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-4 rounded-2xl border-2 border-[#045877]/20 hover:border-[#045877] bg-[#F5FAFB] hover:bg-white text-left transition-all duration-150 flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#045877] text-white flex items-center justify-center group-hover:bg-[#83D806] group-hover:text-[#045877] transition-colors">
                  <Printer className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#045877] bg-[#37C8E0]/20 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#045877]">
                  Print / Save as PDF
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Opens full form with cover pages and all 54 questions ready to print or save to PDF.
                </p>
              </div>
            </button>

            {/* 2. View Full Form On-Screen */}
            {onViewFullFormOnScreen && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewFullFormOnScreen();
                }}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#045877] bg-[#F5FAFB] hover:bg-white text-left transition-all duration-150 flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#045877]/10 text-[#045877] flex items-center justify-center group-hover:bg-[#045877] group-hover:text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Interactive
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    View Full Form On-Screen
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Scroll through the complete continuous form right inside this app.
                  </p>
                </div>
              </button>
            )}

            {/* 3. Download Form Document (.html / Word) */}
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="p-4 rounded-2xl border border-slate-200 hover:border-[#37C8E0] bg-[#F5FAFB] hover:bg-white text-left transition-all duration-150 flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#37C8E0] text-[#045877] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  .HTML / DOC
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Download Full Form (.html)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Complete standalone file including cover pages, survey map, and questions.
                </p>
              </div>
            </button>

            {/* 4. Download Plain Text (.txt) */}
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="p-4 rounded-2xl border border-slate-200 hover:border-[#37C8E0] bg-[#F5FAFB] hover:bg-white text-left transition-all duration-150 flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  .TXT
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Plain Text Questionnaire
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Clean text format containing instructions, map, and all 54 questions.
                </p>
              </div>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100/80 text-xs text-slate-600 flex items-center justify-between">
            <span>Includes Introduction, How to respond, Survey Map & 54 questions</span>
            <span className="font-semibold text-[#045877]">APIN Internal Survey</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
