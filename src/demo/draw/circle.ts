import * as geometry from '@apestaartje/geometry';

export interface CircleOptions {
    position: geometry.point.Point;
    radius: number;
    color: string;
    empty?: boolean;
}

/**
 * Draw a circle
 */
export function circle(context: CanvasRenderingContext2D, options: CircleOptions): void {
    if (options.empty === true) {
        context.strokeStyle = options.color;
    } else {
        context.fillStyle = options.color;
    }

    context.beginPath();
    context.arc(
        options.position.x,
        options.position.y,
        options.radius,
        0,
        Math.PI * 2,
        true,
    );
    context.closePath();

    if (options.empty === true) {
        context.stroke();
    } else {
        context.fill();
    }
}
