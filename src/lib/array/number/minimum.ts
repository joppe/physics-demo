/**
 * Return the minimum value of a given array of numbers
 */

export function minimum(arr: number[]): number {
    if (arr.length === 0) {
        throw new Error('Minimun could not be calculated from an empty array');
    }

    return Math.min(...arr);
}
