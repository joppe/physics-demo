import { Animator } from 'app/animation/animator/Animator';
import { Stage } from 'app/animation/stage/Stage';
import { Counter } from 'app/demo/Counter';
import { Square } from 'app/demo/Square';

const stage: Stage = new Stage(window.document.body, { width: 800, height: 600 });

stage.getLayer('root').addAsset(
    new Square(
        {
            topLeft: {
                x: 30,
                y: 60
            },
            bottomRight: {
                x: 400,
                y: 129
            }
        },
        'green'
    ),
    'square',
    1
);
stage.getLayer('root').freeze();

stage.addLayer('top', 1000);
stage.getLayer('top').addAsset(
    new Counter(
        {
            x: 0,
            y: 50
        },
        '48px serif',
        'black'
    ),
    'fps',
    1000
);
stage.getLayer('top').freeze();

const animator: Animator = new Animator((): boolean => {
    stage.render();

    return true;
});

animator.start();
