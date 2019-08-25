import { rand } from './rand';

/**
 * Generate a random integer
 * min <= value <= max
 */

export function random(min: number, max: number): number {
    const diff: number = max - min;

    if (diff < 0) {
        throw new Error(`Diff between max (${max}) and min (${min}) must be larger or equal than 0 (${diff})`);
    }

    return min + Math.round(rand() * diff);
}
