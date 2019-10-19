import { length } from './length';
import { subtract } from './subtract';
import { Vector } from './Vector';

/**
 * Calculate the distance between two vectors
 */

export function distance(a: Vector, b: Vector): number {
    return length(subtract(a, b));
}
