import * as animation from '@apestaartje/animation';
import * as dom from '@apestaartje/dom';
import * as geometry from '@apestaartje/geometry';

import { Grid } from '@nervous-matrix/render/Grid';
import { keyboardListener } from '@nervous-matrix/interaction/keyboardListener';
import { Mapping } from '@nervous-matrix/Mapping';
import { Matrix } from '@nervous-matrix/matrix/Matrix';

const COLS: number = 6;
const ROWS: number = 6;
const DISTANCE: number = 100;
const DISPLACEMENT: number = 60;
const OFFSET: number = 50;

const container: HTMLElement = <HTMLElement>document.querySelector('.js-container');
const size: geometry.size.Size = {
    width: 600,
    height: 600,
};
const mapping: Mapping = {
    1: 6,
    2: 7,
    3: 8,
    4: 11,
    5: 12,
    6: 13,
    7: 16,
    8: 17,
    9: 18,
};
const matrix: Matrix = new Matrix({
    c: 2,
    k: 15,
    mass: 1,
    cols: COLS,
    rows: ROWS,
    offset: OFFSET,
    distance: DISTANCE,
});
const grid: Grid = new Grid({
    container,
    matrix,
    mapping,
    cols: COLS,
    rows: ROWS,
    size,
});

keyboardListener(DISPLACEMENT, matrix, mapping);

const canvas: dom.element.Canvas = new dom.element.Canvas(size);
canvas.appendTo(container);

const animator: animation.animator.Animator = new animation.animator.Animator((time: animation.animator.Chronometer): boolean => {
    const dt: number = time.offset * 0.001;

    canvas.clear();
    grid.render(canvas.context);
    matrix.tick(dt);

    return true;
});

animator.start();

window.addEventListener('dblclick', (): void => {
    window.console.log('stop');
    animator.stop();
});
