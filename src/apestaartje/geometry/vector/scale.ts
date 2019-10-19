import { Vector } from './Vector';

/**
 * Scale a vector
 */

export function scale(a: Vector, k: number): Vector {
    return {
        x: a.x * k,
        y: a.y * k,
    };
}
