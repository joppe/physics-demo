/**
 * Return the maximum value of a given array of numbers
 */

export function maximum(arr: number[]): number {
    if (arr.length === 0) {
        throw new Error('Maximum could not be calculated from an empty array');
    }

    return Math.max(...arr);
}
