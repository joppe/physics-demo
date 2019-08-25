import { random as randomNumber } from '@apestaartje/number';

/**
 * Pick a random element from an array
 */

export function random<T>(arr: T[]): T {
    return arr[randomNumber(0, arr.length - 1)];
}
