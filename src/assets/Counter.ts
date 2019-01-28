import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';

/**
 * A FPS counter
 */

export class Counter implements animation.stage.IAsset {
    private readonly _color: string;
    private readonly _fps: animation.fps.FPS;
    private readonly _font: string;
    private readonly _position: geometry.point.Point;

    constructor(position: geometry.point.Point, font: string, color: string) {
        this._position = position;
        this._font = font;
        this._color = color;

        this._fps = new animation.fps.FPS();
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
