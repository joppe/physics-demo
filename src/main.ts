import * as array from '@apestaartje/array';
import * as geometry from '@apestaartje/geometry';
import * as number from '@apestaartje/number';
import * as animation from 'app/lib/animation';

import { position } from 'app/lib/physics/move/position';
import { Ball } from 'app/object/Ball';
import { Rocket } from 'app/object/Rocket';

function createStars(count: number, space: geometry.size.Size):  Array<Ball> {
    const stars: Array<Ball> = [];

    for (const index of array.iterator.range(1, count, 1)) {
        const star: Ball = new Ball(number.random(1, 2), '#ffff00', 1000000);

        star.position = {
            x: number.random(0, space.width),
            y: number.random(0, space.height)
        };

        stars.push(star);
    }

    return stars;
}

function createStage(planet: Ball, rocket: Rocket, stars: Array<Ball>, size: geometry.size.Size): animation.stage.Stage {
    const stage: animation.stage.Stage = new animation.stage.Stage(
        document.body,
        size
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

function createAnimator(rocket: Rocket, stage: animation.stage.Stage): animation.animator.Animator {
    return new animation.animator.Animator((time: animation.animator.Chronometer): boolean => {
        const dt: number = time.offset * 0.001;

        rocket.position = position(rocket.position, rocket.velocity, dt);

        stage.render();

        return true;
    });
}

function main(size: geometry.size.Size): void {
    const planet: Ball = new Ball(100, '#0033ff', 1000000);
    planet.position = { x: 400, y: 400 };

    const rocket: Rocket = new Rocket({ width: 12, height: 12 }, '#cccccc', 10);
    rocket.position = { x: 400, y: 300 };

    const stars: Array<Ball> = createStars(100, size);
    const stage: animation.stage.Stage = createStage(planet, rocket, stars, size);
    const animator: animation.animator.Animator = createAnimator(rocket, stage);

    animator.start();
}

main({ width: 1024, height: 1024 });
