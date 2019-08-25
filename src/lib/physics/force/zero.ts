import * as geometry from '@apestaartje/geometry';

/**
 * Create a vector with zero length
 */

export function zero(): geometry.vector.Vector {
    return {
        x: 0,
        y: 0,
    };
}
