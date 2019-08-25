import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';

import { triangle } from '@demo/draw/triangle';
import { RocketOptions } from '@demo/object/rocket/RocketOptions';
import { factory as thruster } from '@demo/object/rocket/thruster/factory';
import { Thruster } from '@demo/object/rocket/thruster/Thruster';
import { ThrusterName } from '@demo/object/rocket/thruster/ThrusterName';
import { ThrusterOrientation } from '@demo/object/rocket/thruster/ThrusterOrientation';

export class Rocket extends physics.object.Particle implements animation.stage.Asset {
    private readonly _color: string;
    private readonly _size: geometry.size.Size;
    private readonly _thruster: { [K in ThrusterName]: Thruster };

    get mass(): number {
        return this._mass + this._thruster.main.mass() + this._thruster.side.mass();
    }

    constructor(options: RocketOptions) {
        super(options.mass, 0);

        this._size = options.size;
        this._color = options.color;
        this._thruster = {
            main: thruster(options.thruster.main.v, options.thruster.main.mass, options.thruster.main.dm),
            side: thruster(options.thruster.side.v, options.thruster.side.mass, options.thruster.side.dm),
        };
    }

    public render(context: CanvasRenderingContext2D): void {
        if (this._thruster.main.isActive()) {
            triangle(
                context,
                {
                    position: { x: this.position.x, y: this.position.y + this._size.height * 0.5 },
                    color: '#ffff00',
                    size: this._size,
                    empty: false,
                },
            );
        }

        triangle(
            context,
            {
                position: this.position,
                color: this._color,
                size: this._size,
                empty: false,
            },
        );
    }

    public startThrust(name: ThrusterName, orientation: ThrusterOrientation): void {
        this._thruster[name].start(orientation);
    }

    public stopThrust(name: ThrusterName): void {
        this._thruster[name].stop();
    }

    public force(dt: number): geometry.vector.Vector {
        return physics.force.add(
            this._thruster.main.force(dt),
            this._thruster.side.force(dt),
        );
    }

    public cleanup(): boolean {
        return false;
    }
}
