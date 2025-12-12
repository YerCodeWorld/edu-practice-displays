export type CategorizeData = {
    instruction?: string;
    items: Array<{
        category: string;
        words: string[];
    }>;
    distractors?: string[];
};
export declare function categorizeParser(code: string): {
    ok: boolean;
    content?: CategorizeData;
    errors?: string;
};
