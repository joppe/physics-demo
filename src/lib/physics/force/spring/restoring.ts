import * as geometry from '@apestaartje/geometry';

export function restoring(k: number, distance: geometry.vector.Vector): geometry.vector.Vector {
    return geometry.vector.scale(distance, -k);
}
