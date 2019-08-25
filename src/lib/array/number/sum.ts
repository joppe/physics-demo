/**
 * Add the values of an array
 */

export function sum(arr: number[]): number {
    return arr.reduce(
        (total: number, el: number): number => {
            return total + el;
        },
        0,
    );
}
