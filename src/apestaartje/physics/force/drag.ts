import * as geometry from '@apestaartje/geometry';

import { zero } from './zero';

/**
 * Apply drag on a velocity vector
 */

export function drag(k: number, velocity: geometry.vector.Vector): geometry.vector.Vector {
    if (geometry.vector.length(velocity) === 0) {
        return zero();
    }

    return geometry.vector.scale(velocity, -k);
}
