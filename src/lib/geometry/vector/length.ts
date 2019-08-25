import { Vector } from './Vector';

/**
 * Calculate the length of a vector
 */

export function length(a: Vector): number {
    return Math.sqrt(a.x * a.x + a.y * a.y);
}
