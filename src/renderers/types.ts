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

export type Theme = { name: Themes; cssVariables: Record<string, string> };

type options = {
    shuffle: Boolean;
    allowRetry: Boolean;
    ariaLabel: string;
}

type Implementation = {
    renderer: () => any;
    validator: () => string[];
    parser: () => string;
};

export interface ContractType {

    name: string;
    description: string;

    themes: Record<string, Theme>;
    version: number;
    parserVersion: number;

    category: string;
    tags: string[];

    usage: string[];
    wrong: string[];

    grammarExample: string[];
    defaultOptions: options;

    implementation: implementation;

    html: string;
    css: string;

}
