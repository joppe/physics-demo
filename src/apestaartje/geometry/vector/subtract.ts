import { Vector } from './Vector';

/**
 * Subtract two vectors
 */

export function subtract(a: Vector, b: Vector): Vector {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    };
}
