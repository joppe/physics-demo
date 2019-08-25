import * as geometry from '@apestaartje/geometry';

import { zero } from '../zero';

export function damping(c: number, velocity: geometry.vector.Vector): geometry.vector.Vector {
    const length: number = geometry.vector.length(velocity);

    if (length > 0) {
        return geometry.vector.scale(velocity, -c);
    }

    return zero();
}
