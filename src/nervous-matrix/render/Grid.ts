import * as array from '@apestaartje/array';
import * as geometry from '@apestaartje/geometry';

import { Matrix } from '@nervous-matrix/matrix/Matrix';
import { Mapping } from '@nervous-matrix/Mapping';
import { line } from '@nervous-matrix/render/line';
import { Node } from '@nervous-matrix/spring/Node';
import { GridItem } from '@nervous-matrix/render/GridItem';
import { GridOptions } from '@nervous-matrix/render/GridOptions';
import { Cell } from '@nervous-matrix/matrix/Cell';

export class Grid {
    private readonly _matrix: Matrix;
    private readonly _mapping: Mapping;
    private readonly _items: GridItem[] = [];
    private readonly _size: geometry.size.Size;
    private _image: HTMLImageElement | undefined;

    public set image(image: HTMLImageElement | undefined) {
        this._image = image;
    }

    public constructor(options: GridOptions) {
        this._matrix = options.matrix;
        this._mapping = options.mapping;
        this._size = options.size;

        const total: number = (options.cols - 1) * (options.rows - 1);

        for (const index of array.iterator.range(0, total - 1, 1)) {
            const cell: Cell = this._matrix.getCell(index);

            this._items.push(
                {
                    index,
                    label: this.getLabel(options.mapping, index),
                    sx: cell.leftLine.position.x,
                    sy: cell.topLine.position.y,
                    sWidth: cell.rightLine.position.x - cell.leftLine.position.x,
                    sHeight: cell.bottomLine.position.y - cell.topLine.position.y,
                    get dx(): number {
                        return cell.leftLine.position.x;
                    },
                    get dy(): number {
                        return cell.topLine.position.y;
                    },
                    get dWidth(): number {
                        return cell.rightLine.position.x - cell.leftLine.position.x;
                    },
                    get dHeight(): number {
                        return cell.bottomLine.position.y - cell.topLine.position.y;
                    },
                },
            );
        }
    }

    public render(context: CanvasRenderingContext2D): void {
        if (this._image === undefined) {
            this.renderLines(context);
        } else {
            this.renderImage(context);
        }

        this.renderCells(context);
    }

    private renderLines(context: CanvasRenderingContext2D): void {
        const x: number = array.head(this._matrix.vertical).position.x;
        const y: number = this._matrix.horizontal[0].position.y;
        const width: number = array.last(this._matrix.vertical).position.x - x;
        const height: number = array.last(this._matrix.horizontal).position.y - y;

        this._matrix.horizontal.forEach((node: Node): void => {
            line(
                {
                    start: {
                        x,
                        y: node.position.y,
                    },
                    end: {
                        x: x + width,
                        y: node.position.y,
                    },
                },
                context,
            );
        });

        this._matrix.vertical.forEach((node: Node): void => {
            line(
                {
                    start: {
                        x: node.position.x,
                        y,
                    },
                    end: {
                        x: node.position.x,
                        y: y + height,
                    },
                },
                context,
            );
        });
    }

    private renderCells(context: CanvasRenderingContext2D): void {
        this._items.forEach((item: GridItem): void => {
            context.fillStyle = '#000000';
            context.font = 'bold 22px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(item.label, item.dx + (item.dWidth / 2), item.dy + (item.dHeight / 2));
        });
    }

    private renderImage(context: CanvasRenderingContext2D): void {
        if (this._image === undefined) {
            return;
        }

        const scale: number = this._image.width / this._size.width;

        this._items.forEach((item: GridItem): void => {
            context.drawImage(
                <HTMLImageElement>this._image,
                item.sx * scale,
                item.sy * scale,
                item.sWidth * scale,
                item.sHeight * scale,
                item.dx,
                item.dy,
                item.dWidth,
                item.dHeight,
            );
        });
    }

    private getLabel(mapping: Mapping, index: number): string {
        const keys: string[] = Object.keys(mapping);
        const values: number[] = Object.values(mapping);
        const found: number = values.findIndex((value: number) => {
            return index === value;
        });

        if (found === -1) {
            return '';
        }

        return keys[found];
    }
}
