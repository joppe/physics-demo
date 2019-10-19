import { Asset } from './Asset';

/**
 * Configuration for adding an Asset to a Layer
 */

export interface AssetConfig {
    asset: Asset;
    depth: number;
    id: string;
}
