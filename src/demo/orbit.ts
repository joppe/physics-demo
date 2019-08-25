import * as animation from '@apestaartje/animation';
import * as array from '@apestaartje/array';
import * as geometry from '@apestaartje/geometry';
import * as number from '@apestaartje/number';
import * as physics from '@apestaartje/physics';

import { Ball } from '@demo/object/Ball';

function createStars(count: number, space: geometry.size.Size):  Ball[] {
    const stars: Ball[] = [];

    for (const index of array.iterator.range(1, count, 1)) {
        const star: Ball = new Ball(number.random(1, 2), '#ffff00', 1000000);

        star.position = {
            x: number.random(0, space.width),
            y: number.random(0, space.height),
        };

        stars.push(star);
    }

    return stars;
}

function createStage(sun: Ball, planet: Ball, stars: Ball[], size: geometry.size.Size): animation.stage.Stage {
    const stage: animation.stage.Stage = new animation.stage.Stage(
        document.body,
        size,
    );

    const staticLayer: animation.stage.Layer = stage.getLayer('root');
    staticLayer.color = '#000000';
    staticLayer.freeze(true);
    staticLayer.addAsset(sun, 'sun', 10);

    stars.forEach((star: Ball, index: number): void => {
        staticLayer.addAsset(star, `star-${index}`, 5);
    });

    const dynamicLayer: animation.stage.Layer = stage.createLayer('planet', 10);
    dynamicLayer.addAsset(planet, 'planet', 20);

    return stage;
}

function createAnimator(sun: Ball, planet: Ball, stage: animation.stage.Stage): animation.animator.Animator {
    return new animation.animator.Animator((time: animation.animator.Chronometer): boolean => {
        const dt: number = time.offset * 0.001;

        planet.position = physics.move.position(planet.position, planet.velocity, dt);

        stage.render();

        const force: geometry.vector.Vector = physics.force.gravity.gravity(
            sun.mass,
            planet.mass,
            geometry.vector.subtract(planet.position, sun.position),
            1,
        );

        planet.velocity = physics.move.velocity(planet.velocity, physics.move.acceleration(force, planet.mass), dt);

        return true;
    });
}

function main(size: geometry.size.Size, log: boolean = false): void {
    const sun: Ball = new Ball(70, '#ff9900', 1000000);
    sun.position = { x: 275, y: 200 };

    const planet: Ball = new Ball(10, '#0000ff', 1);
    planet.position = { x: 200, y: 50 };
    planet.velocity = { x: 80, y: 0 };

    const stars: Ball[] = createStars(100, size);
    const stage: animation.stage.Stage = createStage(sun, planet, stars, size);
    const animator: animation.animator.Animator = createAnimator(sun, planet, stage);

    animator.start();

    if (log) {
        window.console.log(`The velocity of the planet: ${geometry.vector.length(planet.velocity)}`);
        window.console.log(`
            The escape velocity of the planet: ${
                physics.force.gravity.escapeVelocity(
                    sun.mass,
                    geometry.vector.length(geometry.vector.subtract(planet.position, sun.position)),
                    1,
                )}
        `);
    }
}

main({ width: 1024, height: 1024 }, true);
