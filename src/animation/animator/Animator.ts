import { Animatable } from 'app/animation/animator/Animatable';
import { Time } from 'app/animation/animator/Time';

/**
 * This animator uses the RAF of the browser
 */

export class Animator {
    private _id: number;
    private _time: Time;
    private readonly _wrapper: (time: number) => void;

    constructor(animation: Animatable) {
        this._wrapper = (time: number): void => {
            if (this._time === undefined) {
                this._time = {
                    start: time,
                    offset: 0,
                    current: time,
                    elapsed: 0
                };
            } else {
                this._time.offset = time - this._time.current;
                this._time.current = time;
                this._time.elapsed = time - this._time.start;
            }

            if (animation(this._time)) {
                this._id = window.requestAnimationFrame(this._wrapper);
            }
        };
    }

    public isPlaying(): boolean {
        return this._id !== undefined;
    }

    public start(): void {
        this._id = window.requestAnimationFrame(this._wrapper);
    }

    public stop(): void {
        window.cancelAnimationFrame(this._id);
    }
}
