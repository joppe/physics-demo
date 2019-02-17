import * as animation from '@apestaartje/animation';
import * as physics from '@apestaartje/physics';
import { circle } from 'app/draw/circle';

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
        circle(
            context,
            {
                position: this.position,
                color: this._color,
                radius: this._radius,
                empty: false
            }
        );
    }

    public cleanup(): boolean {
        return false;
    }
}
