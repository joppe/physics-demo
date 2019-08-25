/**
 * Generate a random float
 * 0 <= value <= 1
 */

export function rand(): number {
    const byteArray: Uint32Array = new Uint32Array(1);

    window.crypto.getRandomValues(byteArray);

    // 0 <= value <= max
    const value: number =  byteArray[0];
    const max: number = Math.pow(2, 32) - 1;

    return value / max;
}
