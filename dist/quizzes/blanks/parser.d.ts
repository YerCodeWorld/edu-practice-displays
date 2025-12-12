export type ParseError = {
    pos: number;
    msg: string;
};
export type ParseResult = {
    ok: boolean;
    content?: {
        html: string;
        answerMap: Map<string, any>;
    };
    errors: ParseError[];
};
export declare function createDSLParser(): {
    parse: (code: string) => ParseResult;
    checkAnswers: (answerMap: Map<string, any>, parent?: Document | HTMLElement) => {
        total: number;
        correct: number;
        details: Record<string, any>;
    };
    validateData: (_data: any) => boolean;
    test: () => ParseResult;
};
