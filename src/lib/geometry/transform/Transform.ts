import { Point } from '../point/Point';
import { TransformOptions } from './TransformOptions';

/**
 * Object to handle transformation
 */

export class Transform {
    private _scaleX: number;
    private _scaleY: number;
    private _skewX: number;
    private _skewY: number;
    private _translateX: number;
    private _translateY: number;

    get scaleX(): number {
        return this._scaleX;
    }

    get scaleY(): number {
        return this._scaleY;
    }

    get skewX(): number {
        return this._skewX;
    }

    get skewY(): number {
        return this._skewY;
    }

    get translateX(): number {
        return this._translateX;
    }

    get translateY(): number {
        return this._translateY;
    }

    constructor() {
        this.identity();
    }

    public identity(): Transform {
        this._scaleX = 1;
        this._scaleY = 1;
        this._skewX = 0;
        this._skewY = 0;
        this._translateX = 0;
        this._translateY = 0;

        return this;
    }

    public transform(options: TransformOptions): void {
        const scaleX: number = this._scaleX;
        const scaleY: number = this._scaleY;
        const skewX: number = this._skewX;
        const skewY: number = this._skewY;
        const translateX: number = this._translateX;
        const translateY: number = this._translateY;

        this._scaleX = scaleX * options.scaleX + skewX * options.skewY;
        this._scaleY = scaleY * options.scaleY + skewY * options.skewX;
        this._skewX = scaleX * options.skewX + skewX * options.scaleY;
        this._skewY = skewY * options.scaleX + scaleY * options.skewY;
        this._translateX = scaleX * options.translateX + skewX * options.translateY + translateX;
        this._translateY = scaleY * options.translateY + skewY * options.translateX + translateY;
    }

    public rotate(radians: number): Transform {
        const cos: number = Math.cos(radians);
        const sin: number = Math.sin(radians);

        this.transform({
            scaleX: cos,
            skewX: -sin,
            translateX: 0,
            scaleY: cos,
            skewY: sin,
            translateY: 0,
        });

        return this;
    }

    public scale(x: number, y: number): Transform {
        this.transform({
            scaleX: x,
            skewX: 0,
            translateX: 0,
            scaleY: y,
            skewY: 0,
            translateY: 0,
        });

        return this;
    }

    public skew(x: number, y: number): Transform {
        this.transform({
            scaleX: 1,
            skewX: x,
            translateX: 0,
            scaleY: 1,
            skewY: y,
            translateY: 0,
        });

        return this;
    }

    public translate(x: number, y: number): Transform {
        this.transform({
            scaleX: 1,
            skewX: 0,
            translateX: x,
            scaleY: 1,
            skewY: 0,
            translateY: y,
        });

        return this;
    }

    public transformPoint(point: Point): Point {
        return {
            x: point.x * this._scaleX + point.y * this._skewX + this._translateX,
            y: point.y * this._scaleY + point.x * this._skewY + this._translateY,
        };
    }
}
