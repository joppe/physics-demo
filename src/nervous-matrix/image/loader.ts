import {SelectHandler} from '@nervous-matrix/image/SelectHandler';

export function loader(container: HTMLElement, onSelect: SelectHandler): void {
    const input: HTMLInputElement = document.createElement('input');

    input.setAttribute('type', 'file');
    input.addEventListener('change', (event: Event): void => {
        const files: FileList | null = input.files;

        if (files === null || files.length === 0 || !files[0].type.match('image.*')) {
            onSelect(undefined);

            return;
        }

        const reader: FileReader = new FileReader();

        reader.addEventListener('load', (e: ProgressEvent): void => {
            const image: HTMLImageElement = document.createElement('img');

            image.addEventListener('load', (): void => {
                onSelect(image);
            });
            image.setAttribute('src', <string>(<FileReader>e.target).result);
        });

        reader.readAsDataURL(files[0]);
    });

    container.appendChild(input);
}
