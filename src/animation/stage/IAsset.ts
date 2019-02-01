/**
 * An Asset that can be rendered on a Canvas element
 */
export interface IAsset {
    cleanup(): boolean;

    render(context: CanvasRenderingContext2D): void;
}
