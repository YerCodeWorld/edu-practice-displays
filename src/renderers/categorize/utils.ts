interface CategorizeContent {
  instruction?: string;
  content: Array<{
    category: string;
    words: string[]
  }>;
  distractors: string[]; 
}

function parseCategorize(code: string) {}

function validateCategorize(data: CategorizeContent): boolean { return true; }
