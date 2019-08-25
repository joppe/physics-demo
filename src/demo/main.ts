import * as animation from '@apestaartje/animation';
import * as dom from '@apestaartje/dom';
import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';

// tslint:disable max-classes-per-file

const canvas: dom.element.Canvas = new dom.element.Canvas({
    width: 800,
    height: 800,
});

canvas.appendTo(document.body);

class Anchor {
    private readonly _diameter: number = 5;
    private readonly _position: geometry.vector.Vector;

    constructor(position: geometry.vector.Vector) {
        this._position = position;
    }

    public render(context: CanvasRenderingContext2D): void {

        context.fillStyle = '#0000ff';
        context.beginPath();
        context.arc(
            this._position.x,
            this._position.y,
            this._diameter,
            0,
            Math.PI * 2,
            true,
        );
        context.closePath();
        context.fill();
    }
}

class Ball {
    private readonly _diameter: number = 20;

    public render(context: CanvasRenderingContext2D, position: geometry.vector.Vector): void {
        context.fillStyle = '#00ff00';
        context.beginPath();
        context.arc(
            position.x,
            position.y,
            this._diameter,
            0,
            Math.PI * 2,
            true,
        );
        context.closePath();
        context.fill();
    }
}

class Line {
    public render(context: CanvasRenderingContext2D, start: geometry.vector.Vector, end: geometry.vector.Vector): void {
        context.strokeStyle = '#ff0000';
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.closePath();
        context.stroke();
    }
}

class Spring {
    private _displacement: geometry.vector.Vector;
    private readonly _length: number;
    private _position: geometry.vector.Vector;
    private _velocity: geometry.vector.Vector = { x: 0, y: 0};

    public get c(): number {
        return 0.5;
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

    public get extension(): geometry.vector.Vector {
        const unit: geometry.vector.Vector = geometry.vector.unit(this.displacement);
        const inRest: geometry.vector.Vector = geometry.vector.scale(unit, this._length);

        return geometry.vector.subtract(this.displacement, inRest);
    }

    public get k(): number {
        return 10;
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

    constructor(position: geometry.vector.Vector, length: number) {
        this.position = position;
        this.displacement = position;
        this._length = length;
    }
}

interface Stage {
    render(context: CanvasRenderingContext2D, dt: number): void;
}

const stage: Stage = ((): Stage => {
    const mass: number = 1;
    const ball: Ball = new Ball();
    const center: geometry.vector.Vector = {
        x: 350,
        y: 50,
    };
    let position: geometry.vector.Vector = {
        x: 350,
        y: 50,
    };
    const anchor: Anchor = new Anchor(center);

    const c: number = 0.5; // damping constant
    const k: number = 10;  // restoring constant

    let velocity: geometry.vector.Vector = { x: 0, y: 0 };
    let acceleration: geometry.vector.Vector = { x: 0, y: 0 };

    const bonusForce: geometry.vector.Vector = { x: 0, y: 0 };
    const button: HTMLButtonElement = document.createElement('button');

    button.innerText = 'Move';
    button.addEventListener('click', (): void => {
        velocity.x += 200;
    });

    document.body.appendChild(button);

    return {
        render(context: CanvasRenderingContext2D, dt: number): void {
            position = physics.move.position(position, velocity, dt);

            anchor.render(context);
            ball.render(context, position);

            const displacement: geometry.vector.Vector = geometry.vector.subtract(position, center);
            const restoring: geometry.vector.Vector = physics.force.spring.restoring(k, displacement);
            const damping: geometry.vector.Vector = physics.force.spring.damping(c, velocity);
            const force: geometry.vector.Vector = physics.force.add(restoring, damping, bonusForce);

            acceleration = physics.move.acceleration(force, mass);
            velocity = physics.move.velocity(velocity, acceleration, dt);
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
