import {
  QuizTheme,
  Themes
} from '../types'; 

export const themes: Record<Themes, QuizTheme> = {
  original: {
    name: 'original',
    cssVariables: {
      '--bg': '#0b1220',
      '--surface': '#0f172a',
      '--chip-bg': '#111827',
      '--chip-text': '#e5e7eb',
      '--chip-border': '#1f2937',
      '--accent': '#6366f1',
      '--muted': '#94a3b8',
      '--shadow': '0 10px 25px rgba(0,0,0,.25)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#f8fafc'
    }
  },
  light: {
    name: 'light',
    cssVariables: {
      '--bg': '#f8fafc',
      '--surface': '#ffffff',
      '--chip-bg': '#f1f5f9',
      '--chip-text': '#0b1220',
      '--chip-border': '#e2e8f0',
      '--accent': '#2563eb',
      '--muted': '#64748b',
      '--shadow': '0 10px 25px rgba(0,0,0,.10)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#0b1220'
    }
  },
  dark: {
    name: 'dark',
    cssVariables: {
      '--bg': '#050816',
      '--surface': '#0b1220',
      '--chip-bg': '#0f172a',
      '--chip-text': '#e5e7eb',
      '--chip-border': '#1f2937',
      '--accent': '#8b5cf6',
      '--muted': '#94a3b8',
      '--shadow': '0 10px 25px rgba(0,0,0,.3)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#e2e8f0'
    }
  },
  forest: {
    name: 'forest',
    cssVariables: {
      '--bg': '#0b1a12',
      '--surface': '#10251a',
      '--chip-bg': '#0e1f17',
      '--chip-text': '#e6f4ea',
      '--chip-border': '#1e3a2f',
      '--accent': '#10b981',
      '--muted': '#86efac',
      '--shadow': '0 10px 25px rgba(0,0,0,.22)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#ecfdf5'
    }
  },
  deepForest: {
    name: 'deepForest',
    cssVariables: {
      '--bg': '#07140d',
      '--surface': '#0b1f15',
      '--chip-bg': '#0b1c13',
      '--chip-text': '#dff7e8',
      '--chip-border': '#153826',
      '--accent': '#16a34a',
      '--muted': '#6ee7b7',
      '--shadow': '0 10px 25px rgba(0,0,0,.28)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#e8fff2'
    }
  },
  ocean: {
    name: 'ocean',
    cssVariables: {
      '--bg': '#07141a',
      '--surface': '#0b1f28',
      '--chip-bg': '#0a2733',
      '--chip-text': '#e6fbff',
      '--chip-border': '#133a4a',
      '--accent': '#0ea5e9',
      '--muted': '#7dd3fc',
      '--shadow': '0 10px 25px rgba(0,0,0,.22)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#effafd'
    }
  },
  deepOcean: {
    name: 'deepOcean',
    cssVariables: {
      '--bg': '#051018',
      '--surface': '#0a1a23',
      '--chip-bg': '#0a1f2b',
      '--chip-text': '#dff8ff',
      '--chip-border': '#123242',
      '--accent': '#22d3ee',
      '--muted': '#93c5fd',
      '--shadow': '0 10px 25px rgba(0,0,0,.28)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#e8fbff'
    }
  },
  sunSet: {
    name: 'sunSet',
    cssVariables: {
      '--bg': '#1a0d0b',
      '--surface': '#2a1410',
      '--chip-bg': '#331815',
      '--chip-text': '#fff5f2',
      '--chip-border': '#4a241e',
      '--accent': '#f97316',
      '--muted': '#f5a097',
      '--shadow': '0 10px 25px rgba(0,0,0,.26)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#fff1eb'
    }
  },
  moonSet: {
    name: 'moonSet',
    cssVariables: {
      '--bg': '#120b1a',
      '--surface': '#1b1226',
      '--chip-bg': '#221733',
      '--chip-text': '#f5eaff',
      '--chip-border': '#2e1d4a',
      '--accent': '#a78bfa',
      '--muted': '#c4b5fd',
      '--shadow': '0 10px 25px rgba(0,0,0,.28)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#f4f0ff'
    }
  },
  bright: {
    name: 'bright',
    cssVariables: {
      '--bg': '#ffffff',
      '--surface': '#f8fafc',
      '--chip-bg': '#ffffff',
      '--chip-text': '#0b1220',
      '--chip-border': '#e5e7eb',
      '--accent': '#6366f1',
      '--muted': '#475569',
      '--shadow': '0 10px 25px rgba(0,0,0,.12)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#0b1220'
    }
  },
  neon: {
    name: 'neon',
    cssVariables: {
      '--bg': '#050510',
      '--surface': '#0a0a19',
      '--chip-bg': '#0f0f24',
      '--chip-text': '#eaffff',
      '--chip-border': '#1a1a3a',
      '--accent': '#22d3ee',
      '--muted': '#94a3b8',
      '--shadow': '0 10px 25px rgba(0,0,0,.35)',
      '--radius': '12px',
      '--maxw': 'min(100%, 720px)',
      '--text': '#eaffff'
    }
  }
};



