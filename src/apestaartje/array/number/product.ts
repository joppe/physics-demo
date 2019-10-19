/**
 * Calculate the product of all the items of an array
 */

export function product(arr: number[]): number {
    return arr.reduce(
        (total: number, el: number): number => {
            return total * el;
        },
        1,
    );
}
