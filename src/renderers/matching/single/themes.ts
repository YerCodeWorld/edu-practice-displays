import { Themes, QuizTheme } from "../../types";

export const themes: Record<Themes, QuizTheme> = {
    original: {
        name: 'original',
        cssVariables: {
            '--bg': '#eef6ff',
            '--card': '#f6fbff',
            '--ink': '#0f172a',
            '--muted': '#64748b',
            '--accent': '#2563eb',
            '--accent2': '#14b8a6',
            '--accent3': '#1f9edb',
            '--border': 'color-mix(in oklab, var(--ink) 28%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 10%, white)'
        }
    },
    light: {
        name: 'light',
        cssVariables: {
            '--bg': '#f9fafb',
            '--card': '#ffffff',
            '--ink': '#111827',
            '--muted': '#6b7280',
            '--accent': '#2563eb',
            '--accent2': '#16a34a',
            '--accent3': '#d97706',
            '--border': 'color-mix(in oklab, var(--ink) 20%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 12%, white)'
        }
    },
    dark: {
        name: 'dark',
        cssVariables: {
            '--bg': '#0f172a',
            '--card': '#1e293b',
            '--ink': '#f1f5f9',
            '--muted': '#94a3b8',
            '--accent': '#3b82f6',
            '--accent2': '#22c55e',
            '--accent3': '#eab308',
            '--border': 'color-mix(in oklab, var(--ink) 40%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 20%, black)'
        }
    },
    forest: {
        name: 'forest',
        cssVariables: {
            '--bg': '#f0fdf4',
            '--card': '#dcfce7',
            '--ink': '#064e3b',
            '--muted': '#10b981',
            '--accent': '#15803d',
            '--accent2': '#4ade80',
            '--accent3': '#84cc16',
            '--border': 'color-mix(in oklab, var(--ink) 25%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 10%, white)'
        }
    },
    deepForest: {
        name: 'deepForest',
        cssVariables: {
            '--bg': '#052e16',
            '--card': '#064e3b',
            '--ink': '#ecfdf5',
            '--muted': '#34d399',
            '--accent': '#22c55e',
            '--accent2': '#84cc16',
            '--accent3': '#facc15',
            '--border': 'color-mix(in oklab, var(--ink) 45%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 15%, black)'
        }
    },
    ocean: {
        name: 'ocean',
        cssVariables: {
            '--bg': '#ecfeff',
            '--card': '#cffafe',
            '--ink': '#083344',
            '--muted': '#06b6d4',
            '--accent': '#0ea5e9',
            '--accent2': '#22d3ee',
            '--accent3': '#0284c7',
            '--border': 'color-mix(in oklab, var(--ink) 25%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 12%, white)'
        }
    },
    deepOcean: {
        name: 'deepOcean',
        cssVariables: {
            '--bg': '#082f49',
            '--card': '#164e63',
            '--ink': '#e0f2fe',
            '--muted': '#38bdf8',
            '--accent': '#0ea5e9',
            '--accent2': '#06b6d4',
            '--accent3': '#f472b6',
            '--border': 'color-mix(in oklab, var(--ink) 40%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 18%, #082f49)'
        }
    },
    sunSet: {
        name: 'sunSet',
        cssVariables: {
            '--bg': '#fff7ed',
            '--card': '#ffedd5',
            '--ink': '#7c2d12',
            '--muted': '#f97316',
            '--accent': '#ea580c',
            '--accent2': '#f59e0b',
            '--accent3': '#c2410c',
            '--border': 'color-mix(in oklab, var(--ink) 28%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 15%, white)'
        }
    },
    moonSet: {
        name: 'moonSet',
        cssVariables: {
            '--bg': '#fdf4ff',
            '--card': '#fae8ff',
            '--ink': '#581c87',
            '--muted': '#d946ef',
            '--accent': '#9333ea',
            '--accent2': '#a855f7',
            '--accent3': '#db2777',
            '--border': 'color-mix(in oklab, var(--ink) 25%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 15%, white)'
        }
    },
    bright: {
        name: 'bright',
        cssVariables: {
            '--bg': '#ffffff',
            '--card': '#fef9c3',
            '--ink': '#1f2937',
            '--muted': '#eab308',
            '--accent': '#facc15',
            '--accent2': '#84cc16',
            '--accent3': '#ef4444',
            '--border': 'color-mix(in oklab, var(--ink) 20%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 15%, white)'
        }
    },
    neon: {
        name: 'neon',
        cssVariables: {
            '--bg': '#0f0f1a',
            '--card': '#1a1a2e',
            '--ink': '#e0e0ff',
            '--muted': '#c084fc',
            '--accent': '#22d3ee',
            '--accent2': '#a3e635',
            '--accent3': '#f472b6',
            '--border': 'color-mix(in oklab, var(--ink) 50%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 20%, black)'
        }
    }
};

