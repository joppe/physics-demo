import * as animation from '@apestaartje/animation';
import * as array from '@apestaartje/array';
import * as dom from '@apestaartje/dom';
import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';

// tslint:disable max-classes-per-file

const canvas: dom.element.Canvas = new dom.element.Canvas({
    width: 800,
    height: 800,
});

canvas.appendTo(document.body);

function getRow(index: number, columns: number): number {
    return Math.floor(index / columns);
}

function getColumn(index: number, columns: number): number {
    return index % columns;
}

interface Stage {
    render(context: CanvasRenderingContext2D, dt: number): void;
}

interface RenderBallOptions {
    color?: string;
    diameter: number;
    position: geometry.vector.Vector;
    textColor?: string;
}

function renderBall(text: string, options: RenderBallOptions, context: CanvasRenderingContext2D): void {
    context.fillStyle = options.color ? options.color : '#00ff00';
    context.beginPath();
    context.arc(
        options.position.x,
        options.position.y,
        options.diameter,
        0,
        Math.PI * 2,
        true,
    );
    context.closePath();
    context.fill();
    context.fillStyle = options.textColor ? options.textColor : '#000000';
    context.font = '12px serif';
    context.fillText(text, options.position.x, options.position.y);
}

function renderCell(cell: Cell, context: CanvasRenderingContext2D): void {
    renderLine(
        {
            start: { x: cell.dx, y: cell.dy },
            end: { x: cell.dx + cell.dWidth, y: cell.dy },
        },
        context,
   );
    renderLine(
        {
            start: { x: cell.dx + cell.dWidth, y: cell.dy },
            end: { x: cell.dx + cell.dWidth, y: cell.dy + cell.dHeight },
        },
        context,
   );
    renderLine(
        {
            start: { x: cell.dx + cell.dWidth, y: cell.dy + cell.dHeight },
            end: { x: cell.dx, y: cell.dy + cell.dHeight },
        },
        context,
   );
    renderLine(
        {
            start: { x: cell.dx, y: cell.dy + cell.dHeight },
            end: { x: cell.dx, y: cell.dy },
        },
        context,
   );

    let n: string;
    switch (cell.index) {
        case 6:
            n = '1';
            break;
        case 7:
            n = '2';
            break;
        case 8:
            n = '3';
            break;
        case 11:
            n = '4';
            break;
        case 12:
            n = '5';
            break;
        case 13:
            n = '6';
            break;
        case 16:
            n = '7';
            break;
        case 17:
            n = '8';
            break;
        case 18:
            n = '9';
            break;
        default:
            n = '';
    }

    context.fillStyle = '#000000';
    context.font = '12px serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(n, cell.dx + (cell.dWidth / 2), cell.dy + (cell.dHeight / 2));
}

interface RenderLineOptions {
    start: geometry.vector.Vector;
    end: geometry.vector.Vector;
    color?: string;
}

function renderLine(options: RenderLineOptions, context: CanvasRenderingContext2D): void {
    context.strokeStyle = options.color ? options.color : '#ff0000';
    context.beginPath();
    context.moveTo(options.start.x, options.start.y);
    context.lineTo(options.end.x, options.end.y);
    context.closePath();
    context.stroke();
}

class Node {
    private _acceleration: geometry.vector.Vector = { x: 0, y: 0 };
    private _neighbours: Node[] = [];
    private _position: geometry.vector.Vector;
    private _velocity: geometry.vector.Vector = { x: 0, y: 0 };

    private readonly _mass: number;

    get position(): geometry.vector.Vector {
        return this._position;
    }

    set position(position: geometry.vector.Vector) {
        this._position = position;
    }

    constructor(position: geometry.vector.Vector, mass: number) {
        this._position = position;
        this._mass = mass;
    }

    public registerNeighbours(neighbours: Node[]): void {
        this._neighbours = neighbours;
    }

    public move(offset: geometry.vector.Vector): void {
        this.position = geometry.vector.add(this._position, offset);
    }

    public tick(c: number, k: number, springLength: number, dt: number): void {
        this._position = physics.move.position(this._position, this._velocity, dt);

        const forces: geometry.vector.Vector[] = this._neighbours.map((neighbour: Node): geometry.vector.Vector => {
            const displacement: geometry.vector.Vector = geometry.vector.subtract(this._position, neighbour.position);
            const unit: geometry.vector.Vector = geometry.vector.unit(displacement);
            const inRest: geometry.vector.Vector = geometry.vector.scale(unit, springLength);
            const extension: geometry.vector.Vector = geometry.vector.subtract(displacement, inRest);

            return physics.force.spring.restoring(k, extension);
        });

        forces.push(physics.force.spring.damping(c, this._velocity));

        const force: geometry.vector.Vector = physics.force.add(...forces);

        // acceleration
        this._acceleration = physics.move.acceleration(force, this._mass);

        // velocity
        this._velocity = physics.move.velocity(this._velocity, this._acceleration, dt);
    }
}

function nodeFactory(mass: number, amount: number, cols: number, offset: number, distance: number): Node[] {
    const nodes: Node[] = [];
    const rows: number = amount / cols;

    for (const index of array.iterator.range(0, amount - 1, 1)) {
        const column: number = getColumn(index, cols);
        const row: number = getRow(index, cols);
        const x: number = offset + (column * distance);
        const y: number = offset + (row * distance);

        nodes.push(
            new Node(
                { x, y },
                mass,
            ),
        );
    }

    nodes.forEach((node: Node, index: number): void => {
        const neighbours: Node[] = [];
        const column: number = getColumn(index, cols);
        const row: number = getRow(index, cols);

        if (column > 0) {
            neighbours.push(nodes[index - 1]);
        }
        if (column < (cols - 1)) {
            neighbours.push(nodes[index + 1]);
        }
        if (row > 0) {
            neighbours.push(nodes[index - cols]);
        }
        if (row < (rows - 1)) {
            neighbours.push(nodes[index + cols]);
        }

        node.registerNeighbours(neighbours);
    });

    return nodes;
}

function move(index: number, cols: number, rows: number, displacement: number, nodes: Node[]): void {
    const column: number = getColumn(index, 3);
    const row: number = getRow(index, 3);

    // for the horizontal lines
    for (const c of array.iterator.range(0, cols - 1, 1)) {
        const topIndex: number = cols * (row + 1) + c;
        const bottomIndex: number = cols * (row + 2) + c;

        nodes[topIndex].move({ x: 0, y: -displacement });
        nodes[bottomIndex].move({ x: 0, y: displacement });
    }
    // for the vertical lines
    for (const r of array.iterator.range(0, rows - 1, 1)) {
        const leftIndex: number = (column + 1) + (r * cols);
        const rightIndex: number = leftIndex + 1;

        nodes[leftIndex].move({ x: -displacement, y: 0 });
        nodes[rightIndex].move({ x: displacement, y: 0 });
    }
}

function imageLoader(onSelect: (image: HTMLImageElement | undefined) => void): void {
    const input: HTMLInputElement = document.createElement('input');

    input.setAttribute('type', 'file');
    input.addEventListener('change', (event: Event): void => {
        const files: FileList | null = input.files;

        if (files === null || files.length === 0 || !files[0].type.match('image.*')) {
            onSelect(undefined);

            return;
        }

        const reader: FileReader = new FileReader();

        reader.addEventListener('load', (e: ProgressEvent): void => {
            const image: HTMLImageElement = document.createElement('img');

            image.addEventListener('load', (): void => {
                onSelect(image);
            });
            image.setAttribute('src', <string>(<FileReader>e.target).result);
        });

        reader.readAsDataURL(files[0]);
    });

    document.body.prepend(input);
}

interface Grid {
    render(context: CanvasRenderingContext2D): void;
}

interface Cell {
    index: number;
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    dx: number;
    dy: number;
    dWidth: number;
    dHeight: number;
}

function gridFactory(cols: number, rows: number, nodes: Node[]): Grid {
    const cells: Cell[] = [];
    const total: number = (cols - 1) * (rows - 1);

    for (const index of array.iterator.range(0, total - 1, 1)) {
        const i: number = index + Math.floor(index / (cols - 1));
        const topLeft: Node = nodes[i];
        const bottomRight: Node = nodes[i + cols + 1];

        cells.push(
            {
                index,
                sx: topLeft.position.x,
                sy: topLeft.position.y,
                sWidth: bottomRight.position.x - topLeft.position.x,
                sHeight: bottomRight.position.y - topLeft.position.y,
                get dx(): number {
                    return topLeft.position.x;
                },
                get dy(): number {
                    return topLeft.position.y;
                },
                get dWidth(): number {
                    return bottomRight.position.x - topLeft.position.x;
                },
                get dHeight(): number {
                    return bottomRight.position.y - topLeft.position.y;
                },
            },
        );
    }

    let image: HTMLImageElement | undefined;

    imageLoader((element: HTMLImageElement | undefined): void => {
        window.console.log((<HTMLImageElement>element).width, (<HTMLImageElement>element).height);
        image = element;
    });

    return {
        render(context: CanvasRenderingContext2D): void {
            // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
            cells.forEach((cell: Cell, index: number): void => {
                if (image !== undefined) {
                    context.drawImage(
                        <HTMLImageElement>image,
                        cell.sx,
                        cell.sy,
                        cell.sWidth,
                        cell.sHeight,
                        cell.dx,
                        cell.dy,
                        cell.dWidth,
                        cell.dHeight,
                    );
                }

                renderCell(
                    cell,
                    context,
                );
            });
        },
    };
}

/**
 * +-+-+-+-+-+
 * | | | | | |
 * +-+-+-+-+-+
 * | |1|2|3| |
 * +-+-+-+-+-+
 * | |4|5|6| |
 * +-+-+-+-+-+
 * | |7|8|9| |
 * +-+-+-+-+-+
 * | | | | | |
 * +-+-+-+-+-+
 */
const stage: Stage = ((): Stage => {
    const rows: number = 6;
    const cols: number = 6;
    const total: number = rows * cols;
    const offset: number = 100;
    const distance: number = 50;
    const C: number = 2;
    const K: number = 15;
    const displacement: number = 20;
    const nodes: Node[] = nodeFactory(1, total, cols, offset, distance);
    const grid: Grid = gridFactory(cols, rows, nodes);
    const ALLOWED_KEYS: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let noTick: boolean = false;

    window.addEventListener('keydown', (event: KeyboardEvent): void => {
        if (ALLOWED_KEYS.indexOf(event.key) === -1) {
            return;
        }

        const n: number = parseInt(event.key, 10);

        noTick = true;
        move(n - 1, cols, rows, displacement, nodes);
        noTick = false;
    });

    return {
        render(context: CanvasRenderingContext2D, dt: number): void {
            grid.render(context);

            if (noTick === false) {
                nodes.forEach((node: Node, index: number): void => {
                    node.tick(C, K, distance, dt);
                });
            }
        },
    };
})();

const animator: animation.animator.Animator = new animation.animator.Animator((time: animation.animator.Chronometer): boolean => {
    const dt: number = time.offset * 0.001;

    canvas.clear();
    stage.render(canvas.context, dt);

    return true;
});

animator.start();

window.addEventListener('dblclick', (): void => {
    window.console.log('stop');
    animator.stop();
});
