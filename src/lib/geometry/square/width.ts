import { Square } from './Square';

/**
 * Calculate the width of a square
 */
export function width(square: Square): number {
    return Math.abs(square.bottomRight.x - square.topLeft.x);
}
