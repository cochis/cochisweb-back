// Sanitización ligera para inputs de texto (evitar payloads absurdos)
export function clampText(input: string, maxLen: number): string {
    const v = (input ?? "").toString().trim();
    return v.length > maxLen ? v.slice(0, maxLen) : v;
}