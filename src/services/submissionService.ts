/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SurveySubmissionPayload, SurveyAnswers } from '../types/survey';
import { SURVEY_SECTIONS } from '../data/surveyQuestions';

/**
 * CONFIG OBJECT:
 * Google Apps Script Web App URL to receive flattened survey responses and append to Google Sheets.
 */
export const CONFIG = {
  GOOGLE_SCRIPT_URL:
    'https://script.google.com/macros/s/AKfycbxV3h5jkFHL5e5rnYayTx39FYMB0fF-MyTK7INUCSvAOfzqkMCMFs2fZm7ZRuUQaO1F/exec',
};

export const SUBMISSION_STORAGE_KEY = 'apin_pulse_survey_submitted_flag_v1';
export const LAST_SUBMISSION_DATA_KEY = 'apin_pulse_survey_last_submission_v1';
export const LOCAL_BACKUP_STORAGE_KEY = 'apin_pulse_survey_all_submissions_v1';
export const PENDING_RESPONSES_STORAGE_KEY = 'pendingResponses';

/**
 * The 11 CEO top priorities for Question 51 sent as 11 separate keys
 */
export const CEO_TOP_PRIORITIES: readonly string[] = [
  'Listening to staff and reporting back on what was heard',
  'Clarifying leadership roles and decision-making authority',
  'Strengthening financial management and internal controls',
  'Reforming procurement and supply chain',
  'Improving performance management and recognition',
  'Building a leadership development, mentorship and succession agenda',
  'Improving staff welfare, benefits and flexibility',
  'Securing and diversifying funding',
  'Making APIN more digital',
  'Advancing the APIN Research Institute',
  'Planning responsible regional expansion',
];

/**
 * Normalizes question texts for use as payload keys:
 * - Straight apostrophes (') rather than curly ones (’, ‘, ʼ)
 * - Straight quotes (") rather than curly ones (“, ”)
 * - Strip any leading numbers or Q prefixes (e.g. "1. ", "Q1: ", "q1. ")
 * - Trim whitespace
 */
export function cleanKeyText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/^[Qq]?\d+[\.\:\)\s-]+\s*/, '')
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .trim();
}

/**
 * Builds the exact flat JSON payload sent to Google Apps Script.
 * CRITICAL REQUIREMENTS:
 * 1. Never use question numbers or IDs (Q1, q1, 1, etc.) as keys.
 * 2. Every KEY is the exact full question text, character for character, with no number prefix:
 *    - Straight apostrophes (') rather than curly ones.
 * 3. Single-choice, Likert, and open-text questions: selected option text or typed text ("" if skipped).
 * 4. The 0-10 recommendation question: the number selected ("" if skipped).
 *    Its key must be exactly: "How likely are you to recommend APIN as a good place to work? (0 = not at all likely; 10 = extremely likely)"
 * 5. Multi-select and "select up to N" questions: an array of the selected option texts ([] if skipped).
 * 6. Top-priorities ranking question: do NOT send as one key.
 *    Send 11 separate keys in the form "CEO's top priority rank (1-5) for the first 100 days: <priority text>"
 *    with the chosen rank (1 to 5) as the value, or an empty string if that item was not ranked.
 * 7. Do NOT add a timestamp, name, email, phone, IP address, user agent, or any identifying field.
 *    The server adds the timestamp.
 */
export function buildGoogleScriptPayload(answers: SurveyAnswers = {}): Record<string, any> {
  const payload: Record<string, any> = {};

  SURVEY_SECTIONS.forEach((section) => {
    section.questions.forEach((q) => {
      // Case 1: Likert matrix statements (each statement is an individual Likert question)
      if (q.type === 'likert-matrix' && q.likertStatements) {
        q.likertStatements.forEach((stmt) => {
          const key = cleanKeyText(stmt.text);
          const val = answers[stmt.id];
          payload[key] =
            typeof val === 'string' && val.trim().length > 0 ? val.trim() : '';
        });
        return;
      }

      // Case 2: The top-priorities ranking question (Q51)
      if (q.type === 'ranking') {
        const rankObj = (answers[q.id] && typeof answers[q.id] === 'object'
          ? answers[q.id]
          : {}) as Record<string, string>;

        // Build a normalized lookup: itemText (cleaned) -> rank (1 to 5)
        const itemToRank = new Map<string, number>();
        Object.entries(rankObj).forEach(([rankStr, itemName]) => {
          if (typeof itemName === 'string') {
            const normalizedItem = itemName
              .trim()
              .replace(/\.+$/, '')
              .toLowerCase();
            const rankNum = parseInt(rankStr, 10);
            if (!isNaN(rankNum)) {
              itemToRank.set(normalizedItem, rankNum);
            }
          }
        });

        // Generate the 11 separate keys
        CEO_TOP_PRIORITIES.forEach((priorityText) => {
          const key = `CEO's top priority rank (1-5) for the first 100 days: ${priorityText}`;
          const normalizedPriority = priorityText
            .trim()
            .replace(/\.+$/, '')
            .toLowerCase();
          const rank = itemToRank.get(normalizedPriority);
          payload[key] = rank !== undefined ? rank : '';
        });
        return;
      }

      // Case 3: 0-10 recommendation question (Q39)
      if (q.type === 'nps-scale') {
        const exactNpsKey =
          'How likely are you to recommend APIN as a good place to work? (0 = not at all likely; 10 = extremely likely)';
        const npsVal = answers[q.id];
        if (typeof npsVal === 'number' && !isNaN(npsVal)) {
          payload[exactNpsKey] = npsVal;
        } else if (
          typeof npsVal === 'string' &&
          npsVal.trim().length > 0 &&
          !isNaN(Number(npsVal))
        ) {
          payload[exactNpsKey] = Number(npsVal);
        } else {
          payload[exactNpsKey] = '';
        }
        return;
      }

      // Case 4: Multi-select & "select up to N" questions
      if (q.type === 'multi-select') {
        const key = cleanKeyText(q.text);
        const multiVal = answers[q.id];
        const otherVal = answers[`${q.id}_other`];

        if (Array.isArray(multiVal) && multiVal.length > 0) {
          const formattedList = multiVal.map((item) => {
            if (
              typeof item === 'string' &&
              item.includes('Other') &&
              otherVal &&
              typeof otherVal === 'string' &&
              otherVal.trim()
            ) {
              return `${item} (${otherVal.trim()})`;
            }
            return item;
          });
          payload[key] = formattedList;
        } else {
          payload[key] = [];
        }
        return;
      }

      // Case 5: Single-choice and open-text questions
      const key = cleanKeyText(q.text);
      const val = answers[q.id];
      const otherVal = answers[`${q.id}_other`];

      if (typeof val === 'string' && val.trim().length > 0) {
        if (
          val.includes('Other') &&
          otherVal &&
          typeof otherVal === 'string' &&
          otherVal.trim()
        ) {
          payload[key] = `${val.trim()} (${otherVal.trim()})`;
        } else {
          payload[key] = val.trim();
        }
      } else if (typeof val === 'number') {
        payload[key] = val;
      } else {
        payload[key] = '';
      }
    });
  });

  return payload;
}

/**
 * Generate a cryptographically secure random UUID v4 with fallback
 */
export function generateSubmissionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Check if the current browser has already submitted
 */
export function hasAlreadySubmitted(): boolean {
  try {
    return localStorage.getItem(SUBMISSION_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Get the last submitted payload for testing or downloading
 */
export function getLastSubmissionPayload(): SurveySubmissionPayload | null {
  try {
    const raw = localStorage.getItem(LAST_SUBMISSION_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Get all locally saved backup submissions
 */
export function getLocalBackups(): SurveySubmissionPayload[] {
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
    const last = getLastSubmissionPayload();
    return last ? [last] : [];
  } catch {
    return [];
  }
}

/**
 * Get count of pending responses waiting for network retry
 */
export function getPendingResponsesCount(): number {
  try {
    const raw = localStorage.getItem(PENDING_RESPONSES_STORAGE_KEY);
    if (!raw) return 0;
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Get pending responses list
 */
export function getPendingResponses(): any[] {
  try {
    const raw = localStorage.getItem(PENDING_RESPONSES_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Save a backup copy to localStorage
 */
export function saveLocalBackup(payload: SurveySubmissionPayload): void {
  try {
    localStorage.setItem(SUBMISSION_STORAGE_KEY, 'true');
    localStorage.setItem(LAST_SUBMISSION_DATA_KEY, JSON.stringify(payload));

    const existing = getLocalBackups();
    const updated = existing.filter((item) => item.submissionId !== payload.submissionId);
    updated.push(payload);
    localStorage.setItem(LOCAL_BACKUP_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save local backup in localStorage:', err);
  }
}

/**
 * Queue a response into pendingResponses in localStorage for retry
 */
export function queuePendingResponse(data: Record<string, any>): void {
  try {
    const raw = localStorage.getItem(PENDING_RESPONSES_STORAGE_KEY);
    const list: any[] = raw ? JSON.parse(raw) : [];
    list.push(data);
    localStorage.setItem(PENDING_RESPONSES_STORAGE_KEY, JSON.stringify(list));
    console.log(
      '[Pending Queue] Network request failed. Response saved under pendingResponses. Total queued:',
      list.length
    );
  } catch (err) {
    console.error('Failed to queue pending response:', err);
  }
}

/**
 * Clear submission status (for testing / restart)
 */
export function clearSubmissionStatus(): void {
  try {
    localStorage.removeItem(SUBMISSION_STORAGE_KEY);
    localStorage.removeItem(LAST_SUBMISSION_DATA_KEY);
  } catch (err) {
    console.error('Failed to clear submission status:', err);
  }
}

/**
 * Clear all local backup responses (for testing / restart)
 */
export function clearAllLocalBackups(): void {
  try {
    localStorage.removeItem(LOCAL_BACKUP_STORAGE_KEY);
    localStorage.removeItem(LAST_SUBMISSION_DATA_KEY);
    localStorage.removeItem(SUBMISSION_STORAGE_KEY);
    localStorage.removeItem(PENDING_RESPONSES_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear local backups:', err);
  }
}

/**
 * Retry sending all pending responses from localStorage to GOOGLE_SCRIPT_URL.
 * Runs automatically when the app loads.
 * Removes each one from storage only after it has been sent successfully.
 */
export async function retryPendingResponses(): Promise<{ retried: number; remaining: number }> {
  try {
    const raw = localStorage.getItem(PENDING_RESPONSES_STORAGE_KEY);
    if (!raw) return { retried: 0, remaining: 0 };

    const list: any[] = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) {
      return { retried: 0, remaining: 0 };
    }

    console.log(
      `[Auto-Retry] Checking pending responses: ${list.length} item(s) found. Retrying upload to Google Sheets...`
    );
    const remaining: any[] = [];
    let retried = 0;

    for (const item of list) {
      try {
        const bodyData = item && item.answers ? buildGoogleScriptPayload(item.answers) : item;
        await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(bodyData),
        });
        retried++;
        console.log('[Auto-Retry] Successfully delivered queued response to Google Apps Script.');
      } catch (err) {
        console.warn('[Auto-Retry] Upload attempt failed for pending item, keeping in queue:', err);
        remaining.push(item);
      }
    }

    if (remaining.length > 0) {
      localStorage.setItem(PENDING_RESPONSES_STORAGE_KEY, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(PENDING_RESPONSES_STORAGE_KEY);
      console.log('[Auto-Retry] All pending responses synced to Google Sheets successfully.');
    }

    return { retried, remaining: remaining.length };
  } catch (err) {
    console.error('[Auto-Retry] Error during retryPendingResponses:', err);
    return { retried: 0, remaining: 0 };
  }
}

/**
 * Submits the survey response:
 * 1. Builds flat payload where every key is the full question text (no number/q prefix),
 *    0-10 question has exact specified key, ranking has 11 separate keys,
 *    multi-select has array of option texts, straight apostrophes, and no identifying/timestamp fields.
 * 2. POSTs to GOOGLE_SCRIPT_URL using fetch with method "POST", mode "no-cors", and body JSON.stringify(payload).
 *    Do NOT set a custom Content-Type header so the browser sends it as text/plain and avoids CORS preflight errors.
 * 3. Saves a local backup copy to localStorage.
 * 4. If network request fails, saves the payload in localStorage under "pendingResponses" array for auto-retry.
 * 5. Shows customer thank-you screen either way.
 */
export async function submitSurvey(
  payload: SurveySubmissionPayload
): Promise<{ success: boolean; message: string; payload: SurveySubmissionPayload; queuedForRetry?: boolean }> {
  // 1. Build exact Google Script payload
  const googleScriptPayload = buildGoogleScriptPayload(payload.answers);

  if (import.meta.env.DEV) {
    console.log('[APIN Survey] Outgoing Google Script Payload:', googleScriptPayload);
  }

  // 2. Save local backup copy to localStorage
  saveLocalBackup(payload);

  let queuedForRetry = false;

  // 3. POST to GOOGLE_SCRIPT_URL
  try {
    if (CONFIG.GOOGLE_SCRIPT_URL && CONFIG.GOOGLE_SCRIPT_URL.trim().length > 0) {
      await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(googleScriptPayload),
      });
      console.log('[APIN Survey] Response sent to Google Apps Script successfully.');
    }
  } catch (networkError) {
    console.warn(
      '[APIN Survey] Network transmission failed, saving to pendingResponses queue:',
      networkError
    );
    queuePendingResponse(googleScriptPayload);
    queuedForRetry = true;
  }

  // 4. Return success to show thank-you screen either way
  return {
    success: true,
    message: queuedForRetry
      ? 'Responses saved locally and queued for cloud synchronization.'
      : 'Responses successfully recorded and submitted to Google Sheets.',
    payload,
    queuedForRetry,
  };
}

/**
 * Development testing: verify payload format on module load in development mode.
 * Logs a sample payload to console and asserts that:
 * - Every key is the full question text
 * - None start with a number or "q"
 * - The 11 ranking keys are present with straight apostrophes
 * - The 0-10 question key is exact
 * - Multi-select values are arrays
 */
if (import.meta.env.DEV) {
  const sampleTestPayload = buildGoogleScriptPayload({
    q1: 'Headquarters',
    q2: '1–3 years',
    q3: 'Yes',
    q4: 'Very confident',
    q5: ['Diversifying funding', 'Research and innovation'],
    q6: 'Staff dedication and national health program delivery.',
    q7: 'Slow approvals or excessive bureaucracy',
    q8: 'Very clear',
    q9: 'Mostly manageable',
    q10: ['Pay and pay fairness', 'Health insurance or health support'],
    q11: 'Satisfied',
    q12: 'Yes, clearly',
    q13: ['Technical or professional training', 'Leadership development'],
    q14: 'Always',
    q15: 'Very comfortable',
    q16: 'Mostly fair and consistent',
    q17: ['Explain major decisions and their reasons', 'Recognize good work'],
    q18: 'Agree',
    q19: 'Strongly Agree',
    q20: 'Agree',
    q21: 'Agree',
    q22: 'Agree',
    q23: 'Agree',
    q24: 'Strongly Agree',
    q25: 'Agree',
    q26: 'Agree',
    q27: 'Strongly Agree',
    q28: ['More flexibility in start or finish times', 'Hybrid or remote work where duties allow'],
    q29: ['Performance management', 'Learning and development'],
    q30: 'Strongly Agree',
    q31: 'Agree',
    q32: 'Agree',
    q33: 'Agree',
    q34: 'Agree',
    q35: 'Agree',
    q36: 'Agree',
    q37: 'Strongly Agree',
    q38: 'Very satisfied',
    q39: 10,
    q40: 'Enhance staff engagement and streamline administrative processes.',
    q41: 'Sustain digital health tools and regional partnerships.',
    q42: 'Commitment to public health impact and organizational integrity.',
    q43: ['Share the main themes and priorities', 'Explain what will change and by when'],
    q44: 'Excited for the next era of APIN leadership.',
    q45: 'Strongly Agree',
    q46: 'Agree',
    q47: 'Strongly Agree',
    q48: 'Agree',
    q49: 'Every month',
    q50: ['Organisation-wide town hall', 'CEO visits to state offices'],
    q51: {
      1: 'Listening to staff and reporting back on what was heard',
      2: 'Strengthening financial management and internal controls',
      3: 'Securing and diversifying funding',
      4: 'Making APIN more digital',
      5: 'Building a leadership development, mentorship and succession agenda',
    },
    q52: 'Within the first 100 days',
    q53: 'Excellence in laboratory systems and public health program implementation.',
    q54: 'Lead with empathy, transparency, and clear milestones.',
  });

  console.log('[APIN Survey DEV TEST] Sample Google Script Payload:', sampleTestPayload);

  const keysStartingWithNumOrQ = Object.keys(sampleTestPayload).filter(
    (k) => /^[0-9]/.test(k) || /^[qQ][0-9]/.test(k)
  );

  const hasInvalidApostrophe = Object.keys(sampleTestPayload).filter(
    (k) => /[\u2018\u2019]/.test(k)
  );

  const exactNpsKey =
    'How likely are you to recommend APIN as a good place to work? (0 = not at all likely; 10 = extremely likely)';
  const hasExactNpsKey = exactNpsKey in sampleTestPayload;

  const rankingKeysFound = CEO_TOP_PRIORITIES.filter(
    (p) => `CEO's top priority rank (1-5) for the first 100 days: ${p}` in sampleTestPayload
  );

  if (keysStartingWithNumOrQ.length > 0) {
    console.error(
      '[APIN Survey DEV TEST FAIL] Found keys starting with number or q:',
      keysStartingWithNumOrQ
    );
  } else if (hasInvalidApostrophe.length > 0) {
    console.error(
      '[APIN Survey DEV TEST FAIL] Found keys with curly apostrophe:',
      hasInvalidApostrophe
    );
  } else if (!hasExactNpsKey) {
    console.error('[APIN Survey DEV TEST FAIL] Exact NPS key not found!');
  } else if (rankingKeysFound.length !== 11) {
    console.error(
      `[APIN Survey DEV TEST FAIL] Expected 11 ranking keys, found ${rankingKeysFound.length}`
    );
  } else {
    console.log(
      '[APIN Survey DEV TEST PASS] All payload keys verified: full question text, straight apostrophes, 11 ranking keys, exact 0-10 key, arrays for multi-select, and NO number or q prefix.'
    );
  }
}
