/**
 * Take the first number of elements of a list
 */

export function take<T>(count: number, arr: T[]): T[] {
    return arr.slice(0, count);
}
