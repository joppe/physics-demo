import * as arr from '@apestaartje/array';
import * as geometry from '@apestaartje/geometry';

import { Canvas } from 'app/dom/element/Canvas';
import { line } from 'app/graph/line/line';
import { Style as LineStyle } from 'app/graph/line/Style';
import { Range } from 'app/graph/range/Range';
import { Style as TextStyle } from 'app/graph/text/Style';
import { text } from 'app/graph/text/text';

const OFFSET: number = 30;

const DEFAULT_LINE_STYLE: LineStyle = {
    strokeStyle: '#000000',
    lineWidth: 1
};

const DEFAULT_TEXT_STYLE: TextStyle = {
    font: '10pt Arial',
    fillStyle: '#000000',
    textAlign: 'left'
};

/**
 * Graph class
 */

export class Graph {
    private _background: Canvas;
    private _foreground: Canvas;
    private _size: geometry.size.Size;
    private _transform: geometry.transform.Transform;

    private _xRange: Range = {
        min: 0,
        max: 0
    };
    private _yRange: Range = {
        min: 0,
        max: 0
    };

    public set xRange(range: Range) {
        this._xRange = range;

        this.updateTransform();
    }

    public set yRange(range: Range) {
        this._yRange = range;

        this.updateTransform();
    }

    constructor(size: geometry.size.Size) {
        this._size = size;

        this._transform = new geometry.transform.Transform();
        this._background = new Canvas(size, 'c-graph__layer');
        this._foreground = new Canvas(size, 'c-graph__layer');

        this.xRange = {
            min: 0,
            max: this._size.width
        };
        this.yRange = {
            min: 0,
            max: this._size.height
        };
    }

    public render(element: HTMLElement): void {
        const wrapper: HTMLDivElement = document.createElement('div');

        wrapper.classList.add('c-graph');
        wrapper.style.width = `${this._size.width}px`;
        wrapper.style.height = `${this._size.height}px`;

        this._background.appendTo(wrapper);
        this._foreground.appendTo(wrapper);

        element.appendChild(wrapper);
    }

    public plot(points: Iterable<geometry.point.Point>, lineStyle: Partial<LineStyle> = {}): Graph {
        let previous: geometry.point.Point;

        const styling: LineStyle = {
            lineWidth: 1,
            strokeStyle: '#308c2c',
            ...lineStyle
        };

        for (const point of points) {
            if (previous !== undefined) {
                line(
                    this._transform.transformPoint(previous),
                    this._transform.transformPoint(point),
                    styling,
                    this._foreground.context
                );
            }

            previous = point;
        }

        return this;
    }

    public drawXLabels(step: number, textStyle: Partial<TextStyle> = {}): Graph {
        const styling: TextStyle = {
            ...DEFAULT_TEXT_STYLE,
            ...textStyle
        };
        let y: number = 0;

        if (this._yRange.min > 0 || this._yRange.max < 0) {
            y = this._yRange.min;
        }

        for (const x of arr.iterator.range(this._xRange.min, this._xRange.max, step)) {
            const position: geometry.point.Point = this._transform.transformPoint({x, y});

            text(
                String(x),
                { x: position.x - 5, y: position.y + 15 },
                styling,
                this._background.context
            );
        }

        return this;
    }

    public drawYLabels(step: number, textStyle: Partial<TextStyle> = {}): Graph {
        const styling: TextStyle = {
            ...DEFAULT_TEXT_STYLE,
            ...textStyle
        };
        let x: number = 0;

        if (this._xRange.min > 0 || this._xRange.max < 0) {
            x = this._xRange.min;
        }

        for (const y of arr.iterator.range(this._yRange.min, this._yRange.max, step)) {
            const point: geometry.point.Point = this._transform.transformPoint({x, y});

            text(
                String(y),
                { x: point.x - 30, y: point.y + 5 },
                styling,
                this._background.context
            );
        }

        return this;
    }

    public drawGrid(xStep: number, yStep: number, lineStyle: Partial<LineStyle> = {}): Graph {
        const styling: LineStyle = {
            lineWidth: 1,
            strokeStyle: '#88abcf',
            ...lineStyle
        };

        for (const x of arr.iterator.range(this._xRange.min, this._xRange.max, xStep)) {
            line(
                this._transform.transformPoint({ x, y: this._yRange.min }),
                this._transform.transformPoint({ x, y: this._yRange.max }),
                styling,
                this._background.context
            );
        }

        for (const y of arr.iterator.range(this._yRange.min, this._yRange.max, yStep)) {
            line(
                this._transform.transformPoint({ x: this._xRange.min, y }),
                this._transform.transformPoint({ x: this._xRange.max, y }),
                styling,
                this._background.context
            );
        }

        return this;
    }

    public drawXAxis(lineStyle: Partial<LineStyle> = {}): Graph {
        const styling: LineStyle = {
            strokeStyle: '#FF0000',
            lineWidth: 2,
            ...lineStyle
        };
        let y: number = 0;

        if (this._yRange.min > 0 || this._yRange.max < 0) {
            y = this._yRange.min;
        }

        line(
            this._transform.transformPoint({ x: this._xRange.min, y }),
            this._transform.transformPoint({ x: this._xRange.max, y }),
            styling,
            this._background.context
        );

        return this;
    }

    public drawYAxis(lineStyle: Partial<LineStyle> = {}): Graph {
        const styling: LineStyle = {
            strokeStyle: '#FF0000',
            lineWidth: 2,
            ...lineStyle
        };
        let x: number = 0;

        if (this._xRange.min > 0 || this._xRange.max < 0) {
            x = this._xRange.min;
        }

        line(
            this._transform.transformPoint({ x, y: this._yRange.min }),
            this._transform.transformPoint({ x, y: this._yRange.max }),
            styling,
            this._background.context
        );

        return this;
    }

    private updateTransform(): void {
        this._transform.identity();

        // Flip the y-axis
        this._transform.scale(1, -1);

        // Set the origin to the bottom
        this._transform.translate(0, -this._size.height);

        // Apply the offset, x will go to the right and y will go up (because of the -1 scale)
        this._transform.translate(OFFSET, OFFSET);

        // Apply the scale
        this._transform.scale(
            (this._size.width - OFFSET * 2) / (this._xRange.max - this._xRange.min),
            (this._size.height - OFFSET * 2) / (this._yRange.max - this._yRange.min)
        );

        // Set the bottom left corner equal to the minimum values of axises, use negative y because of the -1 scale
        this._transform.translate(-this._xRange.min, -this._yRange.min);
    }
}
