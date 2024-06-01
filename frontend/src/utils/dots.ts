export default function generateDots(count: number): string {
    // Ensure the count is non-negative
    if (count < 0) {
        throw new Error("Count must be a non-negative number.");
    }

    return '●'.repeat(count);
}
