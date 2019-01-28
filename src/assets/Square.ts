import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';

/**
 * A Square
 */
export class Square implements animation.stage.IAsset {
    private readonly _color: string;
    private readonly _size: geometry.square.Square;

    constructor(size: geometry.square.Square, color: string) {
        this._size = size;
        this._color = color;
    }

    public render(context: CanvasRenderingContext2D): void {
        context.fillStyle = this._color;
        context.fillRect(
            this._size.topLeft.x,
            this._size.topLeft.y,
            this._size.bottomRight.x - this._size.topLeft.x,
            this._size.bottomRight.y - this._size.topLeft.y
        );
    }

    public cleanup(): boolean {
        return false;
    }
}
