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
    setTheme(newTheme: QuizTheme): void;
    finish(): void;
}

export interface ContractType {

    name: string;
    description: string;

    themes: Record<Themes, QuizTheme>;
    version: number;
    parserVersion: number;

    category: string;
    tags: string[];

    usage: string[];
    wrong: string[];

    grammarExample: string[];
    defaultOptions?: any;

    implementation: Implementation;

    html: string;
    css: string;

}

