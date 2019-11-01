import * as animation from '@apestaartje/animation';
import * as geometry from '@apestaartje/geometry';

import { Mapping } from '@nervous-matrix/Mapping';
import { NervousMatrix } from '@nervous-matrix/NervousMatrix';

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
const matrix: NervousMatrix = new NervousMatrix({
    cols: 6,
    rows: 6,
    distance: 100,
    displacement: 120,
    offset: 50,
    c: 0.8,
    k: 8,
    mapping,
    size,
    container,
});

const stage: animation.stage.Stage = new animation.stage.Stage(container, size);
stage
    .createLayer('foreground', 10)
    .addAsset(matrix, 'matrix', 10);

const animator: animation.animator.Animator = new animation.animator.Animator((time: animation.animator.Chronometer): boolean => {
    stage.render(time);

    return true;
});

animator.start();
