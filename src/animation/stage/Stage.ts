import * as geometry from '@apestaartje/geometry';

import { ILayerConfig } from 'app/animation/stage/ILayerConfig';
import { Layer } from 'app/animation/stage/Layer';

export class Stage {
    private _container: HTMLElement;
    private _layerConfigs: Array<ILayerConfig> = [];
    private _size: geometry.size.Size;

    constructor(root: HTMLElement, size: geometry.size.Size) {
        this._size = size;

        this._container = window.document.createElement('div');
        this._container.style.width = `${this._size.width}px`;
        this._container.style.height = `${this._size.height}px`;
        this._container.classList.add('c-stage');
        root.appendChild(this._container);

        this.addLayer('root', 0);
    }

    public addLayer(id: string, depth: number): void {
        const layerConfigs: Array<ILayerConfig> = this._layerConfigs.concat({
            depth,
            id,
            layer: new Layer(this._container, this._size)
        });

        layerConfigs.sort((a: ILayerConfig, b: ILayerConfig): number => {
            if (a.depth < b.depth) {
                return -1;
            }

            if (a.depth > b.depth) {
                return 1;
            }

            return 0;
        });

        this._layerConfigs = layerConfigs;
    }

    public removeLayer(id: string): void {
        this._layerConfigs = this._layerConfigs.filter((layerConfig: ILayerConfig): boolean => {
            return layerConfig.id !== id;
        });
    }

    public getLayer(id: string): Layer | undefined {
        const layerConfig: ILayerConfig | undefined = this._layerConfigs.find((config: ILayerConfig): boolean => {
            return config.id === id;
        });

        if (layerConfig === undefined) {
            throw new Error(`Could not find layer with id "${id}"`);
        }

        return layerConfig.layer;
    }

    public render(): void {
        this._layerConfigs.forEach((layerConfig: ILayerConfig): void => {
            layerConfig.layer.render();
        });
    }
}
