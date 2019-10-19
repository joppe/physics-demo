import * as geometry from '@apestaartje/geometry';

export function thrust(velocity: geometry.vector.Vector, dm: number, dt: number): geometry.vector.Vector {
    return geometry.vector.scale(
        velocity,
        -dm / dt,
    );
}
