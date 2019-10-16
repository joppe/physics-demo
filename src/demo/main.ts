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

interface AnchorOptions {
    diameter: number;
    position: geometry.vector.Vector;
    color: string;
}

function renderAnchor(options: AnchorOptions, context: CanvasRenderingContext2D): void {
    context.fillStyle = options.color;
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
}

interface BallOptions {
    diameter: number;
    position: geometry.vector.Vector;
}

function renderBall(options: BallOptions, context: CanvasRenderingContext2D): void {
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
}

interface LineOptions {
    start: geometry.vector.Vector;
    end: geometry.vector.Vector;
    color?: string;
}

function renderLine(options: LineOptions, context: CanvasRenderingContext2D): void {
    context.strokeStyle = options.color !== undefined ? options.color : '#ff0000';
    context.beginPath();
    context.moveTo(options.start.x, options.start.y);
    context.lineTo(options.end.x, options.end.y);
    context.closePath();
    context.stroke();
}

interface SpringOptions {
    displacement: geometry.vector.Vector;
    length: number;
    mass: number;
    position: geometry.vector.Vector;
    isStart: boolean;
    isEnd: boolean;
}
class Spring {
    private _acceleration: geometry.vector.Vector = { x: 0, y: 0};
    private _end: geometry.vector.Vector;
    private readonly _isEnd: boolean;
    private readonly _isStart: boolean;
    private readonly _length: number;
    private readonly _mass: number;
    private _position: geometry.vector.Vector;
    private _velocity: geometry.vector.Vector = { x: 0, y: 0};

    public get c(): number {
        return 0.5;
    }

    public get damping(): geometry.vector.Vector {
        return physics.force.spring.damping(this.c, this._velocity);
    }

    public get displacement(): geometry.vector.Vector {
        return geometry.vector.subtract(this._end, this._position);
    }

    public get end(): geometry.vector.Vector {
        return this._end;
    }

    public set end(end: geometry.vector.Vector) {
        this._end = end;
    }

    public get extension(): geometry.vector.Vector {
        const displacement: geometry.vector.Vector = this.displacement;
        const unit: geometry.vector.Vector = geometry.vector.unit(displacement);
        const inRest: geometry.vector.Vector = geometry.vector.scale(unit, this._length);

        return geometry.vector.subtract(displacement, inRest);
    }

    public get k(): number {
        return 15;
    }

    public get position(): geometry.vector.Vector {
        return this._position;
    }

    public set position(position: geometry.vector.Vector) {
        this._position = position;
    }

    public get restoring(): geometry.vector.Vector {
        if (geometry.vector.length(this.displacement) < this._length) {
            return { x: 0, y: 0};
        }

        return physics.force.spring.restoring(this.k, this.extension);
    }

    constructor(options: SpringOptions) {
        this._end = geometry.vector.add(options.position, options.displacement);
        this._isEnd = options.isEnd;
        this._isStart = options.isStart;
        this._length = options.length;
        this._mass = options.mass;
        this._position = options.position;
    }

    /**
     * Use the displacement instead of the position
     */
    public tick(dt: number, previous: Spring | undefined, next: Spring | undefined): void {
        // move
        this.end = physics.move.position(this.end, this._velocity, dt);

        // set the end of the other spring equal to the end of this spring
        if (next !== undefined) {
            // console.log('move next', next.position, this.end);
            next.position = this.end;
        }

        const forces: geometry.vector.Vector[] = [
            this.damping,
            this.restoring,
        ];

        if (previous !== undefined) {
            // console.log('previous.restoring', previous.restoring);
            // forces.push(geometry.vector.negate(previous.restoring));
            forces.push(previous.restoring);
        }

        if (next !== undefined) {
            // console.log('next.restoring', next.restoring);
            forces.push(geometry.vector.negate(next.restoring));
        }

        // force
        const force: geometry.vector.Vector = physics.force.add(...forces);

        // acceleration
        this._acceleration = physics.move.acceleration(force, this._mass);

        // velocity
        this._velocity = physics.move.velocity(this._velocity, this._acceleration, dt);
    }

    public render(context: CanvasRenderingContext2D): void {
        renderAnchor(
            {
                diameter: 5,
                position: this._position,
                color: '#0000ff',
            },
            context,
        );

        renderLine(
            {
                start: this._position,
                end: this._end,
            },
            context,
        );

        if (this._isEnd) {
            renderAnchor(
                {
                    diameter: 5,
                    position: this._end,
                    color: '#ff0000',
                },
                context,
            );
        }
    }

    public increaseVelocity(v: geometry.vector.Vector): void {
        console.log('increaseVelocity');
        this._velocity = geometry.vector.add(this._velocity, v);
    }
}

function springFactory(amount: number, length: number, offset: number, mass: number, isHorizontal: boolean): Spring[] {
    const springs: Spring[] = [];

    for (const index of array.iterator.range(0, amount - 1, 1)) {
        const axis: number = offset + (index * length);

        springs.push(
            new Spring({
                displacement: { x: length, y : 0 },
                length,
                mass,
                position: { x: isHorizontal ? axis : 100, y : isHorizontal ? 100 : axis },
                isStart: index === 0,
                isEnd: index === amount - 1,
            }),
        );
    }

    return springs;
}

interface Stage {
    render(context: CanvasRenderingContext2D, dt: number): void;
}

const stage: Stage = ((): Stage => {
    const SPRING_COUNT: number = 5;
    const springs: Spring[] = springFactory(SPRING_COUNT, 100, 100, 1, true);

    const ALLOWED_KEYS: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    window.addEventListener('keydown', (event: KeyboardEvent): void => {
        if (ALLOWED_KEYS.indexOf(event.key) === -1) {
            return;
        }
        console.log(event.key);
        /*/
        switch (event.key) {
            case '1':
                springs[0].increaseVelocity({
                    x: -200,
                    y: 0,
                });
                springs[1].increaseVelocity({
                    x: 200,
                    y: 0,
                });
                break;
            case '2':
                springs[1].increaseVelocity({
                    x: -200,
                    y: 0,
                });
                springs[2].increaseVelocity({
                    x: 200,
                    y: 0,
                });
                break;
            case '3':
                springs[2].increaseVelocity({
                    x: -200,
                    y: 0,
                });
                springs[3].increaseVelocity({
                    x: 200,
                    y: 0,
                });
                break;
            default:
                console.log('??');
        }
        /**/

        springs[1].increaseVelocity({
            x: -200,
            y: 0,
        });

        // window.setTimeout((): void => animator.stop(), 2000);
    });

    return {
        render(context: CanvasRenderingContext2D, dt: number): void {
            springs.forEach((spring: Spring, index: number): void => {
                const previous: Spring | undefined = index > 0 ? springs[index - 1] : undefined;
                const next: Spring | undefined = index < (SPRING_COUNT - 1) ? springs[index + 1] : undefined;

                spring.render(context);

                if (index < (SPRING_COUNT - 1)) {
                    renderBall(
                        {
                            diameter: 15,
                            position: spring.end,
                        },
                        context,
                    );
                }

                spring.tick(dt, previous, next);
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

window.addEventListener('click', (): void => {
    console.log('stop');
    animator.stop();
});
