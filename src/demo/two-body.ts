import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';
import * as physics from '@apestaartje/physics';

import { Ball } from '@demo/object/Ball';

function createBall(radius: number, color: string, mass: number, pos: geometry.vector.Vector, vel?: geometry.vector.Vector): Ball {
    const ball: Ball = new Ball(radius, color, mass);

    ball.position = {...pos};

    if (vel !== undefined) {
        ball.velocity = vel;
    }

    return ball;
}

function calcBallVelocity(b1: Ball, b2: Ball, dt: number, G: number): geometry.vector.Vector {
    const force: geometry.vector.Vector = physics.force.gravity.gravity(
        b1.mass,
        b2.mass,
        geometry.vector.subtract(b1.position, b2.position),
        G,
    );

    return physics.move.velocity(b1.velocity, physics.move.acceleration(force, b1.mass), dt);
}

function createStage(size: geometry.size.Size, balls: Ball[], ghosts: Ball[]): animation.stage.Stage {
    const stage: animation.stage.Stage = new animation.stage.Stage(
        document.body,
        size,
    );

    const staticLayer: animation.stage.Layer = stage.getLayer('root');
    staticLayer.freeze(true);

    ghosts.forEach((ghost: Ball, index: number): void => {
        staticLayer.addAsset(ghost, `ball-${index}-ghost`, 10);
    });

    const dynamicLayer: animation.stage.Layer = stage.createLayer('planets', 10);

    balls.forEach((ball: Ball, index: number): void => {
        dynamicLayer.addAsset(ball, `ball-${index}`, 10);
    });

    return stage;
}

function createAnimator(ball1: Ball, ball2: Ball, stage: animation.stage.Stage): animation.animator.Animator {
    return new animation.animator.Animator((time: animation.animator.Chronometer): boolean => {
        const dt: number = time.offset * 0.001;

        ball1.position = physics.move.position(ball1.position, ball1.velocity, dt);
        ball2.position = physics.move.position(ball2.position, ball2.velocity, dt);

        stage.render();

        ball1.velocity = calcBallVelocity(ball1, ball2, dt, 100000);
        ball2.velocity = calcBallVelocity(ball2, ball1, dt, 100000);

        return true;
    });
}

function main(size: geometry.size.Size): void {
    const ghost1: Ball = createBall(10, '#9999ff', 1, { x: 150, y: 200 });
    const ghost2: Ball = createBall(40, '#ff9999', 60, { x: 350, y: 200 });
    const ball1: Ball = createBall(10, '#0000ff', 1, ghost1.position, { x: 0, y: 150 });
    const ball2: Ball = createBall(40, '#ff0000', 60, ghost2.position, { x: 0, y: 0 });

    const stage: animation.stage.Stage = createStage(size, [ball1, ball2], [ghost1, ghost2]);
    const animator: animation.animator.Animator = createAnimator(ball1, ball2, stage);

    animator.start();
}

main({ width: 1024, height: 1024 });
