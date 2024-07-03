export function generateDots(count: number): string {
    // Ensure the count is non-negative
    if (count < 0) {
        throw new Error("Count must be a non-negative number.");
    }

    return '●'.repeat(count);
}


export function levelsDisplay(levels: number[]) {
    if (levels.length > 1) {
        const dots1 = generateDots(levels[0]);
        const dots2 = generateDots(levels[levels.length-1]);
        return `(${dots1} to ${dots2})`;
    } else if (levels.length === 1) {
        const dots1 = generateDots(levels[0]);
        return `(${dots1})`;
    } else {
        return "";
    }
}