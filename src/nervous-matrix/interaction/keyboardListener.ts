import { Cell } from '@nervous-matrix/matrix/Cell';
import { Mapping } from '@nervous-matrix/Mapping';
import { Matrix } from '@nervous-matrix/matrix/Matrix';

export function keyboardListener(displacement: number, matrix: Matrix, mapping: Mapping): void {
    const keys: string[] = Object.keys(mapping);

    function  move(index: number): void {
        const cell: Cell = matrix.getCell(index);

        cell.topLine.push({ x: 0, y: -displacement });
        cell.bottomLine.push({ x: 0, y: displacement });
        cell.leftLine.push({ x: -displacement, y: 0 });
        cell.rightLine.push({ x: displacement, y: 0 });
    }

    function isAllowedKey(key: string): boolean {
        return keys.indexOf(key) !== -1;
    }

    window.addEventListener('keydown', (event: KeyboardEvent): void => {
        if (!isAllowedKey(event.key)) {
            return;
        }

        move(mapping[event.key]);
    });
}
