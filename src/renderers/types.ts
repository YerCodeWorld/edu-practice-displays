export type Themes =
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

export type QuizTheme = { name: Themes; cssVariables: Record<string, string> };

export type RendererOptions = {
    theme?: QuizTheme;
    shuffle?: boolean;
    allowRetry?: boolean;
    resultHandler?: (r: any) => void;
    ariaLabel?: string;
}

export type Implementation = {
    renderer: (
        mount: HTMLElement,
        data: any,
        options?: RendererOptions
    ) => RendererHandle;
    validator: (data: any) => boolean;
    parser: (code: string) => any;
};

export type RendererHandle = {
    destroy(): void;    
    styleTag: string;     
    name: string;
    finish(): void;
}

export interface ContractType {

    name: string;
    description: string;
    image?: string; // URL 

    themes?: Record<Themes, QuizTheme>;
    version: number;
    parserVersion: number;

    category: string;
    tags: string[];

    usage: string[];
    wrong: string[];

    grammarExample: string[];
    defaultOptions?: any;

    implementation: Implementation;

    styleTag?: string;
    sectionTag?: string;

    html: string;
    css: string;

}

