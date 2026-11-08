/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { SURVEY_SECTIONS } from './data/surveyQuestions';
import { useSurveyStorage } from './hooks/useSurveyStorage';
import {
  submitSurvey,
  generateSubmissionId,
  hasAlreadySubmitted,
  getLastSubmissionPayload,
  clearSubmissionStatus,
  retryPendingResponses,
} from './services/submissionService';
import { SurveySubmissionPayload } from './types/survey';
import { SurveyHeader } from './components/SurveyHeader';
import { SurveyFooter } from './components/SurveyFooter';
import { QuestionCard } from './components/QuestionCard';
import { WelcomePage } from './components/WelcomePage';
import { ReviewPage } from './components/ReviewPage';
import { ThankYouPage } from './components/ThankYouPage';
import { SurveyDownloadModal } from './components/SurveyDownloadModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { PrintableFullSurvey } from './components/PrintableFullSurvey';
import { generatePrintableSurveyHtml, downloadFile } from './utils/surveyExporter';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
  Heart,
  Lock,
} from 'lucide-react';

export default function App() {
  const [, startTransition] = useTransition();

  // Storage and answer state
  const {
    answers,
    updateAnswer,
    savedStep,
    saveCurrentStep,
    hasRestoredProgress,
    dismissRestoredBanner,
    startOver,
    clearStorageAfterSubmit,
  } = useSurveyStorage();

  // Current survey step:
  // 0: Welcome page
  // 1..8: Sections A to H
  // 9: Review and submit
  // 10: Thank you confirmation
  const [currentStep, setCurrentStep] = useState<number>(() => {
    // If user has already submitted on this browser, show Thank You page
    if (hasAlreadySubmitted()) {
      return 10;
    }
    return 0; // Always start on welcome or allow user to resume
  });

  // Track if user came to a section via "Edit" from Review page
  const [returnToReviewAfterEdit, setReturnToReviewAfterEdit] = useState(false);

  // Survey questionnaire download modal state
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Owner dashboard modal state
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedPayload, setSubmittedPayload] = useState<SurveySubmissionPayload | null>(() => {
    return getLastSubmissionPayload();
  });

  // Automatically retry sending any pending responses on app load
  useEffect(() => {
    retryPendingResponses();
  }, []);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Keep savedStep in sync when on survey sections
  useEffect(() => {
    if (currentStep >= 1 && currentStep <= 8) {
      saveCurrentStep(currentStep);
    }
  }, [currentStep, saveCurrentStep]);

  // Warn on page unload only if answers exist and user has not yet submitted
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasAnyAnswer = Object.keys(answers).length > 0;
      if (hasAnyAnswer && currentStep < 10) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answers, currentStep]);

  // Navigation handlers
  const handleStartSurvey = () => {
    startTransition(() => {
      setCurrentStep(1);
    });
  };

  const handleContinueSavedDraft = () => {
    startTransition(() => {
      const resumeStep = savedStep >= 1 && savedStep <= 8 ? savedStep : 1;
      setCurrentStep(resumeStep);
    });
  };

  const handleNextStep = () => {
    if (returnToReviewAfterEdit) {
      setReturnToReviewAfterEdit(false);
      startTransition(() => {
        setCurrentStep(9);
      });
      return;
    }

    startTransition(() => {
      if (currentStep < 8) {
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep === 8) {
        setCurrentStep(9); // Go to Review
      }
    });
  };

  const handlePrevStep = () => {
    if (returnToReviewAfterEdit) {
      setReturnToReviewAfterEdit(false);
      startTransition(() => {
        setCurrentStep(9);
      });
      return;
    }

    startTransition(() => {
      if (currentStep > 1) {
        setCurrentStep((prev) => prev - 1);
      } else {
        setCurrentStep(0); // Back to Welcome
      }
    });
  };

  const handleJumpToSectionFromReview = (sectionIndex: number) => {
    setReturnToReviewAfterEdit(true);
    startTransition(() => {
      setCurrentStep(sectionIndex);
    });
  };

  const handleJumpToSectionDirect = (sectionIndex: number) => {
    startTransition(() => {
      setCurrentStep(sectionIndex);
    });
  };

  const handleGoHome = () => {
    startTransition(() => {
      setCurrentStep(0);
    });
  };

  // Submit survey handler
  const handleSubmitSurvey = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: SurveySubmissionPayload = {
      submissionId: generateSubmissionId(),
      submittedAt: new Date().toISOString(),
      surveyVersion: '2026-first-100-days-v2',
      answers,
    };

    try {
      const result = await submitSurvey(payload);
      setSubmittedPayload(result.payload);
      clearStorageAfterSubmit();
      startTransition(() => {
        setCurrentStep(10); // Thank you page
      });
    } catch (err: any) {
      setSubmitError(
        err.message || 'We could not record your responses. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset survey for testing
  const handleRestartTest = () => {
    clearSubmissionStatus();
    startOver();
    setSubmittedPayload(null);
    startTransition(() => {
      setCurrentStep(0);
    });
  };

  // Determine current active section for steps 1-8
  const currentSection =
    currentStep >= 1 && currentStep <= 8
      ? SURVEY_SECTIONS[currentStep - 1]
      : null;

  // Header step type calculation
  const headerStepType =
    currentStep <= 0
      ? 'welcome'
      : currentStep >= 1 && currentStep <= 8
      ? 'section'
      : currentStep === 9
      ? 'review'
      : 'submitted';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5FAFB] text-slate-800 font-sans selection:bg-[#83D806]/30 selection:text-[#045877]">
      {/* Sticky Accessible App Header */}
      <SurveyHeader
        currentSectionIndex={currentStep}
        stepType={headerStepType}
        onNavigateToSection={
          currentStep >= 1 && currentStep <= 9 ? handleJumpToSectionDirect : undefined
        }
        onGoHome={handleGoHome}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12">
        {/* Restored Progress Alert Banner */}
        {hasRestoredProgress && currentStep === 0 && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 p-4 rounded-2xl bg-white border-2 border-[#83D806]/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#83D806]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#045877]" />
              </div>
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-[#045877]">
                  Welcome back! We restored your saved progress.
                </p>
                <p className="text-slate-500">
                  You can resume right where you left off or start over fresh.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleContinueSavedDraft}
                className="px-3.5 py-1.5 rounded-lg bg-[#045877] text-white text-xs font-bold hover:bg-[#02384d] transition-colors"
              >
                Resume survey
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to clear your saved answers and start fresh?'
                    )
                  ) {
                    startOver();
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        )}

        {/* FULL FORM VIEW: COVER PAGES + ALL 40 QUESTIONS */}
        {currentStep === -1 && (
          <PrintableFullSurvey
            onBackToSurvey={() => setCurrentStep(0)}
            onDownloadHtml={() => {
              const htmlContent = generatePrintableSurveyHtml();
              downloadFile(
                htmlContent,
                'APIN-Employee-Pulse-Survey-Complete-Form.html',
                'text/html;charset=utf-8'
              );
            }}
          />
        )}

        {/* STEP 0: WELCOME PAGE */}
        {currentStep === 0 && (
          <WelcomePage
            onStartSurvey={handleStartSurvey}
            hasSavedDraft={Object.keys(answers).length > 0}
            onContinueDraft={handleContinueSavedDraft}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            onStartOver={() => {
              if (
                window.confirm(
                  'Are you sure you want to clear your saved answers and start fresh?'
                )
              ) {
                startOver();
              }
            }}
          />
        )}

        {/* STEPS 1 to 8: SECTIONS A TO H */}
        {currentStep >= 1 && currentStep <= 8 && currentSection && (
          <section
            aria-labelledby={`section-heading-${currentSection.id}`}
            className="space-y-6 animate-fade-in"
          >
            {/* Section Header Card */}
            <div className="bg-gradient-to-r from-white via-white to-[#F5FAFB] rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#045877]">
                  {currentSection.subtitle}
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Step {currentSection.index} of 8
                </span>
              </div>

              <h2
                id={`section-heading-${currentSection.id}`}
                className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#045877] tracking-tight"
              >
                SECTION {currentSection.id}. {currentSection.title}
              </h2>

              {currentSection.introText && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#F5FAFB] border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentSection.introText}
                </div>
              )}
            </div>

            {/* Questions in Section */}
            <div className="space-y-6">
              {currentSection.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  answers={answers}
                  onAnswerChange={updateAnswer}
                />
              ))}
            </div>

            {/* Warm closing line on Section H as requested */}
            {currentSection.id === 'H' && (
              <div className="p-4 rounded-xl bg-[#83D806]/15 border border-[#83D806]/40 text-center text-sm font-bold text-[#045877] flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-[#045877] fill-[#83D806]" />
                <span>Thank you. Your voice matters.</span>
              </div>
            )}

            {/* Sticky/Fixed-responsive Section Navigation Bar */}
            <div className="mt-10 pt-6 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 sm:flex-none min-h-[46px] px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-white font-semibold text-sm transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                {returnToReviewAfterEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setReturnToReviewAfterEdit(false);
                      setCurrentStep(9);
                    }}
                    className="flex-1 sm:flex-none min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Return to review
                  </button>
                )}
              </div>

              {/* Anonymity note in section footer */}
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Your responses are anonymous</span>
              </div>

              {/* Next Button (Deep Teal with White Text, hover darker teal) */}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-[#045877] hover:bg-[#02384d] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-150 active:scale-98 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {returnToReviewAfterEdit
                    ? 'Save & Return to Review'
                    : currentSection.id === 'H'
                    ? 'Review answers'
                    : 'Next Section'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 9: REVIEW AND SUBMIT */}
        {currentStep === 9 && (
          <ReviewPage
            answers={answers}
            onJumpToSection={handleJumpToSectionFromReview}
            onSubmit={handleSubmitSurvey}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          />
        )}

        {/* STEP 10: THANK YOU CONFIRMATION */}
        {currentStep === 10 && (
          <ThankYouPage
            payload={submittedPayload}
            onRestartTest={handleRestartTest}
            alreadySubmittedNotice={hasAlreadySubmitted() && !submittedPayload}
            onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
          />
        )}
      </main>

      {/* Accessible Global Footer */}
      <SurveyFooter onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)} />

      {/* Full Survey Form Download & Print Modal */}
      <SurveyDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onViewFullFormOnScreen={() => setCurrentStep(-1)}
      />

      {/* Owner & Administrator Dashboard Modal */}
      <OwnerDashboardModal
        isOpen={isOwnerDashboardOpen}
        onClose={() => setIsOwnerDashboardOpen(false)}
      />
    </div>
  );
}
