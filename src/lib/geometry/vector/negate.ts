import { scale } from './scale';
import { Vector } from './Vector';

/**
 * Let the vector point in opposite direction
 */

export function negate(a: Vector): Vector {
    return scale(a, -1);
}
