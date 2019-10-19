/**
 * Removes the first element of an array
 */

export function tail<T>(arr: T[]): T[] {
    if (arr.length === 0) {
        throw new Error('Empty array can not get tail');
    }

    return arr.slice(1);
}
