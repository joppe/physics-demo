import * as animation from '@apestaartje/animation';
import * as dom from '@apestaartje/dom';
import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';
import { number } from '@apestaartje/array';

// tslint:disable max-classes-per-file

const canvas: dom.element.Canvas = new dom.element.Canvas({
    width: 800,
    height: 800,
});

canvas.appendTo(document.body);

interface AnchorOptions {
    diameter: number;
    position: geometry.vector.Vector;
}

function renderAnchor(options: AnchorOptions, context: CanvasRenderingContext2D): void {
    context.fillStyle = '#0000ff';
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
}

function renderLine(options: LineOptions, context: CanvasRenderingContext2D): void {
    context.strokeStyle = '#ff0000';
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
}
class Spring {
    private _acceleration: geometry.vector.Vector = { x: 0, y: 0};
    private _displacement: geometry.vector.Vector;
    private readonly _length: number;
    private readonly _mass: number;
    private _position: geometry.vector.Vector;
    private _velocity: geometry.vector.Vector = { x: 0, y: 0};

    public get c(): number {
        return 0.8;
    }

    public get damping(): geometry.vector.Vector {
        return physics.force.spring.damping(this.c, this._velocity);
    }

    public get displacement(): geometry.vector.Vector {
        return this._displacement;
    }

    public set displacement(displacement: geometry.vector.Vector) {
        this._displacement = displacement;
    }

    public get end(): geometry.vector.Vector {
        return geometry.vector.add(this.position, this.displacement);
    }

    public set end(end: geometry.vector.Vector) {
        this.displacement = geometry.vector.subtract(end, this.position);
    }

    public get extension(): geometry.vector.Vector {
        const unit: geometry.vector.Vector = geometry.vector.unit(this.displacement);
        const inRest: geometry.vector.Vector = geometry.vector.scale(unit, this._length);

        return geometry.vector.subtract(this.displacement, inRest);
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
        return physics.force.spring.restoring(this.k, this.extension);
    }

    constructor(options: SpringOptions) {
        this._displacement = options.displacement;
        this._length = options.length;
        this._mass = options.mass;
        this._position = options.position;
    }

    /**
     * Use the displacement instead of the position
     *
     */
    public ping(dt: number, other: Spring): void {
        // move
        this.displacement = physics.move.position(this.displacement, this._velocity, dt);

        // set the end of the other spring equal to the end of this spring
        other.end = this.end;

        // force
        const force: geometry.vector.Vector = physics.force.add(
            this.damping,
            this.restoring,
            other.restoring,    // also add the spring/restoring forces of neighbouring springs
        );

        // acceleration
        this._acceleration = physics.move.acceleration(force, this._mass);

        // velocity
        this._velocity = physics.move.velocity(this._velocity, this._acceleration, dt);
    }

    public render(context: CanvasRenderingContext2D): void {
        const start: geometry.vector.Vector = this.position;
        const end: geometry.vector.Vector = geometry.vector.add(this.position, this.displacement);

        renderAnchor(
            {
                diameter: 5,
                position: start,
            },
            context,
        );

        renderLine(
            {
                start,
                end,
            },
            context,
        );
    }

    public increaseVelocity(v: geometry.vector.Vector): void {
        this._velocity = geometry.vector.add(this._velocity, v);
    }
}

interface Stage {
    render(context: CanvasRenderingContext2D, dt: number): void;
}

const stage: Stage = ((): Stage => {
    const a: Spring = new Spring({
        displacement: { x: 100, y : 0 },
        length: 100,
        mass: 1,
        position: { x: 100, y : 100 },
    });
    const b: Spring = new Spring({
        displacement: { x: -100, y : 0 },
        length: 100,
        mass: 1,
        position: { x: 300, y : 100 },
    });

    const button: HTMLButtonElement = document.createElement('button');

    button.innerText = 'Move';
    button.addEventListener('click', (): void => {
        a.increaseVelocity({
            x: 200,
            y: 0,
        });
    });
    document.body.appendChild(button);

    return {
        render(context: CanvasRenderingContext2D, dt: number): void {
            a.render(context);
            b.render(context);

            renderBall(
                {
                    diameter: 15,
                    position: geometry.vector.add(a.position, a.displacement),
                },
                context,
            );

            a.ping(dt, b);
            b.ping(dt, a);
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
