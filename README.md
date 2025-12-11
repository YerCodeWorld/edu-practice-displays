# EduScript

An interactive educational quiz and exercise framework for creating engaging learning experiences.

## Overview

EduScript is a TypeScript-based library that provides customizable quiz components and interactive educational exercises. The library offers a variety of quiz types including multiple choice, matching, categorization, fill-in-the-blanks, and more.

## Features

- **Multiple Quiz Types**: MCQ, matching, categorization, blanks, true/false, and manual input
- **Custom Web Components**: Letter picker, color picker, and global input components
- **Themeable**: Customizable CSS themes and styling
- **Framework Agnostic**: Works with any frontend framework
- **TypeScript Support**: Full type definitions included
- **Audio Feedback**: Built-in sound effects for interactions

## Installation

```bash
npm install eduscript
```

## Quick Start

```typescript
import { MCQContract, LetterPicker } from 'eduscript';

// Use a quiz contract
const quizData = {
  question: "What is 2 + 2?",
  options: ["3", "4", "5"],
  correct: 1
};

const mountElement = document.getElementById('quiz-container');
const handle = MCQContract.implementation.renderer(mountElement, quizData);
```

## Available Quiz Types

### Multiple Choice Questions (MCQ)
- Standard multiple choice with single correct answer
- Configurable options and styling

### Matching Exercises
- **Original Matching**: Connect related items
- **Wheels Matching**: Circular matching interface
- **Single Matching**: One-to-one matching
- **True/False**: Binary choice questions
- **Concepts Definition**: Match concepts to definitions

### Fill-in-the-Blanks
- **Single Blanks**: One missing word/phrase
- **Multiple Blanks**: Multiple missing elements
- **Reading Blanks**: Text comprehension with blanks

### Categorization
- **Color Categorize**: Sort items by color
- **Single Categorize**: Basic categorization exercise

### Manual Input
- Free-form text input exercises

## Custom Components

The library includes specialized web components:

- **Letter Picker**: ASCII letter selection component
- **Color Picker**: Simple color selection with limited palette
- **EduMCQ**: Enhanced multiple choice component

## Architecture

Each quiz type follows a consistent contract structure:

```typescript
interface ContractType {
  name: string;
  description: string;
  version: number;
  implementation: {
    renderer: (mount: HTMLElement, data: any, options?: RendererOptions) => RendererHandle;
    validator: (data: any) => boolean;
    parser: (code: string) => any;
  };
  html: string;
  css: string;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build library
pnpm build

# Development mode
pnpm dev

# Serve demo
pnpm serve
```

## Project Structure

```
src/
├── elements/          # Custom web components
├── quizzes/          # Quiz type implementations
│   ├── mcq/          # Multiple choice
│   ├── matching/     # Matching exercises
│   ├── blanks/       # Fill-in-the-blanks
│   ├── categorize/   # Categorization
│   └── manual/       # Manual input
├── services/         # Utility services
└── utils/           # Helper functions
```

## Requirements

- **FontAwesome 5**: Required for icons (add the script link from fontawesome.com)

## Browser Support

Modern browsers with ES2020 support. The library is bundled for browser environments and uses ES modules.

## License

Private package - see package.json for details.
