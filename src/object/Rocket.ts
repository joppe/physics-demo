import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';

import { triangle } from 'app/draw/triangle';

/**
 * A Rocket
 */

export type RocketOptions = {
    size: geometry.size.Size;
    color: string;
    mass: number;
    thruster: {
        main: {
            mass: number;
            dm: number;
            v: geometry.vector.Vector;
        };
        side: {
            mass: number;
            dm: number;
            v: geometry.vector.Vector;
        };
    };
};

type Thruster = {
    start(orientation: ThrusterOrientation): void;
    stop(): void;
    isActive(): boolean;
    force(dt: number): geometry.vector.Vector;
    mass(): number;
};

// `v` is the exhaust velocity
function thruster(v: geometry.vector.Vector, mass: number, dm: number): Thruster {
    let massUsed: number = 0;
    let isActive: boolean = false;
    let orientation: ThrusterOrientation = 1;

    return {
        start(o: ThrusterOrientation): void {
            orientation = o;
            isActive = true;
        },
        stop(): void {
            isActive = false;
        },
        isActive(): boolean {
            return isActive && mass > massUsed;
        },
        force(dt: number): geometry.vector.Vector {
            if (!isActive || mass <= massUsed) {
                return physics.force.zero();
            }

            massUsed += dt * dm;

            return physics.force.thrust(v, orientation * dm, dt);
        },
        mass(): number {
            return mass - massUsed;
        }
    };
}

type ThrusterName = 'main' | 'side';
type ThrusterOrientation =  1 | -1;

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
            side: thruster(options.thruster.side.v, options.thruster.side.mass, options.thruster.side.dm)
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

    public startThrust(name: ThrusterName, orientation: ThrusterOrientation): void {
        this._thruster[name].start(orientation);
    }

    public stopThrust(name: ThrusterName): void {
        this._thruster[name].stop();
    }

    public force(dt: number): geometry.vector.Vector {
        return physics.force.add(
            this._thruster.main.force(dt),
            this._thruster.side.force(dt)
        );
    }

    public cleanup(): boolean {
        return false;
    }
}
