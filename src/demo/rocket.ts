import * as animation from '@apestaartje/animation';
import * as array from '@apestaartje/array';
import * as geometry from '@apestaartje/geometry';
import * as number from '@apestaartje/number';
import * as physics from '@apestaartje/physics';

import { Ball } from '@demo/object/Ball';
import { Rocket } from '@demo/object/rocket/Rocket';

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

function createStage(planet: Ball, rocket: Rocket, stars: Ball[], size: geometry.size.Size): animation.stage.Stage {
    const stage: animation.stage.Stage = new animation.stage.Stage(
        document.body,
        size,
    );

    const staticLayer: animation.stage.Layer = stage.getLayer('root');
    staticLayer.color = '#000000';
    staticLayer.freeze(true);
    staticLayer.addAsset(planet, 'planet', 10);

    stars.forEach((star: Ball, index: number): void => {
        staticLayer.addAsset(star, `star-${index}`, 5);
    });

    const dynamicLayer: animation.stage.Layer = stage.createLayer('planet', 10);
    dynamicLayer.addAsset(rocket, 'rocket', 10);

    return stage;
}

function calcVelocity(rocket: Rocket, planet: Ball, dt: number, G: number): geometry.vector.Vector {
    const gravity: geometry.vector.Vector = physics.force.gravity.gravity(
        rocket.mass,
        planet.mass,
        geometry.vector.subtract(rocket.position, planet.position),
        G,
    );
    const force: geometry.vector.Vector = physics.force.add(
        gravity,
        rocket.force(dt),
    );

    return physics.move.velocity(rocket.velocity, physics.move.acceleration(force, rocket.mass), dt);
}

function createAnimator(planet: Ball, rocket: Rocket, stage: animation.stage.Stage): animation.animator.Animator {
    return new animation.animator.Animator((time: animation.animator.Chronometer): boolean => {
        const dt: number = time.offset * 0.001;

        rocket.position = physics.move.position(rocket.position, rocket.velocity, dt);

        stage.render();

        rocket.velocity = calcVelocity(rocket, planet, dt, 0.1);

        return true;
    });
}

function createRocket(x: number, y: number): Rocket {
    const rocket: Rocket = new Rocket({
        size: { width: 12, height: 12 },
        color: '#cccccc',
        mass: 8,
        thruster: {
            main: {
                mass: 1,
                dm: 0.3,
                v: { x: 0, y: 10},
            },
            side: {
                mass: 1,
                dm: 0.1,
                v: { x: 5, y: 0},
            },
        },
    });
    rocket.position = { x, y };
    rocket.startThrust('main', 1);

    window.addEventListener('keydown', (event: KeyboardEvent): void => {
        switch (event.key) {
            case 'ArrowLeft':
                rocket.startThrust('side', -1);
                break;
            case 'ArrowRight':
                rocket.startThrust('side', 1);
                break;
            default:
                rocket.stopThrust('side');
        }
    });

    window.addEventListener('keyup', (event: KeyboardEvent): void => {
        rocket.stopThrust('side');
    });

    return rocket;
}

function main(size: geometry.size.Size): void {
    const planet: Ball = new Ball(100, '#0033ff', 1000000);
    planet.position = { x: 400, y: 400 };

    const rocket: Rocket = createRocket(400, 300);
    const stars: Ball[] = createStars(100, size);
    const stage: animation.stage.Stage = createStage(planet, rocket, stars, size);
    const animator: animation.animator.Animator = createAnimator(planet, rocket, stage);

    animator.start();
}

main({ width: 1024, height: 1024 });
