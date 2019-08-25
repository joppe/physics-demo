import { Animatable } from './Animatable';
import { Chronometer } from './Chronometer';

/**
 * This animator uses the RAF of the browser
 */

interface AnimatableWrapper {
    (time: number): void;
}

export class Animator {
    private readonly _chronometer: Chronometer = {
        start: 0,
        offset: 0,
        current: 0,
        elapsed: 0,
    };
    private _id: number;
    private _isPlaying: boolean = false;
    private readonly _wrapper: AnimatableWrapper;

    constructor(animation: Animatable) {
        this._wrapper = (time: number): void => {
            if (this._chronometer.start === 0) {
                this._chronometer.start = time;
            }

            this._chronometer.offset = time - this._chronometer.current;
            this._chronometer.current = time;
            this._chronometer.elapsed = time - this._chronometer.start;

            if (animation(this._chronometer)) {
                this._id = window.requestAnimationFrame(this._wrapper);
            }
        };
    }

    public isPlaying(): boolean {
        return this._isPlaying;
    }

    public start(): void {
        if (this._isPlaying) {
            throw new Error('Animation already playing');
        }

        this._chronometer.start = 0;
        this._id = window.requestAnimationFrame(this._wrapper);
        this._isPlaying = true;
    }

    public stop(): void {
        if (!this._isPlaying) {
            throw new Error('Animation already stopped');
        }

        window.cancelAnimationFrame(this._id);
        this._isPlaying = false;
    }
}
