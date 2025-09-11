export type ThemeName = 'original' | 'modern';
export type QuizTheme = { name: string; cssVariables: Record<string, string> };

/**
 * Different than applying a theme, this one creates a style element directly into the
 * target element
 */
export function injectStyle(id: string, css: string): void {
    if (typeof document === "undefined") return;
    if (!document.getElementById(id)) {
        const element = document.createElement("style");
        element.id = id;
        element.textContent = css;
        document.head.appendChild(element);
    }
}

/**
 * Components have a theme system which allows changing their values using custom css properties.
 * This is typically applied here using a record which the keys and values (string, string).
 * Then mapping and applying to the target element.
 */
export function applyTheme(el: HTMLElement, theme?: QuizTheme): void {
    if (!theme) return;
    Object.entries(theme.cssVariables).forEach(([k, v]) => el.style.setProperty(k, v));
}

/**
 * Take an array of whatever and randomize its order. This is needed by most exercises
 * since always rendering in the same ordern makes it easier to pass by just memorizing order.
 */
export function shuffle<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * This section element is expected to be the root element to all components no matter
 * their type.
 */
export function createSection(cn: string, ariaLabel: string): HTMLElement {
    const root = document.createElement("section");
    root.className = cn;
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", ariaLabel);

    return root;
}


