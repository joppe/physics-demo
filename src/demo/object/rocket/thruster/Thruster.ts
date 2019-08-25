import * as geometry from '@apestaartje/geometry';

import { ThrusterOrientation } from '@demo/object/rocket/thruster/ThrusterOrientation';

export interface Thruster {
    start(orientation: ThrusterOrientation): void;
    stop(): void;
    isActive(): boolean;
    force(dt: number): geometry.vector.Vector;
    mass(): number;
}
