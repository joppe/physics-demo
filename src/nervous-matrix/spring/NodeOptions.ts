import * as geometry from '@apestaartje/geometry';

export interface NodeOptions {
    mass: number;
    c: number;
    k: number;
    springLength: number;
    position: geometry.vector.Vector;
}
