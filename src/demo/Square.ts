import * as geometry from '@apestaartje/geometry';

import { IAsset } from 'app/animation/stage/IAsset';

export class Square implements IAsset {
    private _color: string;
    private _size: geometry.square.Square;

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
