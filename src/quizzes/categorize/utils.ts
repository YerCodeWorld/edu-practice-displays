import { removeDistractors } from "./../../utils/utils";

export type CategorizeData = {
  instruction?: string; 
  items: Array<{
    category: string;
    words: string[];
  }>;
  distractors?: string[];
};

export function categorizeParser(code: string): { ok: boolean, content?: CategorizeData, errors?: string } {

  try {
    // First, extract distractors
    const distractorResult = removeDistractors(code);
    if (!distractorResult.ok) {
      return { ok: false, errors: distractorResult.errors };
    }
    
    const distractors = distractorResult.distractors || [];
    const cleanCode = distractorResult.resultString || code;
    
    // Extract instruction (comments starting with #)
    const instructionMatch = cleanCode.match(/^\s*#\s*(.+)$/m);
    const instruction = instructionMatch ? instructionMatch[1].trim() : undefined;
    
    // Parse category definitions
    // Pattern: CategoryName = item1 | item2 | item3;
    const categoryPattern = /(\w+)\s*=\s*([^;]+);/g;
    const categories: Array<{ category: string; words: string[] }> = [];
    
    let match;
    while ((match = categoryPattern.exec(cleanCode)) !== null) {
      const categoryName = match[1].trim();
      const itemsString = match[2].trim();
      
      // Split by | and clean up each item
      const words = itemsString
        .split('|')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      categories.push({
        category: categoryName,
        words: words
      });
    }
    
    if (categories.length === 0) {
      return { ok: false, errors: "No valid category definitions found" };
    }
    
    const result: CategorizeData = {
      instruction,
      items: categories,
      distractors
    };
    
    return { ok: true, content: result };
    
  } catch (error) {
    return { ok: false, errors: `Parse error: ${error instanceof Error ? error.message : String(error)}` };
  }
}

// function validateCategorize(data: CategorizeContent): boolean { return true; }
