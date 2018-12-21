export interface IAsset {
    render(context: CanvasRenderingContext2D): void;

    cleanup(): boolean;
}
