import * as geometry from '@apestaartje/geometry';

import { LineStyle } from '../line/LineStyle';

export interface GraphOptions {
    lineStyle?: Partial<LineStyle>;
    size: geometry.size.Size;
    root: HTMLElement;
}
