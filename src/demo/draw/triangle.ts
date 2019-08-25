import * as geometry from '@apestaartje/geometry';

export interface TriangleOptions {
    position: geometry.point.Point;
    size: geometry.size.Size;
    color: string;
    empty?: boolean;
}

/**
 * Draw a Triangle
 */
export function triangle(context: CanvasRenderingContext2D, options: TriangleOptions): void {
    if (options.empty === true) {
        context.strokeStyle = options.color;
    } else {
        context.fillStyle = options.color;
    }

    context.beginPath();
    context.moveTo(options.position.x, options.position.y);
    context.lineTo(options.position.x + options.size.width, options.position.y);
    context.lineTo(options.position.x + (options.size.width / 2), options.position.y - options.size.height);
    context.lineTo(options.position.x, options.position.y);
    context.closePath();

    if (options.empty === true) {
        context.stroke();
    } else {
        context.fill();
    }
}
