export class Animator {
    private _id: number;
    private _wrapper: (time: number) => void;

    constructor(animation: Function) {
        this._wrapper = (time: number): void => {
            if (animation()) {
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
