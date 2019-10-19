/**
 * Returns a range iterator.
 */

export function* range(min: number, max: number, step: number): IterableIterator<number> {
    let value: number = min;

    while (value <= max) {
        yield value;

        value += step;
    }
}
