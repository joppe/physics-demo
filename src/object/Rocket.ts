import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';

import { triangle } from 'app/draw/triangle';

/**
 * A Rocket
 */

export class Rocket extends physics.object.Particle implements animation.stage.Asset {
    private readonly _color: string;
    private readonly _isFiring: boolean;
    private readonly _size: geometry.size.Size;

    constructor(size: geometry.size.Size, color: string, mass: number = 1, charge: number = 0) {
        super(mass, charge);

        this._size = size;
        this._color = color;
    }

    public render(context: CanvasRenderingContext2D): void {
        if (this._isFiring) {
            triangle(
                context,
                {
                    position: { x: this.position.x, y: this.position.y + this._size.height * 0.5 },
                    color: '#ffff00',
                    size: this._size,
                    empty: false
                }
            );
        }

        triangle(
            context,
            {
                position: this.position,
                color: this._color,
                size: this._size,
                empty: false
            }
        );
    }

    public cleanup(): boolean {
        return false;
    }
}
