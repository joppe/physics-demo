import * as geometry from '@apestaartje/geometry';

import { zero } from '../force/zero';

/**
 * A basic particle that can be used in calculations
 */

export class Particle {
    protected _charge: number;
    protected _mass: number;
    protected _position: geometry.vector.Vector;
    protected _velocity: geometry.vector.Vector;

    get position(): geometry.vector.Vector {
        return this._position;
    }

    set position(position: geometry.vector.Vector) {
        this._position = position;
    }

    get velocity(): geometry.vector.Vector {
        return this._velocity;
    }

    set velocity(velocity: geometry.vector.Vector) {
        this._velocity = velocity;
    }

    get mass(): number {
        return this._mass;
    }

    set mass(mass: number) {
        this._mass = mass;
    }

    get charge(): number {
        return this._charge;
    }

    constructor(mass: number = 1, charge: number = 0) {
        this._mass = mass;
        this._charge = charge;

        this._position = zero();
        this._velocity = zero();
    }
}
