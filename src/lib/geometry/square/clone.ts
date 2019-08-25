import { Square } from './Square';

/**
 * Clone a Square Object
 */

export function clone(square: Square): Square {
    return {
        bottomRight: {
            x: square.bottomRight.x,
            y: square.bottomRight.y,
        },
        topLeft: {
            x: square.topLeft.x,
            y: square.topLeft.y,
        },
    };
}
