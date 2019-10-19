import { Point } from './Point';

/**
 * Clone an Point object
 */

export function clone(point: Point): Point {
    return {
        x: point.x,
        y: point.y,
    };
}
