import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';

import { Thruster } from '@demo/object/rocket/thruster/Thruster';
import { ThrusterOrientation } from '@demo/object/rocket/thruster/ThrusterOrientation';

// `v` is the exhaust velocity
export function factory(v: geometry.vector.Vector, mass: number, dm: number): Thruster {
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
        },
    };
}
