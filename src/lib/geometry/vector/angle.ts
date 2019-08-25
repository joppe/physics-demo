import { dotProduct } from './dotProduct';
import { length } from './length';
import { Vector } from './Vector';

/**
 * Calculate the angle of a vector or between two vectors
 */

export function angle(a: Vector, b?: Vector): number {
    if (b === undefined) {
        return Math.atan2(a.y, a.x);
    }

    return Math.acos((dotProduct(a, b)) / (length(a) * length(b)));
}
