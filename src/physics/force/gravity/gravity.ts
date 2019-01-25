import * as geometry from '@apestaartje/geometry';

export const GRAVITATIONAL_CONSTANT: number = 6.67e-11;

/**
 * Create a gravity vector
 */

export function force(m1: number, m2: number, distance: number, G: number = GRAVITATIONAL_CONSTANT): number {
    return (G * m1 * m2) / (length * length);
}

export function gravity(m1: number, m2: number, v: geometry.vector.Vector, G: number = GRAVITATIONAL_CONSTANT): geometry.vector.Vector {
    const distance: number = geometry.vector.length(v);

    return geometry.vector.scale(
        v,
        -force(m1, m2, distance, G) / distance
    );
}
