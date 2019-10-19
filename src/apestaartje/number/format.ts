/**
 * Format a number with decimal separator and thousands grouping separator
 */

export type FormatFunction = (input: number, decimalCount?: number, decimalPoint?: string, thousandsSeperator?: string) => string;

// tslint:disable-next-line max-line-length
export const format: FormatFunction = (input: number, decimalCount: number = 2, decimalPoint: string = '.', thousandsSeperator: string = ','): string => {
    // Cast the number to a string with the desired decimals
    const str: string = input.toFixed(decimalCount);

    // Split the number in a integer and a fraction part
    const [integer, fraction]: string[] = str.split('.');
    const output: string[] = [];
    const length: number = integer.length;
    const rest: number = length % 3;

    if (length > 3) {
        output.push(integer.substr(0, rest));

        for (let i: number = rest; i < length; i += 3) {
            output.push(thousandsSeperator);
            output.push(integer.substr(i, 3));
        }
    } else {
        output.push(integer);
    }

    // Show a decimal char if needed
    if (decimalCount > 0) {
        output.push(decimalPoint);
        output.push(fraction);
    }

    return output.join('');
};
