import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';
import * as graph from '@apestaartje/graph';
import * as number from '@apestaartje/number';

/**
 * Create a graph
 */

const g: graph.Graph = new graph.Graph({
   height: 600,
   width: 600
});

g
    .drawGrid(50, 50)
    .drawXAxis()
    .drawYAxis()
    .drawYLabels(50)
    .drawXLabels(100);

g.render(document.querySelector('body'));

function sinus(xRange: number.range.Range, xOffset: number, yOffset: number, step: number, amplitude: number): Iterable<geometry.point.Point> {
    return {
        // tslint:disable-next-line function-name
        [Symbol.iterator](): Iterator<geometry.point.Point> {
            let x: number = xRange.min;

            return {
                next(): IteratorResult<geometry.point.Point> {
                    const point: geometry.point.Point = {
                        x: xOffset + x,
                        y: (Math.sin((x / 300) * Math.PI) * amplitude) + yOffset
                    };

                    x += step;

                    return {
                        value: point,
                        done: x > xRange.max
                    };
                }
            };
        }
    };
}

let offset: number = 0;

const anim: animation.animator.Animator = new animation.animator.Animator((): boolean => {
    g.plot(sinus(
        { min: -600, max: 600},
        offset % 600,
        300,
        10,
        300
    ));

    offset += 10;

    return true;
});

anim.start();
