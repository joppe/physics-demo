/**
 * This class calculates the number of frames thar are rendered per second.
 *
 * @see https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html
 */
export class FPS {
    private _frames: Array<number> = [];

    public count(): number {
        const now: number = this.now();
        const from: number = now - 1000;

        while (
            this._frames.length > 0 &&
            this._frames[0] < from
        ) {
            this._frames.shift();
        }

        return this._frames.length;
    }

    /**
     * Call this function to indicate that a new frame is rendered.
     */
    public tick(): void {
        this._frames.push(this.now());
    }

    private now(): number {
        return window.performance.now();
    }
}
