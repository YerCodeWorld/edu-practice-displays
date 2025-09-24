import {
  QuizTheme,
  Themes
} from '../../types'; 

export const themes: Record<string, QuizTheme> = {
    original: {
        name: 'original',
        cssVariables: {
            '--bg':     '#fdf6ff',
            '--card':   '#fffaff',
            '--ink':    '#463c4b',
            '--muted':  '#e5d0eb',
            '--true':   '#8b5cf6',
            '--false':  '#ec4899',
            '--neutral':'#f59e0b',
            '--focus':  '#ec4899'
        }
    },
    light: {
        name: 'light',
        cssVariables: {
            '--bg':     '#f9fafb',
            '--card':   '#ffffff',
            '--ink':    '#111827',
            '--muted':  '#d1d5db',
            '--true':   '#16a34a',
            '--false':  '#dc2626',
            '--neutral':'#facc15',
            '--focus':  '#2563eb'
        }
    },
    dark: {
        name: 'dark',
        cssVariables: {
            '--bg':     '#0f172a',
            '--card':   '#1e293b',
            '--ink':    '#f1f5f9',
            '--muted':  '#475569',
            '--true':   '#22c55e',
            '--false':  '#ef4444',
            '--neutral':'#eab308',
            '--focus':  '#3b82f6'
        }
    },
    forest: {
        name: 'forest',
        cssVariables: {
            '--bg':     '#f0fdf4',
            '--card':   '#dcfce7',
            '--ink':    '#064e3b',
            '--muted':  '#86efac',
            '--true':   '#15803d',
            '--false':  '#b91c1c',
            '--neutral':'#ca8a04',
            '--focus':  '#166534'
        }
    },
    deepForest: {
        name: 'deepForest',
        cssVariables: {
            '--bg':     '#052e16',
            '--card':   '#064e3b',
            '--ink':    '#f0fdf4',
            '--muted':  '#14532d',
            '--true':   '#22c55e',
            '--false':  '#dc2626',
            '--neutral':'#eab308',
            '--focus':  '#84cc16'
        }
    },
    ocean: {
        name: 'ocean',
        cssVariables: {
            '--bg':     '#ecfeff',
            '--card':   '#cffafe',
            '--ink':    '#083344',
            '--muted':  '#67e8f9',
            '--true':   '#0ea5e9',
            '--false':  '#be123c',
            '--neutral':'#fbbf24',
            '--focus':  '#0284c7'
        }
    },
    deepOcean: {
        name: 'deepOcean',
        cssVariables: {
            '--bg':     '#082f49',
            '--card':   '#164e63',
            '--ink':    '#e0f2fe',
            '--muted':  '#155e75',
            '--true':   '#38bdf8',
            '--false':  '#e11d48',
            '--neutral':'#facc15',
            '--focus':  '#06b6d4'
        }
    },
    sunSet: {
        name: 'sunSet',
        cssVariables: {
            '--bg':     '#fff7ed',
            '--card':   '#ffedd5',
            '--ink':    '#7c2d12',
            '--muted':  '#fdba74',
            '--true':   '#ea580c',
            '--false':  '#be123c',
            '--neutral':'#eab308',
            '--focus':  '#c2410c'
        }
    },
    moonSet: {
        name: 'moonSet',
        cssVariables: {
            '--bg':     '#fdf4ff',
            '--card':   '#fae8ff',
            '--ink':    '#581c87',
            '--muted':  '#d8b4fe',
            '--true':   '#9333ea',
            '--false':  '#db2777',
            '--neutral':'#f59e0b',
            '--focus':  '#7e22ce'
        }
    },
    bright: {
        name: 'bright',
        cssVariables: {
            '--bg':     '#ffffff',
            '--card':   '#fef9c3',
            '--ink':    '#111827',
            '--muted':  '#fde68a',
            '--true':   '#84cc16',
            '--false':  '#ef4444',
            '--neutral':'#f59e0b',
            '--focus':  '#f97316'
        }
    },
    neon: {
        name: 'neon',
        cssVariables: {
            '--bg':     '#0f0f1a',
            '--card':   '#1a1a2e',
            '--ink':    '#e0e0ff',
            '--muted':  '#6b21a8',
            '--true':   '#22d3ee',
            '--false':  '#f472b6',
            '--neutral':'#facc15',
            '--focus':  '#a855f7'
        }
    }
}
