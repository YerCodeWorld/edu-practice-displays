// types/edu-mcq.d.ts
export {};

interface McqFeedback {
  total: number;
  correct: number;
  wrong: string[];
  missed: string[];
}

interface McqData { prompt: string; options: string[]; correct: string[]; }

declare global {
  interface EduMcqElement extends HTMLElement {
    data: McqData;
    showFeedback(): McqFeedback;
    reset(): void;
  }

  interface HTMLElementTagNameMap {
    'edu-mcq': EduMcqElement;   // <-- key line
  }
}

