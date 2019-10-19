import { Node } from '@nervous-matrix/spring/Node';

export interface Cell {
    topLine: Node;
    bottomLine: Node;
    leftLine: Node;
    rightLine: Node;
}
