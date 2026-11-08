/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { SurveyAnswers } from '../types/survey';

const STORAGE_KEY = 'apin_pulse_survey_draft_v1';
const STEP_STORAGE_KEY = 'apin_pulse_survey_step_v1';

export function useSurveyStorage() {
  const [answers, setAnswers] = useState<SurveyAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [hasRestoredProgress, setHasRestoredProgress] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.keys(parsed).length > 0;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [savedStep, setSavedStep] = useState<number>(() => {
    try {
      const step = localStorage.getItem(STEP_STORAGE_KEY);
      return step ? parseInt(step, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Save answers whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      console.warn('Could not save draft answers to localStorage:', e);
    }
  }, [answers]);

  const updateAnswer = useCallback((questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const saveCurrentStep = useCallback((step: number) => {
    try {
      localStorage.setItem(STEP_STORAGE_KEY, step.toString());
      setSavedStep(step);
    } catch (e) {
      console.warn('Could not save step to localStorage:', e);
    }
  }, []);

  const startOver = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    setAnswers({});
    setSavedStep(0);
    setHasRestoredProgress(false);
  }, []);

  const dismissRestoredBanner = useCallback(() => {
    setHasRestoredProgress(false);
  }, []);

  const clearStorageAfterSubmit = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear storage after submit:', e);
    }
    setAnswers({});
    setHasRestoredProgress(false);
  }, []);

  return {
    answers,
    updateAnswer,
    savedStep,
    saveCurrentStep,
    hasRestoredProgress,
    dismissRestoredBanner,
    startOver,
    clearStorageAfterSubmit,
  };
}
