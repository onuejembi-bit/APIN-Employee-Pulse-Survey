/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SURVEY_SECTIONS, getSectionQuestionCount } from '../data/surveyQuestions';

/**
 * Generates an exact, standalone HTML document matching the web application's display
 * from the cover pages (Hero, Introduction, How to respond, Survey Map) to all 54 questions.
 */
export function generatePrintableSurveyHtml(): string {
  // Generate the 8 Survey Map cards
  const surveyMapHtml = SURVEY_SECTIONS.map((sec) => `
    <div class="map-card">
      <div class="map-card-header">
        <span class="map-badge">Section ${sec.id}</span>
        <span class="map-count">${getSectionQuestionCount(sec)} questions</span>
      </div>
      <div class="map-title">${sec.title}</div>
    </div>
  `).join('');

  // Generate Sections A through H with all 54 questions
  const sectionsHtml = SURVEY_SECTIONS.map((sec) => {
    const questionsHtml = sec.questions
      .map((q) => {
        let bodyHtml = '';

        if (q.type === 'single-select' && q.options) {
          bodyHtml = `
            <div class="options-container">
              ${q.options
                .map(
                  (opt) => `
                <div class="option-row">
                  <span class="option-text">${opt.label}</span>
                  <span class="radio-indicator">○</span>
                </div>
                ${
                  opt.isOther
                    ? `<div class="other-input-box">Please specify (optional): _________________________________________________</div>`
                    : ''
                }`
                )
                .join('')}
            </div>`;
        } else if (q.type === 'multi-select' && q.options) {
          bodyHtml = `
            <div class="options-container">
              ${q.options
                .map(
                  (opt) => `
                <div class="option-row">
                  <span class="option-text">${opt.label}</span>
                  <span class="checkbox-indicator">□</span>
                </div>
                ${
                  opt.isOther
                    ? `<div class="other-input-box">Please specify (optional): _________________________________________________</div>`
                    : ''
                }`
                )
                .join('')}
            </div>`;
        } else if (q.type === 'open-response') {
          bodyHtml = `
            <div class="open-response-card">
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="open-response-footer">
                <span>Please do not include names or details that could identify you or others.</span>
                <span>Limit: ${q.maxLength || 1500} characters</span>
              </div>
            </div>`;
        } else if (q.type === 'nps-scale') {
          bodyHtml = `
            <div class="nps-wrap">
              <div class="nps-grid">
                ${Array.from({ length: 11 }, (_, i) => i)
                  .map(
                    (score) => `
                  <div class="nps-item">
                    <span class="nps-num">${score}</span>
                    <span class="nps-circle">○</span>
                  </div>`
                  )
                  .join('')}
              </div>
              <div class="nps-labels-row">
                <span><strong>0</strong> = Not at all likely</span>
                <span><strong>10</strong> = Extremely likely</span>
              </div>
            </div>`;
        } else if (q.type === 'likert-matrix' && q.likertStatements && q.likertOptions) {
          bodyHtml = `
            <div class="matrix-wrapper">
              <table class="matrix-table">
                <thead>
                  <tr>
                    <th class="matrix-th-stmt">Statement</th>
                    ${q.likertOptions
                      .map((opt) => `<th class="matrix-th-opt">${opt}</th>`)
                      .join('')}
                  </tr>
                </thead>
                <tbody>
                  ${q.likertStatements
                    .map(
                      (stmt) => `
                    <tr>
                      <td class="matrix-td-stmt"><strong>${stmt.number}.</strong> ${stmt.text}</td>
                      ${q.likertOptions
                        ?.map(() => `<td class="matrix-td-opt"><span class="matrix-circle">○</span></td>`)
                        .join('')}
                    </tr>`
                    )
                    .join('')}
                </tbody>
              </table>
            </div>`;
        } else if (q.type === 'ranking' && q.rankingItems) {
          bodyHtml = `
            <div class="ranking-wrapper">
              <div class="ranking-slots-card">
                <div class="ranking-slots-title">Your Top 5 Priorities (Write 1 to 5):</div>
                ${[1, 2, 3, 4, 5]
                  .map(
                    (r) => `
                  <div class="ranking-slot-row">
                    <span class="rank-num-badge">${r}</span>
                    <span class="ranking-line">____________________________________________________________________</span>
                  </div>`
                  )
                  .join('')}
              </div>

              <div class="ranking-candidates-list">
                <div class="ranking-candidates-title">Options to select from:</div>
                ${q.rankingItems
                  .map(
                    (item, idx) => `
                  <div class="ranking-candidate-card">
                    <span class="candidate-text">${idx + 1}. ${item}</span>
                    <div class="rank-chips-row">
                      <span class="rank-chip">1</span>
                      <span class="rank-chip">2</span>
                      <span class="rank-chip">3</span>
                      <span class="rank-chip">4</span>
                      <span class="rank-chip">5</span>
                    </div>
                  </div>`
                  )
                  .join('')}
              </div>
            </div>`;
        }

        return `
          <div class="question-card">
            <div class="question-header">
              <div class="question-badge">${q.number}</div>
              <div class="question-title-wrap">
                <div class="question-text">${q.text}</div>
                ${q.helperText ? `<div class="question-helper">${q.helperText}</div>` : ''}
              </div>
            </div>
            <div class="question-body">
              ${bodyHtml}
            </div>
          </div>`;
      })
      .join('');

    return `
      <section class="section-container">
        <div class="section-card">
          <div class="section-header-top">
            <span class="section-subtitle">${sec.subtitle}</span>
            <span class="section-step">Step ${sec.index} of 8</span>
          </div>
          <h2 class="section-title">SECTION ${sec.id}. ${sec.title.toUpperCase()}</h2>
          ${sec.introText ? `<div class="section-intro">${sec.introText}</div>` : ''}
        </div>
        <div class="section-questions-list">
          ${questionsHtml}
        </div>
        ${
          sec.id === 'H'
            ? `<div class="section-h-closing">
                <span class="heart-icon">♥</span>
                <span>Thank you. Your voice matters.</span>
              </div>`
            : ''
        }
      </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APIN Employee Pulse Survey — Complete Form</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --apin-green: #83D806;
      --apin-blue: #37C8E0;
      --apin-teal: #045877;
      --apin-teal-dark: #02384d;
      --apin-bg: #F5FAFB;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--apin-bg);
      color: #1e293b;
      line-height: 1.5;
      margin: 0;
      padding: 32px 16px;
    }
    .page-wrapper {
      max-width: 860px;
      margin: 0 auto;
    }
    .print-control-bar {
      position: sticky;
      top: 16px;
      z-index: 100;
      background: var(--apin-teal);
      color: white;
      padding: 14px 20px;
      border-radius: 16px;
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      box-shadow: 0 10px 25px -5px rgba(4, 88, 119, 0.3);
    }
    .print-control-title {
      font-weight: 700;
      font-size: 14px;
    }
    .print-control-actions {
      display: flex;
      gap: 10px;
    }
    .btn-print {
      background: var(--apin-green);
      color: var(--apin-teal);
      border: none;
      padding: 8px 18px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }
    .btn-print:hover { background: #72bf05; }
    .btn-close {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-close:hover { background: rgba(255, 255, 255, 0.25); }

    /* COVER PAGE SECTION 1: HERO */
    .hero-card {
      position: relative;
      background: linear-gradient(180deg, #ffffff 0%, var(--apin-bg) 60%, #ffffff 100%);
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 24px;
      padding: 44px 24px;
      text-align: center;
      margin-bottom: 32px;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .hero-logo {
      margin-bottom: 24px;
    }
    .hero-logo img {
      max-height: 80px;
      width: auto;
      margin: 0 auto;
      display: block;
    }
    .badges-row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 18px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-green {
      background: rgba(131, 216, 6, 0.15);
      border: 1px solid rgba(131, 216, 6, 0.4);
      color: var(--apin-teal);
    }
    .badge-blue {
      background: rgba(55, 200, 224, 0.15);
      border: 1px solid rgba(55, 200, 224, 0.4);
      color: var(--apin-teal);
    }
    .badge-teal {
      background: rgba(4, 88, 119, 0.1);
      border: 1px solid rgba(4, 88, 119, 0.2);
      color: var(--apin-teal);
    }
    .hero-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--apin-teal);
      margin: 0 0 10px 0;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }
    .hero-subtitle {
      font-size: 17px;
      font-weight: 500;
      color: #334155;
      margin: 0;
    }

    /* COVER PAGE SECTION 2: DEAR COLLEAGUES MESSAGE */
    .message-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 32px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .message-content {
      border-left: 4px solid var(--apin-green);
      padding-left: 24px;
    }
    .message-salutation {
      font-size: 18px;
      font-weight: 700;
      color: var(--apin-teal);
      margin: 0 0 14px 0;
    }
    .message-p {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
      margin: 0 0 12px 0;
    }
    .message-bold {
      font-weight: 600;
      color: var(--apin-teal);
      margin-bottom: 0;
    }

    /* COVER PAGE SECTION 3: HOW TO RESPOND */
    .howto-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 32px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .howto-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--apin-teal);
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .howto-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    @media (max-width: 640px) {
      .howto-grid { grid-template-columns: 1fr; }
    }
    .howto-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: var(--apin-bg);
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 13px;
      color: #334155;
      line-height: 1.45;
    }
    .howto-check {
      color: var(--apin-green);
      font-weight: 900;
      font-size: 15px;
      flex-shrink: 0;
      margin-top: -1px;
    }

    /* COVER PAGE SECTION 4: SURVEY MAP */
    .map-section {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 40px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .map-heading {
      font-size: 16px;
      font-weight: 700;
      color: var(--apin-teal);
      margin: 0 0 4px 0;
    }
    .map-subheading {
      font-size: 12px;
      color: #64748b;
      margin: 0 0 18px 0;
    }
    .map-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    @media (max-width: 768px) {
      .map-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .map-card {
      background: rgba(245, 250, 251, 0.6);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
    }
    .map-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .map-badge {
      background: var(--apin-teal);
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .map-count {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
    }
    .map-title {
      font-size: 12.5px;
      font-weight: 700;
      color: var(--apin-teal);
      line-height: 1.35;
    }

    /* SECTIONS A TO H CONTAINERS */
    .section-container {
      margin-top: 36px;
      padding-top: 24px;
      border-top: 2px dashed #cbd5e1;
    }
    .section-card {
      background: linear-gradient(90deg, #ffffff 0%, var(--apin-bg) 100%);
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px 28px;
      margin-bottom: 24px;
    }
    .section-header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .section-subtitle {
      font-size: 12px;
      font-weight: 700;
      color: var(--apin-teal);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .section-step {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    .section-title {
      font-size: 22px;
      font-weight: 800;
      color: var(--apin-teal);
      margin: 0;
      letter-spacing: -0.01em;
    }
    .section-intro {
      margin-top: 12px;
      background: var(--apin-bg);
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 13px;
      color: #334155;
      line-height: 1.5;
    }
    .section-questions-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* INDIVIDUAL QUESTION CARD */
    .question-card {
      background: #ffffff;
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 16px;
      padding: 24px 28px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
    }
    .question-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 16px;
    }
    .question-badge {
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      background: var(--apin-teal);
      color: white;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .question-title-wrap {
      flex: 1;
    }
    .question-text {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
    }
    .question-helper {
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
      margin-top: 4px;
    }

    /* OPTIONS & INPUT ROWS */
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 4px;
    }
    .option-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #ffffff;
      font-size: 14px;
      color: #334155;
    }
    .radio-indicator, .checkbox-indicator {
      font-size: 18px;
      color: #94a3b8;
      font-family: monospace;
      margin-left: 12px;
    }
    .other-input-box {
      margin-left: 16px;
      margin-top: 4px;
      margin-bottom: 8px;
      padding: 8px 12px;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      background: #f8fafc;
      font-size: 12px;
      color: #64748b;
    }

    /* OPEN RESPONSE BOX */
    .open-response-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: rgba(245, 250, 251, 0.4);
      padding: 16px;
    }
    .ruled-line {
      border-bottom: 1px dashed #cbd5e1;
      height: 28px;
    }
    .open-response-footer {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
      margin-top: 10px;
    }

    /* NPS 0-10 SCALE */
    .nps-wrap {
      margin-top: 6px;
    }
    .nps-grid {
      display: grid;
      grid-template-columns: repeat(11, 1fr);
      gap: 6px;
    }
    @media (max-width: 640px) {
      .nps-grid { grid-template-columns: repeat(6, 1fr); }
    }
    .nps-item {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 8px 4px;
      text-align: center;
      background: #ffffff;
      color: var(--apin-teal);
    }
    .nps-num {
      display: block;
      font-weight: 700;
      font-size: 14px;
    }
    .nps-circle {
      font-size: 11px;
      color: #94a3b8;
    }
    .nps-labels-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #475569;
      margin-top: 8px;
    }

    /* LIKERT MATRIX TABLE */
    .matrix-wrapper {
      overflow-x: auto;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #ffffff;
      margin-top: 8px;
    }
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    .matrix-th-stmt {
      background: var(--apin-bg);
      border-bottom: 1px solid #e2e8f0;
      padding: 12px 16px;
      font-weight: 700;
      color: var(--apin-teal);
      text-transform: uppercase;
      font-size: 11px;
      width: 40%;
    }
    .matrix-th-opt {
      background: var(--apin-bg);
      border-bottom: 1px solid #e2e8f0;
      padding: 12px 6px;
      font-weight: 700;
      color: var(--apin-teal);
      text-align: center;
      font-size: 11px;
      width: 12%;
    }
    .matrix-td-stmt {
      padding: 14px 16px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      font-weight: 500;
      line-height: 1.4;
    }
    .matrix-td-opt {
      padding: 14px 6px;
      border-bottom: 1px solid #f1f5f9;
      text-align: center;
    }
    .matrix-circle {
      font-size: 18px;
      color: #94a3b8;
    }

    /* RANKING CARD Q37 */
    .ranking-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .ranking-slots-card {
      background: var(--apin-bg);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    .ranking-slots-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--apin-teal);
      margin-bottom: 10px;
    }
    .ranking-slot-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .rank-num-badge {
      width: 22px;
      height: 22px;
      border-radius: 9999px;
      background: var(--apin-teal);
      color: white;
      font-weight: 700;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ranking-line {
      font-family: monospace;
      color: #94a3b8;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
    }
    .ranking-candidates-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .ranking-candidates-title {
      font-size: 12.5px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 4px;
    }
    .ranking-candidate-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
      font-size: 13px;
      color: #1e293b;
    }
    .rank-chips-row {
      display: flex;
      gap: 4px;
    }
    .rank-chip {
      width: 22px;
      height: 22px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      background: #f8fafc;
    }

    /* SECTION H CLOSING BANNER */
    .section-h-closing {
      background: rgba(131, 216, 6, 0.15);
      border: 1px solid rgba(131, 216, 6, 0.4);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      color: var(--apin-teal);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
    }
    .heart-icon { color: var(--apin-teal); font-size: 16px; }

    /* FOOTER */
    .page-footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #64748b;
    }
    .page-footer img {
      max-height: 36px;
      width: auto;
      display: block;
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .print-control-bar {
        display: none !important;
      }
      .page-wrapper {
        max-width: 100% !important;
      }
      .hero-card, .message-card, .howto-card, .map-section, .section-card, .question-card {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="page-wrapper">
    <!-- Action bar (Hidden when printed) -->
    <div class="print-control-bar">
      <div>
        <div class="print-control-title">APIN Employee Pulse Survey — Complete Questionnaire</div>
        <div style="font-size: 12px; opacity: 0.85;">Contains cover pages, how to respond, survey map, and all 54 questions.</div>
      </div>
      <div class="print-control-actions">
        <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
        <button class="btn-close" onclick="window.close()">Close Window</button>
      </div>
    </div>

    <!-- 1. COVER PAGE: HERO SECTION -->
    <section class="hero-card">
      <div class="hero-logo">
        <img src="https://i.ibb.co/3y22mP7Z/APIN-Earth-Globe-Logo.png" alt="APIN Earth Globe Logo" />
      </div>
      <div class="badges-row">
        <span class="badge badge-green">Anonymous</span>
        <span class="badge badge-blue">About 10–15 minutes</span>
        <span class="badge badge-teal">54 questions in 8 sections</span>
      </div>
      <h1 class="hero-title">APIN Employee Pulse Survey</h1>
      <p class="hero-subtitle">Expectations for the First 100 Days and Beyond</p>
    </section>

    <!-- 2. COVER PAGE: DEAR COLLEAGUES MESSAGE -->
    <section class="message-card">
      <div class="message-content">
        <h2 class="message-salutation">Dear Colleagues,</h2>
        <p class="message-p">
          In his First 100 Days Compact, our CEO committed to understanding APIN before changing APIN. He has asked three questions: what should we protect, what should we change, and what should we create? This survey is one way to answer them, in your own voice.
        </p>
        <p class="message-p">
          Your answers will help leadership shape priorities on growth, staff welfare, culture, flexibility, policies and benefits, and will set a baseline Satisfaction Index so we can measure progress together.
        </p>
        <p class="message-p message-bold">
          The CEO will report back to all staff on what was heard and what will be done.
        </p>
      </div>
    </section>

    <!-- 3. COVER PAGE: HOW TO RESPOND -->
    <section class="howto-card">
      <h2 class="howto-title">
        <span>✓</span> How to respond
      </h2>
      <div class="howto-grid">
        <div class="howto-item">
          <span class="howto-check">✓</span>
          <span>Please answer based on your own experience.</span>
        </div>
        <div class="howto-item">
          <span class="howto-check">✓</span>
          <span>Unless the survey is explicitly configured otherwise, do not include your name or details that could identify you or any other staff member.</span>
        </div>
        <div class="howto-item">
          <span class="howto-check">✓</span>
          <span>There are no right or wrong answers. Answer honestly, based on your own experience.</span>
        </div>
        <div class="howto-item">
          <span class="howto-check">✓</span>
          <span>For rating questions, select one answer.</span>
        </div>
        <div class="howto-item">
          <span class="howto-check">✓</span>
          <span>For "select all" questions, choose every option that applies.</span>
        </div>
        <div class="howto-item">
          <span class="howto-check">✓</span>
          <span><strong>We encourage you to answer as many questions as possible. If possible, please answer all the questions.</strong></span>
        </div>
      </div>
    </section>

    <!-- 4. COVER PAGE: SURVEY MAP -->
    <section class="map-section">
      <h2 class="map-heading">Survey Map</h2>
      <p class="map-subheading">Overview of all 8 sections (A to H)</p>
      <div class="map-grid">
        ${surveyMapHtml}
      </div>
    </section>

    <!-- 5. ALL 54 QUESTIONS ACROSS SECTIONS A TO H -->
    <div class="all-sections-wrapper">
      ${sectionsHtml}
    </div>

    <!-- 6. FOOTER -->
    <footer class="page-footer">
      <div>
        <img src="https://i.ibb.co/3y22mP7Z/APIN-Earth-Globe-Logo.png" alt="APIN Logo" />
      </div>
      <div>
        <strong>APIN Employee Pulse Survey</strong> · Strictly Confidential & Anonymous · © APIN
      </div>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Generates clean plain text of the entire survey form.
 */
export function generatePlainTextSurvey(): string {
  let text = `================================================================================
APIN PUBLIC HEALTH INITIATIVES
EMPLOYEE PULSE SURVEY: EXPECTATIONS FOR THE FIRST 100 DAYS AND BEYOND
================================================================================
Confidential & Anonymous Survey Instrument
Total: 54 Questions across Sections A to H

--------------------------------------------------------------------------------
MESSAGE:
--------------------------------------------------------------------------------
Dear Colleagues,

In his First 100 Days Compact, our CEO committed to understanding APIN before changing APIN.
He has asked three questions: what should we protect, what should we change, and what should we create?
This survey is one way to answer them, in your own voice.

Your answers will help leadership shape priorities on growth, staff welfare, culture, flexibility,
policies and benefits, and will set a baseline Satisfaction Index so we can measure progress together.

The CEO will report back to all staff on what was heard and what will be done.

--------------------------------------------------------------------------------
HOW TO RESPOND:
--------------------------------------------------------------------------------
1. Please answer based on your own experience.
2. Unless the survey is explicitly configured otherwise, do not include your name or details
   that could identify you or any other staff member.
3. There are no right or wrong answers. Answer honestly, based on your own experience.
4. For rating questions, select one answer.
5. For "select all" questions, choose every option that applies.
6. We encourage you to answer as many questions as possible. If possible, please answer all the questions.

--------------------------------------------------------------------------------
SURVEY MAP (8 SECTIONS):
--------------------------------------------------------------------------------
- Section A: About your work experience (3 questions)
- Section B: Organization growth and direction (5 questions)
- Section C: Staff welfare, benefits and career development (5 questions)
- Section D: Culture, leadership and ways of working (14 questions)
- Section E: Flexibility, policies and internal processes (10 questions)
- Section F: Overall satisfaction and priorities for change (7 questions)
- Section G: Leadership, communication and accessibility (8 questions)
- Section H: In your own words (2 questions)

================================================================================
SURVEY QUESTIONS (1 TO 54)
================================================================================
`;

  SURVEY_SECTIONS.forEach((sec) => {
    text += `\n================================================================================\n`;
    text += `SECTION ${sec.id}. ${sec.title.toUpperCase()} (${sec.subtitle})\n`;
    if (sec.introText) {
      text += `Intro: ${sec.introText}\n`;
    }
    text += `================================================================================\n\n`;

    sec.questions.forEach((q) => {
      text += `${q.number}. ${q.text}\n`;
      if (q.helperText) {
        text += `   [Instruction: ${q.helperText}]\n`;
      }

      if (q.type === 'single-select' || q.type === 'multi-select') {
        q.options?.forEach((opt) => {
          text += `   [ ] ${opt.label}${opt.isOther ? ' (Please specify: ____________)' : ''}\n`;
        });
      } else if (q.type === 'open-response') {
        text += `   Response: [________________________________________________________________]\n`;
        text += `   (Privacy note: Please do not include names or details that could identify you or others. Limit: ${q.maxLength || 1500} characters)\n`;
      } else if (q.type === 'nps-scale') {
        text += `   Scale: 0 (Not at all likely) 1 2 3 4 5 6 7 8 9 10 (Extremely likely)\n`;
      } else if (q.type === 'likert-matrix' && q.likertStatements && q.likertOptions) {
        text += `   Rating Scale: ${q.likertOptions.join(' | ')}\n`;
        q.likertStatements.forEach((stmt) => {
          text += `   ${stmt.number}. ${stmt.text}\n`;
          text += `      Options: ${q.likertOptions?.map((o) => `[ ] ${o}`).join('   ')}\n`;
        });
      } else if (q.type === 'ranking' && q.rankingItems) {
        text += `   Rank your top 5 priorities (1 = highest priority, 5 = fifth priority):\n`;
        text += `   #1 Priority: __________________________________________________\n`;
        text += `   #2 Priority: __________________________________________________\n`;
        text += `   #3 Priority: __________________________________________________\n`;
        text += `   #4 Priority: __________________________________________________\n`;
        text += `   #5 Priority: __________________________________________________\n`;
        text += `   Candidate items to choose from:\n`;
        q.rankingItems.forEach((item, idx) => {
          text += `     ${idx + 1}. ${item}\n`;
        });
      }

      text += `\n`;
    });

    if (sec.id === 'H') {
      text += `Thank you. Your voice matters.\n\n`;
    }
  });

  text += `================================================================================\n`;
  text += `© APIN Public Health Initiatives · Employee Pulse Survey\n`;
  text += `================================================================================\n`;

  return text;
}

/**
 * Downloads a string as a file in the browser
 */
export function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print-ready window containing the complete survey form (cover pages + 54 questions)
 */
export function openPrintableSurveyWindow() {
  const printHtml = generatePrintableSurveyHtml();
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  } else {
    // If popups blocked, download as HTML file
    downloadFile(
      printHtml,
      'APIN-Employee-Pulse-Survey-Complete-Form.html',
      'text/html;charset=utf-8'
    );
  }
}

/**
 * Escapes a cell value for standard RFC 4180 CSV
 */
function escapeCsvCell(val: any): string {
  if (val === undefined || val === null) return '""';
  let str = '';
  if (Array.isArray(val)) {
    str = val.join(', ');
  } else if (typeof val === 'object') {
    str = Object.entries(val)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([k, v]) => `${k}. ${v}`)
      .join('; ');
  } else {
    str = String(val);
  }
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Builds CSV column definitions based on survey sections and questions,
 * using the ACTUAL QUESTIONS as headers (not question numbers) to match Google Sheets.
 */
function getSurveyCsvColumns(): { key: string; label: string }[] {
  const columns: { key: string; label: string }[] = [
    { key: 'submittedAt', label: 'Timestamp' },
    { key: 'submissionId', label: 'Submission ID' },
    { key: 'surveyVersion', label: 'Survey Version' },
  ];

  SURVEY_SECTIONS.forEach((sec) => {
    sec.questions.forEach((q) => {
      if (q.type === 'likert-matrix' && q.likertStatements) {
        q.likertStatements.forEach((stmt) => {
          columns.push({
            key: stmt.id,
            label: stmt.text,
          });
        });
      } else {
        columns.push({
          key: q.id,
          label: q.text,
        });

        // If has other option, include separate column
        if (q.options?.some((opt) => opt.isOther)) {
          columns.push({
            key: `${q.id}_other`,
            label: `${q.text} (Other Details)`,
          });
        }
      }
    });
  });

  return columns;
}

/**
 * Generates CSV content from local backup submissions using actual questions as headers
 */
export function exportLocalSubmissionsToCsv(submissions: any[]): string {
  if (!submissions || submissions.length === 0) {
    const defaultCols = getSurveyCsvColumns();
    return defaultCols.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',') + '\n';
  }

  const columns = getSurveyCsvColumns();
  const headerRow = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(',');

  const rows = submissions.map((sub) => {
    const answers = sub.answers || sub;
    return columns
      .map((col) => {
        let val: any;
        if (col.key === 'submissionId') val = sub['Submission ID'] ?? sub.submissionId;
        else if (col.key === 'submittedAt') val = sub['Timestamp'] ?? sub.submittedAt;
        else if (col.key === 'surveyVersion') val = sub['Survey Version'] ?? sub.surveyVersion;
        else {
          val = answers[col.key] ?? sub[col.label] ?? sub[col.key];
        }

        return escapeCsvCell(val);
      })
      .join(',');
  });

  return [headerRow, ...rows].join('\n');
}

/**
 * Downloads the local backup submissions as a CSV file
 */
export function downloadLocalBackupCsv(submissions: any[]) {
  const csvContent = exportLocalSubmissionsToCsv(submissions);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(
    csvContent,
    `APIN-Survey-Local-Backup-${timestamp}.csv`,
    'text/csv;charset=utf-8'
  );
}
