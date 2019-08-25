import { Vector } from './Vector';

/**
 * Create a vector from a given length and angle
 */

export function factory(radians: number, length: number): Vector {
    return {
        x: Math.cos(radians) * length,
        y: Math.sin(radians) * length,
    };
}
