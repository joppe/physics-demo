import { Angle } from './Angle';

/**
 * Clone an Angel object
 */

export function clone(angle: Angle): Angle {
    return {
        radians: angle.radians,
    };
}
