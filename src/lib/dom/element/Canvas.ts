import * as geometry from '@apestaartje/geometry';

/**
 * Canvas helper class
 */

export class Canvas {
    private readonly _el: HTMLCanvasElement;

    /**
     * Getters
     */

    get classList(): DOMTokenList {
        return this._el.classList;
    }

    get context(): CanvasRenderingContext2D {
        return <CanvasRenderingContext2D>this._el.getContext('2d');
    }

    get size(): geometry.size.Size {
        return {
            width: this.getDimension('width'),
            height: this.getDimension('height'),
        };
    }

    set size(size: geometry.size.Size) {
        this._el.setAttribute('width', `${size.width}px`);
        this._el.setAttribute('height', `${size.height}px`);
    }

    get style(): CSSStyleDeclaration {
        return this._el.style;
    }

    constructor(size: geometry.size.Size) {
        this._el = document.createElement('canvas');

        this.size = size;
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
    public clear(area: geometry.square.Square = {topLeft: {x: 0, y: 0}, bottomRight: {x: this.size.width, y: this.size.height}}): Canvas {
        this.context.clearRect(area.topLeft.x, area.topLeft.y, geometry.square.width(area), geometry.square.height(area));

        return this;
    }

    private getDimension(dimension: 'width' | 'height'): number {
        const value: string | null = this._el.getAttribute(dimension);

        if (value === null) {
            return 0;
        }

        return parseInt(value, 10);
    }
}
