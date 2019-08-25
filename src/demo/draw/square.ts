import * as geometry from '@apestaartje/geometry';

export interface SquareOptions {
    position: geometry.point.Point;
    size: geometry.size.Size;
    color: string;
    empty?: boolean;
}

/**
 * Draw a Square
 */
export function square(context: CanvasRenderingContext2D, options: SquareOptions): void {
    if (options.empty === true) {
        context.strokeStyle = options.color;
        context.strokeRect(
            options.position.x,
            options.position.y,
            options.size.width,
            options.size.height,
        );
    } else {
        context.fillStyle = options.color;
        context.fillRect(
            options.position.x,
            options.position.y,
            options.size.width,
            options.size.height,
        );
    }
}
