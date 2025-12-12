export type RendererResult = {
    detail: {
        correct: number;
        total: number;
        score: number; 
    };
    timestamp: string; 
    
    // TODO: please refactor to 'winningScreen'
    winningEl?: HTMLElement | null;
}
    
export type RendererOptions = {
    shuffle?: boolean;
    
    // not needed, let whatever implementation is being used manage this
    allowRetry?: boolean;  

    resultHandler?: (r: RendererResult) => void;

    ariaLabel?: string;

    // legacy
    checkBtn?: boolean; 

    instructionsEnabled?: boolean;
    checkButtonEnabled?: boolean;
    animationsEnabled?: boolean;
    soundEffectsEnabled?: boolean;
}

export type RendererHandle = {
    destroy(): void;    
    check(): void;
}

type Implementation = {
    renderer: (
        mount: HTMLElement,
        data: any,
        options?: RendererOptions
    ) => RendererHandle;
    validator: (data: any) => boolean;
    parser: (code: string) => any;
};
  

export interface ContractType {

    name: string;
    description: string;

    version: number;
    parserVersion: number;

    category: string;
    tags: string[];

    usage: string[];
    wrong: string[]; // wrong usage

    // please refactor to just 'example'
    grammarExample: string[];
    defaultOptions?: any;

    implementation: Implementation;

    styleTag?: string;
    sectionTag?: string;

    html: string;
    css: string;
    
    instructionsRemovable?: boolean; 
}

