import * as geometry from '@apestaartje/geometry';

import { IAsset } from 'app/animation/stage/IAsset';
import { IAssetConfig } from 'app/animation/stage/IAssetConfig';
import { Canvas } from 'app/dom/element/Canvas';

export class Layer {
    private _assetConfigs: Array<IAssetConfig> = [];
    private _canvas: Canvas;
    private _isFrozen: boolean = false;
    private _isRendered: boolean = false;

    constructor(container: HTMLElement, size: geometry.size.Size) {
        this._canvas = new Canvas(size, 'c-layer');
        this._canvas.appendTo(container);
    }

    public addAsset(asset: IAsset, id: string, depth: number): void {
        const assetConfigs: Array<IAssetConfig> = this._assetConfigs.concat({
            asset,
            depth,
            id
        });

        assetConfigs.sort((a: IAssetConfig, b: IAssetConfig): number => {
            if (a.depth < b.depth) {
                return -1;
            }

            if (a.depth > b.depth) {
                return 1;
            }

            return 0;
        });

        this._assetConfigs = assetConfigs;
    }

    public removeAsset(id: string): void {
        this._assetConfigs = this._assetConfigs.filter((assetConfig: IAssetConfig): boolean => {
            return assetConfig.id !== id;
        });
    }

    public getAsset(id: string): IAsset | undefined {
        const assetConfig: IAssetConfig | undefined = this._assetConfigs.find((config: IAssetConfig): boolean => {
            return config.id === id;
        });

        if (assetConfig === undefined) {
            throw new Error(`Could not find asset with id "${id}"`);
        }

        return assetConfig.asset;
    }

    public render(): void {
        if (this._isFrozen && this._isRendered) {
            return;
        }

        this._canvas.clear();

        this._assetConfigs.forEach((assetConfig: IAssetConfig): void => {
            assetConfig.asset.render(this._canvas.context);
        });

        this._isRendered = true;
    }

    public freeze(isFrozen: boolean = true): void {
        this._isFrozen = isFrozen;
    }

    public isFrozen(): boolean {
        return this._isFrozen;
    }
}
