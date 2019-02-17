import * as geometry from '@apestaartje/geometry';

export function position(current: geometry.vector.Vector, velocity: geometry.vector.Vector, dt: number): geometry.vector.Vector {
    return geometry.vector.add(
        current,
        geometry.vector.scale(velocity, dt)
    );
}
