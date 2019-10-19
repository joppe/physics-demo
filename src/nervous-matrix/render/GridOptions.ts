import * as geometry from '@apestaartje/geometry';

import { Mapping } from '@nervous-matrix/Mapping';
import { Matrix } from '@nervous-matrix/matrix/Matrix';

export interface GridOptions {
    container: HTMLElement;
    matrix: Matrix;
    mapping: Mapping;
    cols: number;
    rows: number;
    size: geometry.size.Size;
}
