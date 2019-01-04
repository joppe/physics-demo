import * as geometry from '@apestaartje/geometry';

import { X_AXIS, Y_AXIS } from 'app/graph/graph/Axis';
import { Coordinate } from 'app/graph/graph/Coordinate';

export function coordinatesToPoint(a: Coordinate, b: Coordinate): geometry.point.Point {
    if (a.axis === b.axis) {
        throw new Error(`Coordinates are from the same axis "${a.axis}"`);
    }

    return {
        x: a.axis === X_AXIS ? a.value : b.value,
        y: a.axis === Y_AXIS ? a.value : b.value
    };
}
