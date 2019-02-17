import * as geometry from '@apestaartje/geometry';

export function velocity(current: geometry.vector.Vector, acceleration: geometry.vector.Vector, dt: number): geometry.vector.Vector {
    return geometry.vector.add(
        current,
        geometry.vector.scale(acceleration, dt)
    );
}
