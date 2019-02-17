import * as geometry from '@apestaartje/geometry';

export function acceleration(force: geometry.vector.Vector, mass: number): geometry.vector.Vector {
    return geometry.vector.scale(force, 1 / mass);
}
