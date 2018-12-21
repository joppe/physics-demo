import * as geometry from '@apestaartje/geometry';

/**
 * Canvas helper class
 */

export class Canvas {
    private _size: geometry.size.Size;

    private _el: HTMLCanvasElement;

    get context(): CanvasRenderingContext2D {
        return this._el.getContext('2d');
    }

    get width(): number {
        return this._size.width;
    }

    get height(): number {
        return this._size.height;
    }

    constructor(size: geometry.size.Size, className?: string) {
        this._size = size;

        this._el = document.createElement('canvas');
        this._el.setAttribute('width', String(this._size.width));
        this._el.setAttribute('height', String(this._size.height));

        if (className !== undefined) {
            this._el.classList.add(className);
        }
    }

    /**
     * Append the canvas element to a given element
     */
    public appendTo(target: HTMLElement): Canvas {
        target.appendChild(this._el);

        return this;
    }

    /**
     * Clear the canvas
     */
    public clear(area: geometry.square.Square = {topLeft: {x: 0, y: 0}, bottomRight: {x: this.width, y: this.height}}): Canvas {
        this.context.clearRect(area.topLeft.x, area.topLeft.y, geometry.square.width(area), geometry.square.height(area));

        return this;
    }
}
