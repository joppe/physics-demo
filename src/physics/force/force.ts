import * as geometry from '@apestaartje/geometry';

/**
 * Create a force vector
 */

export function force(radians: number, mass: number, acceleration: number): geometry.vector.Vector {
    return geometry.vector.factory(radians, mass * acceleration);
}
