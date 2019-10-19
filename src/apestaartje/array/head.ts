/**
 * Return the first element of an array
 */

export function head<T>(arr: T[]): T {
    if (arr.length === 0) {
        throw new Error('Empty array can not get head');
    }

    return arr[0];
}
