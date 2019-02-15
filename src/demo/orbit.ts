import * as animation from '@apestaartje/animation';
import * as array from '@apestaartje/array';
import * as geometry from '@apestaartje/geometry';
import * as number from '@apestaartje/number';
import * as physics from '@apestaartje/physics';

import { Ball } from 'app/object/Ball';

const stage: animation.stage.Stage = new animation.stage.Stage(
    document.body,
    { width: 1024, height: 1024}
);

const staticLayer: animation.stage.Layer = stage.getLayer('root');
staticLayer.color = '#000000';
staticLayer.freeze(true);

const dynamicLayer: animation.stage.Layer = stage.createLayer('planet', 10);

const sun: Ball = new Ball(70, '#ff9900', 1000000);
sun.position = {
    x: 275,
    y: 200
};
staticLayer.addAsset(sun, 'sun', 10);

const planet: Ball = new Ball(10, '#0000ff', 1);
planet.position = {
    x: 200,
    y: 50
};
planet.velocity = {
    x: 80,
    y: 0
};
dynamicLayer.addAsset(planet, 'planet', 20);

for (const index of array.iterator.range(1, 100, 1)) {
    const star: Ball = new Ball(number.random(1, 2), '#ffff00', 1000000);

    star.position = {
        x: number.random(0, stage.size.width),
        y: number.random(0, stage.size.height)
    };

    staticLayer.addAsset(star, `star-${index}`, 5);
}

const animator: animation.animator.Animator = new animation.animator.Animator((time: animation.animator.Chronometer): boolean => {
    const dt: number = time.offset * 0.001;

    planet.position = geometry.vector.add(
        planet.position,
        geometry.vector.scale(planet.velocity, dt)
    );

    stage.render();

    const force: geometry.vector.Vector = physics.force.gravity.gravity(
        sun.mass,
        planet.mass,
        geometry.vector.subtract(planet.position, sun.position),
        1
    );
    const acceleration: geometry.vector.Vector = geometry.vector.scale(force, 1 / planet.mass);

    planet.velocity = geometry.vector.add(
        planet.velocity,
        geometry.vector.scale(acceleration, dt)
    );

    return true;
});

animator.start();

window.console.log(`The velocity of the planet: ${geometry.vector.length(planet.velocity)}`);
window.console.log(`
    The escape velocity of the planet: ${
        physics.force.gravity.escapeVelocity(sun.mass, geometry.vector.length(geometry.vector.subtract(planet.position, sun.position)), 1)
    }
`);
