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

class Ball {
    private _acceleration: geometry.vector.Vector = { x: 0, y: 0 };
    private _neighbours: Ball[] = [];
    private _position: geometry.vector.Vector;
    private _velocity: geometry.vector.Vector = { x: 0, y: 0 };

    private readonly _isFixed: boolean;
    private readonly _mass: number;

    get position(): geometry.vector.Vector {
        return this._position;
    }

    set position(position: geometry.vector.Vector) {
        if (this._isFixed) {
            return;
        }

        this._position = position;
    }

    constructor(position: geometry.vector.Vector, mass: number, isFixed: boolean) {
        this._position = position;
        this._isFixed = isFixed;
        this._mass = mass;
    }

    public registerNeighbours(neighbours: Ball[]): void {
        this._neighbours = neighbours;
    }

    public move(offset: geometry.vector.Vector): void {
        this.position = geometry.vector.add(this._position, offset);
    }

    public tick(c: number, k: number, springLength: number, dt: number): void {
        if (this._isFixed) {
            return;
        }

        this._position = physics.move.position(this._position, this._velocity, dt);

        const forces: geometry.vector.Vector[] = this._neighbours.map((neighbour: Ball): geometry.vector.Vector => {
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

function ballsFactory(mass: number, amount: number, perRow: number, offset: number, distance: number): Ball[] {
    const balls: Ball[] = [];
    const rows: number = amount / perRow;

    for (const index of array.iterator.range(0, amount - 1, 1)) {
        const column: number = getColumn(index, perRow);
        const row: number = getRow(index, perRow);
        const x: number = offset + (column * distance);
        const y: number = offset + (row * distance);
        const ifFixed: boolean = column === 0 || column === (perRow - 1) || row === 0 || row === (rows - 1);

        balls.push(
            new Ball(
                { x, y },
                mass,
                ifFixed,
            ),
        );
    }

    balls.forEach((ball: Ball, index: number): void => {
        const neighbours: Ball[] = [];
        const column: number = getColumn(index, perRow);
        const row: number = getRow(index, perRow);

        if (column > 0) {
            neighbours.push(balls[index - 1]);
        }
        if (column < (perRow - 1)) {
            neighbours.push(balls[index + 1]);
        }
        if (row > 0) {
            neighbours.push(balls[index - perRow]);
        }
        if (row < (rows - 1)) {
            neighbours.push(balls[index + perRow]);
        }

        ball.registerNeighbours(neighbours);
    });

    return balls;
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
    const ROWS: number = 6;
    const COLUMNS: number = 6;
    const BALL_COUNT: number = ROWS * COLUMNS;
    const BALL_OFFSET: number = 100;
    const BALL_DISTANCE: number = 50;
    const C: number = 2;
    const K: number = 15;
    const displacement: number = 20;

    /**
     * Create a set of balls.
     * These balls are connected with springs.
     * The two outer balls cannot move.
     */
    const balls: Ball[] = ballsFactory(1, BALL_COUNT, COLUMNS, BALL_OFFSET, BALL_DISTANCE);

    const ALLOWED_KEYS: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    window.addEventListener('keydown', (event: KeyboardEvent): void => {
        if (ALLOWED_KEYS.indexOf(event.key) === -1) {
            return;
        }

        const n: number = parseInt(event.key, 10);
        const index: number = n - 1;
        const column: number = getColumn(index, 3);
        const row: number = getRow(index, 3);
        const topLeftIndex: number = COLUMNS * (row + 1) + (column + 1);
        const topRightIndex: number = topLeftIndex + 1;
        const bottomLeftIndex: number = topLeftIndex + COLUMNS;
        const bottomRightIndex: number = bottomLeftIndex + 1;

        balls[topLeftIndex].move({ x: -displacement, y: -displacement });
        balls[topRightIndex].move({ x: displacement, y: -displacement });
        balls[bottomLeftIndex].move({ x: -displacement, y: displacement });
        balls[bottomRightIndex].move({ x: displacement, y: displacement });
    });

    return {
        render(context: CanvasRenderingContext2D, dt: number): void {
            balls.forEach((ball: Ball, index: number): void => {
                renderBall(
                    String(index),
                    { diameter: 5, position: ball.position },
                    context,
                );

                ball.tick(C, K, BALL_DISTANCE, dt);
            });
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
