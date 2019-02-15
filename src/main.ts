import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';

import { Ball } from 'app/object/Ball';

function createBall(
    radius: number,
    color: string,
    mass: number,
    position: geometry.vector.Vector,
    velocity?: geometry.vector.Vector
): Ball {
    const ball: Ball = new Ball(radius, color, mass);

    ball.position = {...position};

    if (velocity !== undefined) {
        ball.velocity = velocity;
    }

    return ball;
}

function calcPosition(position: geometry.vector.Vector, velocity: geometry.vector.Vector, dt: number): geometry.vector.Vector {
    return geometry.vector.add(
        position,
        geometry.vector.scale(velocity, dt)
    );
}

function calcGravity(
    mass1: number,
    mass2: number,
    position1: geometry.vector.Vector,
    position2: geometry.vector.Vector,
    G: number
): geometry.vector.Vector {
    return physics.force.gravity.gravity(
        mass1,
        mass2,
        geometry.vector.subtract(position1, position2),
        G
    );
}

function calcAcceleration(force: geometry.vector.Vector, mass: number): geometry.vector.Vector {
    return geometry.vector.scale(force, 1 / mass);
}

function calcVelocity(velocity: geometry.vector.Vector, acceleration: geometry.vector.Vector, dt: number): geometry.vector.Vector {
    return geometry.vector.add(
        velocity,
        geometry.vector.scale(acceleration, dt)
    );
}

function calcBallVelocity(b1: Ball, b2: Ball, dt: number, G: number): geometry.vector.Vector {
    const force: geometry.vector.Vector = calcGravity(b1.mass, b2.mass, b1.position, b2.position, G);
    const acceleration: geometry.vector.Vector = calcAcceleration(force, b1.mass);

    return calcVelocity(b1.velocity, acceleration, dt);
}

const ball1Ghost: Ball = createBall(10, '#9999ff', 1, { x: 150, y: 200 });
const ball2Ghost: Ball = createBall(40, '#ff9999', 60, { x: 350, y: 200 });
const ball1: Ball = createBall(10, '#0000ff', 1, ball1Ghost.position, { x: 0, y: 150 });
const ball2: Ball = createBall(40, '#ff0000', 60, ball2Ghost.position, { x: 0, y: 0 });

const stage: animation.stage.Stage = new animation.stage.Stage(
    document.body,
    { width: 1024, height: 1024}
);

const staticLayer: animation.stage.Layer = stage.getLayer('root');
const dynamicLayer: animation.stage.Layer = stage.createLayer('planet', 10);

staticLayer.freeze(true);
staticLayer.addAsset(ball1Ghost, 'ball-1-ghost', 10);
staticLayer.addAsset(ball2Ghost, 'ball-2-ghost', 10);

dynamicLayer.addAsset(ball1, 'ball-1', 10);
dynamicLayer.addAsset(ball2, 'ball-2', 10);

const animator: animation.animator.Animator = new animation.animator.Animator((time: animation.animator.Chronometer): boolean => {
    const dt: number = time.offset * 0.001;

    ball1.position = calcPosition(ball1.position, ball1.velocity, dt);
    ball2.position = calcPosition(ball2.position, ball2.velocity, dt);

    stage.render();

    ball1.velocity = calcBallVelocity(ball1, ball2, dt, 100000);
    ball2.velocity = calcBallVelocity(ball2, ball1, dt, 100000);

    return true;
});

animator.start();

window.setTimeout(() => animator.stop(), 200);
