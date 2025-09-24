import {
  QuizTheme,
  Themes
} from '../../types'; 

export const themes: Record<Themes, QuizTheme> = {
  original: {
    name: 'original',
    cssVariables: {
      "--bg": "#f5f9f4",
      "--card": "#ffffff",
      "--text": "#1b2616",
      "--muted": "#7a8f7a",
      "--accent": "#2f855a",
      "--accent-2": "#b7791f",
      "--border": "color-mix(in oklch, var(--text) 18%, transparent)"
    }
  },
  light: {
    name: 'light',
    cssVariables: {
      "--bg": "#fafafa",
      "--card": "#ffffff",
      "--text": "#222222",
      "--muted": "#7a7a7a",
      "--accent": "#3182ce",
      "--accent-2": "#805ad5",
      "--border": "color-mix(in oklch, var(--text) 15%, transparent)"
    }
  },
  dark: {
    name: 'dark',
    cssVariables: {
      "--bg": "#1a202c",
      "--card": "#2d3748",
      "--text": "#e2e8f0",
      "--muted": "#a0aec0",
      "--accent": "#63b3ed",
      "--accent-2": "#f6ad55",
      "--border": "color-mix(in oklch, var(--text) 25%, transparent)"
    }
  },
  forest: {
    name: 'forest',
    cssVariables: {
      "--bg": "#e8f5e9",
      "--card": "#ffffff",
      "--text": "#1b5e20",
      "--muted": "#4caf50",
      "--accent": "#2e7d32",
      "--accent-2": "#8d6e63",
      "--border": "color-mix(in oklch, var(--text) 20%, transparent)"
    }
  },
  deepForest: {
    name: 'deepForest',
    cssVariables: {
      "--bg": "#102418",
      "--card": "#1b3124",
      "--text": "#d0e8d2",
      "--muted": "#6c9c78",
      "--accent": "#2f855a",
      "--accent-2": "#c9a227",
      "--border": "color-mix(in oklch, var(--text) 30%, transparent)"
    }
  },
  ocean: {
    name: 'ocean',
    cssVariables: {
      "--bg": "#e0f7fa",
      "--card": "#ffffff",
      "--text": "#01579b",
      "--muted": "#4dd0e1",
      "--accent": "#0288d1",
      "--accent-2": "#00bcd4",
      "--border": "color-mix(in oklch, var(--text) 18%, transparent)"
    }
  },
  deepOcean: {
    name: 'deepOcean',
    cssVariables: {
      "--bg": "#0a192f",
      "--card": "#112240",
      "--text": "#ccd6f6",
      "--muted": "#8892b0",
      "--accent": "#64ffda",
      "--accent-2": "#48b1f5",
      "--border": "color-mix(in oklch, var(--text) 28%, transparent)"
    }
  },
  sunSet: {
    name: 'sunSet',
    cssVariables: {
      "--bg": "#fff5f0",
      "--card": "#ffffff",
      "--text": "#4a1d1f",
      "--muted": "#ff9770",
      "--accent": "#ff6b6b",
      "--accent-2": "#ffa94d",
      "--border": "color-mix(in oklch, var(--text) 20%, transparent)"
    }
  },
  moonSet: {
    name: 'moonSet',
    cssVariables: {
      "--bg": "#2c2c54",
      "--card": "#474787",
      "--text": "#f7f1e3",
      "--muted": "#aaa8c5",
      "--accent": "#706fd3",
      "--accent-2": "#ff793f",
      "--border": "color-mix(in oklch, var(--text) 22%, transparent)"
    }
  },
  bright: {
    name: 'bright',
    cssVariables: {
      "--bg": "#ffffff",
      "--card": "#f9f871",
      "--text": "#000000",
      "--muted": "#888888",
      "--accent": "#ff1744",
      "--accent-2": "#2979ff",
      "--border": "color-mix(in oklch, var(--text) 12%, transparent)"
    }
  },
  neon: {
    name: 'neon',
    cssVariables: {
      "--bg": "#0d0d0d",
      "--card": "#1a1a1a",
      "--text": "#e0e0e0",
      "--muted": "#8d99ae",
      "--accent": "#39ff14",
      "--accent-2": "#ff00ff",
      "--border": "color-mix(in oklch, var(--text) 35%, transparent)"
    }
  }
};

