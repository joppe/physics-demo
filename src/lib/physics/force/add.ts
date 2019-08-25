import * as geometry from '@apestaartje/geometry';

import { zero } from './zero';

/**
 * Add multiple vector forces
 */

export function add(...forces: geometry.vector.Vector[]): geometry.vector.Vector {
    return forces.reduce(
        (sum: geometry.vector.Vector, force: geometry.vector.Vector): geometry.vector.Vector => {
            return geometry.vector.add(sum, force);
        },
        zero(),
    );
}
