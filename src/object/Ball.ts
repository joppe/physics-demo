import * as animation from '@apestaartje/animation';
import * as physics from '@apestaartje/physics';

/**
 * A Ball
 */

export class Ball extends physics.object.Particle implements animation.stage.Asset {
    private readonly _color: string;
    private readonly _radius: number;

    constructor(radius: number, color: string, mass: number = 1, charge: number = 0) {
        super(mass, charge);

        this._radius = radius;
        this._color = color;
    }

    public render(context: CanvasRenderingContext2D): void {
        context.fillStyle = this._color;
        context.beginPath();
        context.arc(
            this.position.x,
            this.position.y,
            this._radius,
            0,
            Math.PI * 2,
            true
        );
        context.closePath();
        context.fill();
    }

    public cleanup(): boolean {
        return false;
    }
}
