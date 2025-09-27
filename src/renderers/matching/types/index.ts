export type ThemeName =
  | 'original'
  | 'light'
  | 'dark'
  | 'forest'
  | 'deepForest'
  | 'ocean'
  | 'deepOcean'
  | 'sunSet'
  | 'moonSet'
  | 'bright'
  | 'neon';

export type QuizTheme = { name: ThemeName; cssVariables: Record<string, string> };

export type Pair = {
    left: string;
    right: string;
    hint?: string;
}

export interface ParseResult {
    ok: boolean;
    content?: MatchData;
    errors?: string;
}

export interface GeneralContent {    
    content: Array<Pair>;
    distractors?: string[];
    points?: number;
}

/* --------------------------------------------- */

export type MatchData = {
    content: Pair[];
    distractors?: string[];
    leftColumnName?: string;
    rightColumnName?: string;
}

export type MatchingState = {
    matches: Record<string, string>;
    pendingMatches: Record<string, string>;
    selectedLeft: string | null;
    selectedRight: string | null;
    score: number;
}

export type MatchingResultDetail = {
    correct: number;
    total: number;
    score: number;
    matches: Record<string, string>;
}

export type MatchingResult = {
    detail: MatchingResultDetail;
    timestamp: number;
}

export type MatchingRendererOptions = {    
    shuffle?: boolean;
    allowRetry?: boolean;
    resultHandler?: (r: MatchingResult) => void;
    ariaLabel?: string;
}

export type ComponentData = {
    name: string;
    description: string;
}

export type MatchingRendererHandle = {
    destroy(): void;
    setTheme(theme: QuizTheme): void;    
    finish(): void;
}
