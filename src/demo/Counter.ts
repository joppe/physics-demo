import * as geometry from '@apestaartje/geometry';

import { FPS } from 'app/animation/fps/FPS';
import { IAsset } from 'app/animation/stage/IAsset';

export class Counter implements IAsset {
    private _color: string;
    private _fps: FPS;
    private _font: string;
    private _position: geometry.point.Point;

    constructor(position: geometry.point.Point, font: string, color: string) {
        this._position = position;
        this._font = font;
        this._color = color;

        this._fps = new FPS();
    }

    public render(context: CanvasRenderingContext2D): void {
        this._fps.tick();

        context.fillStyle = this._color;
        context.font = this._font;
        context.fillText(
            String(this._fps.count()),
            this._position.x,
            this._position.y
        );
    }

    public cleanup(): boolean {
        return false;
    }
}
