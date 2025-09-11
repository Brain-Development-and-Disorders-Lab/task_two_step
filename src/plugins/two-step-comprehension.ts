/**
 * Comprehension plugin for the Two-Step Task
 * Presents a single true/false question with immediate feedback
 */

import { ComprehensionTrialData } from '../types';
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

class ComprehensionPlugin implements JsPsychPlugin<typeof ComprehensionPlugin.info> {
  static info = {
    name: 'two-step-comprehension' as const,
    parameters: {
      question: {
        type: ParameterType.COMPLEX,
        default: undefined,
      },
      preamble: {
        type: ParameterType.STRING,
        default: 'Please answer the following question:',
      },
      button_label: {
        type: ParameterType.STRING,
        default: 'Continue',
      },
      feedback: {
        type: ParameterType.STRING,
        default: 'The correct answer is:',
      },
    },
  } as const;

  private jsPsych: JsPsych;
  private data: ComprehensionTrialData;
  private questionStartTime: number = 0;

  constructor(jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
    this.data = this.createDefaultData();
  }

  private createDefaultData(): ComprehensionTrialData {
    return {
      trialStartTime: 0,
      trialEndTime: 0,
      question: { prompt: '', correct: '' },
      response: '',
      correctAnswer: '',
      responseTime: 0,
      isCorrect: false,
    };
  }

  private createQuestionHTML(question: any, preamble: string, buttonLabel: string): string {
    return `
      <style>
        .comprehension-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: "Open Sans", "Arial", sans-serif;
          align-items: center;
          justify-content: center;
          background-color: #000;
          color: #fff;
          padding: 40px;
          box-sizing: border-box;
        }
        .preamble-text {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 32px;
          line-height: 1.4;
          max-width: 800px;
          color: #fff;
        }
        .question-text {
          font-size: 18px;
          font-weight: 400;
          text-align: center;
          margin-bottom: 32px;
          line-height: 1.4;
          max-width: 800px;
        }
        .options-container {
          display: flex;
          gap: 30px;
          margin-bottom: 32px;
        }
        .option-button {
          padding: 6px 12px;
          font-size: 14px;
          font-weight: 400;
          font-family: "Open Sans", "Arial", sans-serif;
          cursor: pointer;
          border: 1px solid #ccc;
          border-radius: 4px;
          color: #333;
          background-color: #fff;
        }
        .option-button:hover {
          background-color: #e8e8e8;
          border-color: #999;
        }
        .option-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .feedback-container {
          font-size: 18px;
          font-weight: 400;
          text-align: center;
          margin-top: 16px;
          min-height: 4em;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .selection-indicator {
          font-size: 18px;
          font-weight: 400;
          text-align: center;
          margin-bottom: 8px;
          color: #fff;
        }
        .feedback-correct {
          color: #4CAF50;
          font-weight: bold;
        }
        .feedback-incorrect {
          color: #F44336;
          font-weight: bold;
        }
        .continue-instruction {
          font-size: 18px;
          font-weight: 400;
          text-align: center;
          margin-top: 8px;
          margin-bottom: 8px;
          color: transparent;
          min-height: 1.4em;
        }
        .continue-button {
          padding: 6px 12px;
          font-size: 14px;
          font-weight: 400;
          font-family: "Open Sans", "Arial", sans-serif;
          cursor: pointer;
          border: 1px solid #ccc;
          border-radius: 4px;
          color: #333;
          background-color: #fff;
          transition: all 0.2s ease;
          opacity: 0;
          pointer-events: none;
        }
        .continue-button.visible {
          opacity: 1;
          pointer-events: auto;
        }
        .continue-button:hover {
          background-color: #e8e8e8;
          border-color: #999;
        }
      </style>
      <div class="comprehension-container">
        <div class="preamble-text">
          ${preamble}
        </div>
        <div class="question-text">
          ${question.prompt}
        </div>
        <div class="options-container">
          <button class="option-button" data-answer="true">True</button>
          <button class="option-button" data-answer="false">False</button>
        </div>
        <div class="feedback-container" id="feedback"></div>
        <div class="continue-instruction" id="continue-instruction">Click "Continue >" to proceed.</div>
        <button class="continue-button" id="continue-btn">${buttonLabel} &gt;</button>
      </div>
    `;
  }

  private showFeedback(isCorrect: boolean, correctAnswer: string, displayElement: HTMLElement, customFeedback: string, participantAnswer: string): void {
    const feedbackElement = displayElement.querySelector('#feedback') as HTMLElement;
    const continueButton = displayElement.querySelector('#continue-btn') as HTMLElement;
    const continueInstruction = displayElement.querySelector('#continue-instruction') as HTMLElement;
    const optionButtons = displayElement.querySelectorAll('.option-button') as NodeListOf<HTMLButtonElement>;

    // Disable option buttons
    optionButtons.forEach(button => {
      button.disabled = true;
    });

    // Show feedback
    const answerText = participantAnswer === 'true' ? 'True' : 'False';
    if (isCorrect) {
      feedbackElement.innerHTML = `
        <div class="selection-indicator">You selected: <strong>${answerText}</strong></div>
        <div class="feedback-correct">Correct!</div>
      `;
    } else {
      feedbackElement.innerHTML = `
        <div class="selection-indicator">You selected: <strong>${answerText}</strong></div>
        <div class="feedback-incorrect">${customFeedback}</div>
      `;
    }

    // Show continue button and instruction immediately
    continueButton.classList.add('visible');
    if (continueInstruction) {
      continueInstruction.style.color = '#fff';
    }
  }

  private handleQuestionResponse(answer: string, displayElement: HTMLElement, trial: TrialType<typeof ComprehensionPlugin.info>): void {
    const question = trial.question;
    if (!question) return;

    const responseTime = Date.now() - this.questionStartTime;
    const isCorrect = answer === question.correct;

    // Store response data
    this.data.response = answer;
    this.data.correctAnswer = question.correct;
    this.data.responseTime = responseTime;
    this.data.isCorrect = isCorrect;

    // Show feedback
    this.showFeedback(isCorrect, question.correct, displayElement, trial.feedback || 'The correct answer is:', answer);

    // Set up continue button handler
    const continueButton = displayElement.querySelector('#continue-btn') as HTMLElement;
    const handleContinue = () => {
      continueButton.removeEventListener('click', handleContinue);
      this.finishTrial();
    };
    continueButton.addEventListener('click', handleContinue);
  }

  private finishTrial(): void {
    this.data.trialEndTime = Date.now();
    this.jsPsych.finishTrial(this.data);
  }

  trial(displayElement: HTMLElement, trial: TrialType<typeof ComprehensionPlugin.info>) {
    // Initialize trial data
    this.data.trialStartTime = Date.now();
    this.data.question = trial.question;
    this.questionStartTime = Date.now();

    // Create and display the question immediately
    displayElement.innerHTML = this.createQuestionHTML(trial.question, trial.preamble || 'Please answer the following question:', trial.button_label || 'Continue');

    // Set up event listeners for the question
    const optionButtons = displayElement.querySelectorAll('.option-button') as NodeListOf<HTMLButtonElement>;
    optionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const answer = button.getAttribute('data-answer');
        if (answer) {
          this.handleQuestionResponse(answer, displayElement, trial);
        }
      });
    });
  }
}

export default ComprehensionPlugin;
