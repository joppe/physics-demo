import { LineOptions } from '@nervous-matrix/render/LIneOptions';

const DEFAULT_COLOR: string = '#ff0000';

export function line(options: LineOptions, context: CanvasRenderingContext2D): void {
    context.strokeStyle = options.color !== undefined ? options.color : DEFAULT_COLOR;
    context.beginPath();
    context.moveTo(options.start.x, options.start.y);
    context.lineTo(options.end.x, options.end.y);
    context.closePath();
    context.stroke();
}
