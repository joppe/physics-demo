import * as array from '@apestaartje/array';
import { Cell } from '@nervous-matrix/matrix/Cell';
import { MatrixOptions } from '@nervous-matrix/matrix/MatrixOptions';
import { Node } from '@nervous-matrix/spring/Node';
import {getColumn} from '@nervous-matrix/matrix/getColumn';
import {getRow} from '@nervous-matrix/matrix/getRow';

export class Matrix {
    private readonly _horizontal: Node[] = [];
    private readonly _vertical: Node[] = [];
    private readonly _cols: number;
    private readonly _rows: number;
    private readonly _distance: number;
    private readonly _c: number;
    private readonly _k: number;
    private readonly _mass: number;

    public get horizontal(): Node[] {
        return this._horizontal;
    }

    public get vertical(): Node[] {
        return this._vertical;
    }

    public constructor(options: MatrixOptions) {
        this._cols = options.cols;
        this._rows = options.rows;
        this._distance = options.distance;
        this._c = options.c;
        this._k = options.k;
        this._mass = options.mass;

        this._horizontal = this.createHorizontal(this._rows, options.offset, this._distance);
        this._vertical = this.createVertical(this._cols, options.offset, this._distance);

        this.registerNeighbours(this._vertical, this._cols);
        this.registerNeighbours(this._horizontal, this._rows);
    }

    public tick(dt: number): void {
        [this._vertical, this._horizontal].forEach((nodes: Node[]): void => {
            nodes.forEach((node: Node): void => {
                node.tick(dt);
            });
        });
    }

    public getCell(index: number): Cell {
        const i: number = index + Math.floor(index / (this._cols - 1));
        const col: number = getColumn(i, this._cols);
        const row: number = getRow(i, this._cols);

        return {
            topLine: this._horizontal[row],
            bottomLine: this._horizontal[row + 1],
            leftLine: this._vertical[col],
            rightLine: this._vertical[col + 1],
        };
    }

    private createVertical(cols: number, offset: number, distance: number): Node[] {
        const nodes: Node[] = [];
        let x: number = offset;

        for (const i of array.iterator.range(0, cols - 1, 1)) {
            nodes.push(new Node({
                c: this._c,
                k: this._k,
                position: { x, y: offset },
                mass: 1,
                springLength: this._distance,
            }));

            x += distance;
        }

        return nodes;
    }

    private createHorizontal(rows: number, offset: number, distance: number): Node[] {
        const nodes: Node[] = [];
        let y: number = offset;

        for (const i of array.iterator.range(0, rows - 1, 1)) {
            nodes.push(new Node({
                c: this._c,
                k: this._k,
                position: { x: offset, y },
                mass: 1,
                springLength: this._distance,
            }));

            y += distance;
        }

        return nodes;
    }

    private registerNeighbours(nodes: Node[], max: number): void {
        nodes.forEach((node: Node, index: number): void => {
            const neighbours: Node[] = [];

            if (index > 0) {
                neighbours.push(nodes[index - 1]);
            }
            if (index < (max - 1)) {
                neighbours.push(nodes[index + 1]);
            }

            node.registerNeighbours(neighbours);
        });
    }
}
