/**
 * Removes the last element of an array
 */

export function init<T>(arr: T[]): T[] {
    if (arr.length === 0) {
        throw new Error('Empty array can not get init');
    }

    return arr.slice(0, arr.length - 1);
}
