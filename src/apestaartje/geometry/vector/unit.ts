import { length } from './length';
import { scale } from './scale';
import { Vector } from './Vector';

/**
 * Create a unit vector, the same angle and length 1
 */

export function unit(a: Vector): Vector {
    const len: number = length(a);

    if (len === 0) {
        throw new Error('Could not create unit vector because length is 0');
    }

    return scale(a, 1 / len);
}
