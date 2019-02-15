/**
 * An Asset that can be rendered on a Canvas element
 */
export interface Asset {
    cleanup(): boolean;

    render(context: CanvasRenderingContext2D): void;
}
