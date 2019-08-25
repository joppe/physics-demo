import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';
import * as graph from '@apestaartje/graph';
import * as number from '@apestaartje/number';

/**
 * Create a graph
 */

const g: graph.Graph = new graph.Graph({
    size: {
        height: 600,
        width: 600,
    },
    root: <HTMLElement>document.querySelector('body'),
});

g.setRange(
    {
        min: 0,
        max: 600,
    },
    {
        min: -300,
        max: 300,
    }
);
g
    .drawGrid(50, 50)
    .drawXAxis()
    .drawYAxis()
    .drawYLabels(50)
    .drawXLabels(100);

g.render();

let x: number = 0;
const amplitude: number = 400;

const anim: animation.animator.Animator = new animation.animator.Animator((): boolean => {
    const point: geometry.point.Point = {
        x,
        y: (Math.sin((x / 300) * Math.PI) * 300) + 0,
    };

    g.plot(point);

    x += 1;

    if (x >= 600) {
        return false;
    }

    return true;
});

anim.start();
