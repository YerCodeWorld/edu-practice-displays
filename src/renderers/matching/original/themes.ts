import {
  QuizTheme,
  Themes
} from '../../types'; 

export const themes: Record<string, QuizTheme> = {
    original: {
        name: 'original',
        cssVariables: {
            '--primary-color': '#f97316',
            '--primary-hover': '#ea580c',
            '--success-color': '#16a34a',
            '--error-color': '#dc2626',
            '--background': '#fff7ed',
            '--surface': '#ffffff',
            '--border': '#fed7aa',
            '--text-primary': '#1f2937',
            '--text-secondary': '#6b7280',
            '--shadow': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    light: {
        name: 'light',
        cssVariables: {
            '--primary-color': '#2563eb',
            '--primary-hover': '#1d4ed8',
            '--success-color': '#16a34a',
            '--error-color': '#dc2626',
            '--background': '#f9fafb',
            '--surface': '#ffffff',
            '--border': '#e5e7eb',
            '--text-primary': '#111827',
            '--text-secondary': '#6b7280',
            '--shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    dark: {
        name: 'dark',
        cssVariables: {
            '--primary-color': '#3b82f6',
            '--primary-hover': '#2563eb',
            '--success-color': '#22c55e',
            '--error-color': '#ef4444',
            '--background': '#0f172a',
            '--surface': '#1e293b',
            '--border': '#334155',
            '--text-primary': '#f1f5f9',
            '--text-secondary': '#94a3b8',
            '--shadow': '0 2px 6px rgba(0, 0, 0, 0.5)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    forest: {
        name: 'forest',
        cssVariables: {
            '--primary-color': '#15803d',
            '--primary-hover': '#166534',
            '--success-color': '#16a34a',
            '--error-color': '#dc2626',
            '--background': '#f0fdf4',
            '--surface': '#dcfce7',
            '--border': '#86efac',
            '--text-primary': '#064e3b',
            '--text-secondary': '#065f46',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.08)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    deepForest: {
        name: 'deepForest',
        cssVariables: {
            '--primary-color': '#22c55e',
            '--primary-hover': '#16a34a',
            '--success-color': '#4ade80',
            '--error-color': '#ef4444',
            '--background': '#052e16',
            '--surface': '#064e3b',
            '--border': '#14532d',
            '--text-primary': '#ecfdf5',
            '--text-secondary': '#6ee7b7',
            '--shadow': '0 2px 6px rgba(0, 0, 0, 0.7)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    ocean: {
        name: 'ocean',
        cssVariables: {
            '--primary-color': '#0ea5e9',
            '--primary-hover': '#0284c7',
            '--success-color': '#14b8a6',
            '--error-color': '#e11d48',
            '--background': '#ecfeff',
            '--surface': '#cffafe',
            '--border': '#67e8f9',
            '--text-primary': '#083344',
            '--text-secondary': '#155e75',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.08)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    deepOcean: {
        name: 'deepOcean',
        cssVariables: {
            '--primary-color': '#38bdf8',
            '--primary-hover': '#0ea5e9',
            '--success-color': '#06b6d4',
            '--error-color': '#e11d48',
            '--background': '#082f49',
            '--surface': '#164e63',
            '--border': '#155e75',
            '--text-primary': '#e0f2fe',
            '--text-secondary': '#7dd3fc',
            '--shadow': '0 2px 6px rgba(0, 0, 0, 0.6)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    sunSet: {
        name: 'sunSet',
        cssVariables: {
            '--primary-color': '#ea580c',
            '--primary-hover': '#c2410c',
            '--success-color': '#f97316',
            '--error-color': '#be123c',
            '--background': '#fff7ed',
            '--surface': '#ffedd5',
            '--border': '#fdba74',
            '--text-primary': '#7c2d12',
            '--text-secondary': '#9a3412',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    moonSet: {
        name: 'moonSet',
        cssVariables: {
            '--primary-color': '#9333ea',
            '--primary-hover': '#7e22ce',
            '--success-color': '#a855f7',
            '--error-color': '#db2777',
            '--background': '#fdf4ff',
            '--surface': '#fae8ff',
            '--border': '#d8b4fe',
            '--text-primary': '#581c87',
            '--text-secondary': '#6b21a8',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    bright: {
        name: 'bright',
        cssVariables: {
            '--primary-color': '#eab308',
            '--primary-hover': '#ca8a04',
            '--success-color': '#84cc16',
            '--error-color': '#ef4444',
            '--background': '#ffffff',
            '--surface': '#fef9c3',
            '--border': '#fde68a',
            '--text-primary': '#1f2937',
            '--text-secondary': '#6b7280',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.06)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    neon: {
        name: 'neon',
        cssVariables: {
            '--primary-color': '#22d3ee',
            '--primary-hover': '#06b6d4',
            '--success-color': '#a3e635',
            '--error-color': '#f472b6',
            '--background': '#0f0f1a',
            '--surface': '#1a1a2e',
            '--border': '#6b21a8',
            '--text-primary': '#e0e0ff',
            '--text-secondary': '#c084fc',
            '--shadow': '0 0 8px rgba(168, 85, 247, 0.6)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    }
};

