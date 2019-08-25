import { clone as clonePoint } from '../point/clone';
import { Line } from './Line';

/**
 * Clone an Line object
 */

export function clone(line: Line): Line {
    return {
        start: clonePoint(line.start),
        end: clonePoint(line.end),
    };
}
