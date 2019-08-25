import * as geometry from '@apestaartje/geometry';

export interface RocketOptions {
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
}
