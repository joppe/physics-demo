import { IAsset } from './IAsset';

/**
 * Configuration for adding an Asset to a Layer
 */

export interface IAssetConfig {
    asset: IAsset;
    depth: number;
    id: string;
}
