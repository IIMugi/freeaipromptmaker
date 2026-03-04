/**
 * Input sanitization utility
 * Prevents XSS and injection attacks in user inputs
 */

/**
 * Sanitize user text input by encoding HTML entities.
 * React already escapes JSX output, but this is a defense-in-depth measure
 * for cases where text is used in non-JSX contexts (clipboard, API calls, etc.)
 */
export function sanitizeInput(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Strip potentially dangerous patterns from prompt text
 * Used before sending to APIs or persisting
 */
export function sanitizePrompt(text: string): string {
    return text
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
}
