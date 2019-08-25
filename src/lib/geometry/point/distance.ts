import { Point } from './Point';

/**
 * Calculate the distance between two points
 */

export function distance(a: Point, b: Point): number {
    const dx: number = b.x - a.x;
    const dy: number = b.y - a.y;

    return Math.sqrt(dx * dx + dy * dy);
}
