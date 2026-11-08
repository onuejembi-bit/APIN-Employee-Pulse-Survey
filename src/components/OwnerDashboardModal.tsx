/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  RefreshCw,
  CheckCircle2,
  Database,
  ExternalLink,
  Shield,
  Clock,
  Trash2,
  AlertCircle,
  Copy,
  Check,
  Server,
  CloudCheck,
} from 'lucide-react';
import {
  CONFIG,
  getLocalBackups,
  getPendingResponsesCount,
  retryPendingResponses,
  clearAllLocalBackups,
} from '../services/submissionService';
import { downloadLocalBackupCsv, downloadFile } from '../utils/surveyExporter';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [localBackups, setLocalBackups] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const refreshData = () => {
    setLocalBackups(getLocalBackups());
    setPendingCount(getPendingResponsesCount());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
      setSyncStatusMessage(null);
      setConfirmClear(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(CONFIG.GOOGLE_SCRIPT_URL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const handleDownloadCsv = () => {
    downloadLocalBackupCsv(localBackups);
  };

  const handleDownloadJson = () => {
    const dataStr = JSON.stringify(localBackups, null, 2);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(dataStr, `APIN-Survey-Local-Backup-${timestamp}.json`, 'application/json');
  };

  const handleRetrySync = async () => {
    setIsSyncing(true);
    setSyncStatusMessage(null);
    try {
      const result = await retryPendingResponses();
      refreshData();
      if (result.retried > 0) {
        setSyncStatusMessage(
          `Successfully uploaded ${result.retried} queued response(s) to Google Sheets!`
        );
      } else if (result.remaining === 0) {
        setSyncStatusMessage('All responses are already up to date in Google Sheets.');
      } else {
        setSyncStatusMessage(
          `Network attempt completed. ${result.remaining} item(s) remain in pending queue.`
        );
      }
    } catch {
      setSyncStatusMessage('Error while attempting to sync pending responses.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearData = () => {
    clearAllLocalBackups();
    refreshData();
    setConfirmClear(false);
    setSyncStatusMessage('Local test data cleared.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-dashboard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        {/* Modal Header */}
        <div className="bg-[#045877] text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#83D806] text-[#045877] flex items-center justify-center font-bold">
              <Database className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="owner-dashboard-title" className="text-base sm:text-lg font-bold">
                  Owner Dashboard & Data Management
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#37C8E0]/30 text-white">
                  Admin Control
                </span>
              </div>
              <p className="text-xs text-slate-200">
                APIN Employee Pulse Survey · Live Cloud Sync & Local Backups
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close owner dashboard"
            className="w-8 h-8 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Status Feedback Banner */}
          {syncStatusMessage && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-[#83D806]/20 border border-[#83D806] text-[#045877] text-xs font-bold flex items-center justify-between gap-2 animate-fade-in"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>{syncStatusMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSyncStatusMessage(null)}
                className="text-xs font-normal underline hover:opacity-80 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 1. PRIMARY NOTE: FULL DATA LIVES IN GOOGLE SHEETS */}
          <section className="p-5 rounded-2xl border-2 border-[#83D806] bg-gradient-to-br from-[#83D806]/10 via-[#F5FAFB] to-white shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#045877] text-white flex items-center justify-center shrink-0 mt-0.5">
                <FileSpreadsheet className="w-5 h-5 text-[#83D806]" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#045877]">
                    Primary Storage: Live Google Sheets
                  </h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#83D806] text-[#045877] text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Real-time Stream Connected</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#045877]/10 text-[#045877] text-xs font-semibold">
                      <span>Headers: Actual Questions</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong>Notice:</strong> The full survey data now lives directly in <strong>Google Sheets</strong>. On every survey submission, each response is formatted with the <strong>exact full question texts as keys</strong> (no question numbers or prefixes), straight apostrophes, multi-select questions as arrays, 11 separate ranking keys for the CEO's top priorities, and the payload is posted directly to Google Apps Script without CORS preflight barriers.
                </p>

                {/* Endpoint Display with Copy button */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                    <span>Google Apps Script Web App Endpoint:</span>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#045877] hover:underline cursor-pointer"
                    >
                      {copiedUrl ? (
                        <>
                          <Check className="w-3 h-3 text-[#83D806]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-slate-600 break-all select-all flex items-center justify-between gap-2">
                    <span className="truncate">{CONFIG.GOOGLE_SCRIPT_URL}</span>
                    <a
                      href={CONFIG.GOOGLE_SCRIPT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Web App Endpoint in new tab"
                      className="text-slate-400 hover:text-[#045877] shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. LOCAL BACKUP & CSV EXPORT */}
          <section className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#045877]" />
                  <h4 className="text-sm sm:text-base font-bold text-[#045877]">
                    Local Backup & CSV Export
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  A local copy of responses submitted on this browser is preserved in localStorage for safety.
                </p>
              </div>

              {/* Action: CSV Export for local backup */}
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#83D806] hover:bg-[#72bf05] text-[#045877] font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4 stroke-[2.4]" />
                <span>Download CSV Backup</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#F5FAFB] border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">
                  Local Backups Saved
                </span>
                <span className="text-xl font-extrabold text-[#045877] mt-0.5 block">
                  {localBackups.length} {localBackups.length === 1 ? 'submission' : 'submissions'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5FAFB] border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">
                  Pending Network Retries
                </span>
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <span className={`text-xl font-extrabold ${pendingCount > 0 ? 'text-amber-600' : 'text-[#045877]'}`}>
                    {pendingCount}
                  </span>
                  {pendingCount > 0 && (
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={handleRetrySync}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sync</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5FAFB] border border-slate-200 flex flex-col justify-between">
                <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">
                  Raw JSON Backup
                </span>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="mt-1 text-xs font-bold text-[#045877] hover:underline flex items-center gap-1 cursor-pointer text-left"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .JSON format</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. PENDING QUEUE & RETRY MECHANISM */}
          <section className="p-5 rounded-2xl border border-slate-200 bg-[#F5FAFB]/60 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#045877]">
                  Automatic Offline Resilience & Sync
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If staff submit when their device has poor connectivity or a network interruption occurs, the response is safely queued under <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">pendingResponses</code> in localStorage. The survey automatically retries uploading to Google Sheets each time the app loads.
                </p>
              </div>

              <button
                type="button"
                disabled={isSyncing}
                onClick={handleRetrySync}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#045877] text-xs font-semibold text-[#045877] transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Retry Sync Now</span>
              </button>
            </div>
          </section>

          {/* 4. RECENT LOCAL SUBMISSIONS TABLE */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Recent Local Submissions on this Device ({localBackups.length})
              </h4>
              {localBackups.length > 0 && (
                <div>
                  {confirmClear ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600 font-semibold">Clear local data?</span>
                      <button
                        type="button"
                        onClick={handleClearData}
                        className="px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
                      >
                        Yes, Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmClear(true)}
                      className="text-xs text-slate-400 hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear local test data</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {localBackups.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-[#F5FAFB] text-center text-xs text-slate-500">
                No local submissions recorded on this browser yet. When staff or administrators submit a test survey on this device, a local backup will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5FAFB] border-b border-slate-200 text-[#045877]">
                      <th className="py-2.5 px-3 font-bold">Submission ID</th>
                      <th className="py-2.5 px-3 font-bold">Submitted At</th>
                      <th className="py-2.5 px-3 font-bold">Version</th>
                      <th className="py-2.5 px-3 font-bold">Questions Answered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {localBackups.slice(-5).reverse().map((sub, idx) => {
                      const answerCount = sub.answers ? Object.keys(sub.answers).length : 0;
                      return (
                        <tr key={sub.submissionId || idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {sub.submissionId ? sub.submissionId.slice(0, 13) + '...' : `Item ${idx + 1}`}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'N/A'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {sub.surveyVersion || 'v2'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">
                            {answerCount} questions
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Server className="w-3.5 h-3.5 text-[#045877]" />
            <span>Google Apps Script & Google Sheets Integrated</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#045877] text-xs font-bold text-[#045877] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#83D806]" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#045877] hover:bg-[#02384d] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
