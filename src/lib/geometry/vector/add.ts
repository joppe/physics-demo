import { Vector } from './Vector';

/**
 * Add two vectors
 */

export function add(a: Vector, b: Vector): Vector {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}
