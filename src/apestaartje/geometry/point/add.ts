import { Point } from './Point';

/**
 * Add two points and return the result in a new Point
 */

export function add(a: Point, b: Point): Point {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}
