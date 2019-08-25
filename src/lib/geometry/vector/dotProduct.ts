import { Vector } from './Vector';

/**
 * Multiply a vectors with a value
 */

export function dotProduct(a: Vector, b: Vector): number {
    return a.x * b.x + a.y * b.y;
}
