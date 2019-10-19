/**
 * Reverse an array without modifying the original
 */

export function reverse<T>(arr: T[]): T[] {
    if (arr.length === 0) {
        return arr;
    }

    return arr.reduce(
        (acc: T[], el: T): T[] => {
            return [el].concat(acc);
        },
        [],
    );
}
