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

interface Stage {
    render(context: CanvasRenderingContext2D, dt: number): void;
}

interface RenderBallOptions {
    diameter: number;
    position: geometry.vector.Vector;
}

function renderBall(text: string, options: RenderBallOptions, context: CanvasRenderingContext2D): void {
    context.fillStyle = '#00ff00';
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
    context.fillStyle = '#000000';
    context.font = '21px serif';
    context.fillText(text, options.position.x, options.position.y);
}

interface RenderLineOptions {
    start: geometry.vector.Vector;
    end: geometry.vector.Vector;
}

function renderLine(options: RenderLineOptions, context: CanvasRenderingContext2D): void {
    context.strokeStyle = '#ff0000';
    context.beginPath();
    context.moveTo(options.start.x, options.start.y);
    context.lineTo(options.end.x, options.end.y);
    context.closePath();
    context.stroke();
}

class Ball {
    private _acceleration: geometry.vector.Vector = { x: 0, y: 0 };
    private _position: geometry.vector.Vector;
    private readonly _index: number;
    private _velocity: geometry.vector.Vector = { x: 0, y: 0 };
    private readonly _diameter: number;
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

    constructor(index: number, position: geometry.vector.Vector, diameter: number, mass: number, isFixed: boolean) {
        this._index = index;
        this._position = position;
        this._isFixed = isFixed;
        this._diameter = diameter;
        this._mass = mass;
    }

    public render(balls: Ball[], c: number, k: number, springLength: number, dt: number, context: CanvasRenderingContext2D): void {
        this.tick(balls, c, k, springLength, dt);

        renderBall(
            String(this._index),
            {
                diameter: this._diameter,
                position: this._position,
            },
            context,
       );
    }

    private tick(balls: Ball[], c: number, k: number, springLength: number, dt: number): void {
        if (this._isFixed) {
            return;
        }

        this._position = physics.move.position(this._position, this._velocity, dt);

        const forces: geometry.vector.Vector[] = balls.map((ball: Ball): geometry.vector.Vector => {
            const displacement: geometry.vector.Vector = geometry.vector.subtract(this._position, ball.position);

            // if (geometry.vector.length(displacement) <= springLength) {
            //     return physics.force.zero();
            // }

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

function ballsFactory(amount: number, offset: number, distance: number): Ball[] {
    const mass: number = 1;
    const diameter: number = 10;
    const balls: Ball[] = [];

    for (const index of array.iterator.range(0, amount - 1, 1)) {
        const x: number = offset + (index * distance);

        balls.push(
            new Ball(
                index,
                { x, y: 200 },
                diameter,
                mass,
                index === 0 || (index === amount - 1),
            ),
        );
    }

    return balls;
}

const stage: Stage = ((): Stage => {
    const BALL_COUNT: number = 5;
    const BALL_OFFSET: number = 100;
    const BALL_DISTANCE: number = 100;
    const C: number = 2;
    const K: number = 15;

    /**
     * Create a set of balls.
     * These balls are connected with springs.
     * The two outer balls cannot move.
     */
    const balls: Ball[] = ballsFactory(BALL_COUNT, BALL_OFFSET, BALL_DISTANCE);

    const ALLOWED_KEYS: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    window.addEventListener('keydown', (event: KeyboardEvent): void => {
        if (ALLOWED_KEYS.indexOf(event.key) === -1) {
            return;
        }

        const a: Ball = balls[2];
        const b: Ball = balls[3];
        const offset: number = 50;

        a.position = { x: a.position.x - offset, y: a.position.y };
        b.position = { x: b.position.x + offset, y: b.position.y };
    });

    return {
        render(context: CanvasRenderingContext2D, dt: number): void {
            balls.forEach((ball: Ball, index: number): void => {
                const others: Ball[] = [];

                if (index > 0) {
                    others.push(balls[index - 1]);
                }

                if (index < (BALL_COUNT - 1)) {
                    others.push(balls[index + 1]);
                }

                ball.render(others, C, K, BALL_DISTANCE, dt, context);
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
