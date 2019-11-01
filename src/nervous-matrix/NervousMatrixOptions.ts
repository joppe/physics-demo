import * as geometry from '@apestaartje/geometry';

import { Mapping } from '@nervous-matrix/Mapping';

export interface NervousMatrixOptions {
    cols: number;
    rows: number;
    distance: number;
    displacement: number;
    offset: number;
    c: number;
    k: number;
    mapping: Mapping;
    size: geometry.size.Size;
    container: HTMLElement;
}
