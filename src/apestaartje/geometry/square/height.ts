import { Square } from './Square';

/**
 * Calculate the height of a square
 */
export function height(square: Square): number {
    return Math.abs(square.bottomRight.y - square.topLeft.y);
}
