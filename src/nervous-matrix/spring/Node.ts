import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';
import {NodeOptions} from '@nervous-matrix/spring/NodeOptions';

export class Node {
    private _acceleration: geometry.vector.Vector = { x: 0, y: 0 };
    private _neighbours: Node[] = [];
    private _position: geometry.vector.Vector;
    private _velocity: geometry.vector.Vector = { x: 0, y: 0 };

    private readonly _mass: number;
    private readonly _c: number;
    private readonly _k: number;
    private readonly _springLength: number;

    get position(): geometry.vector.Vector {
        return this._position;
    }

    set position(position: geometry.vector.Vector) {
        this._position = position;
    }

    public constructor(options: NodeOptions) {
        this._position = options.position;
        this._mass = options.mass;
        this._c = options.c;
        this._k = options.k;
        this._springLength = options.springLength;
    }

    public registerNeighbours(neighbours: Node[]): void {
        this._neighbours = neighbours;
    }

    public move(offset: geometry.vector.Vector): void {
        this.position = geometry.vector.add(this._position, offset);
    }

    public tick(dt: number): void {
        this._position = physics.move.position(this._position, this._velocity, dt);

        const forces: geometry.vector.Vector[] = this._neighbours.map((neighbour: Node): geometry.vector.Vector => {
            const displacement: geometry.vector.Vector = geometry.vector.subtract(this._position, neighbour.position);
            const unit: geometry.vector.Vector = geometry.vector.unit(displacement);
            const inRest: geometry.vector.Vector = geometry.vector.scale(unit, this._springLength);
            const extension: geometry.vector.Vector = geometry.vector.subtract(displacement, inRest);

            return physics.force.spring.restoring(this._k, extension);
        });

        forces.push(physics.force.spring.damping(this._c, this._velocity));

        const force: geometry.vector.Vector = physics.force.add(...forces);

        // acceleration
        this._acceleration = physics.move.acceleration(force, this._mass);

        // velocity
        this._velocity = physics.move.velocity(this._velocity, this._acceleration, dt);
    }
}
