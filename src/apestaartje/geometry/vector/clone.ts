import { Vector } from './Vector';

/**
 * Clone a Vector object
 */

export function clone(vector: Vector): Vector {
    return {
        x: vector.x,
        y: vector.y,
    };
}
