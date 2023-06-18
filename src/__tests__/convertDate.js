import {convertDate} from "../helper/convertDate.js";

describe('convertDate', () => {
    it('should throw error when parameter is not a string', () => {
        const expectError = 123;

        expect(() => convertDate(expectError)).toThrow('Parameter is not of type string');
    });

    it('should not throw error when parameter is a valid string', () => {
        const expectValid = '1 Janv. 2020';

        expect(() => convertDate(expectValid)).not.toThrow();
    });

    it('should correctly convert a date string', () => {
        const input = '1 Janv. 2020';
        const expectedOutput = new Date('Jan 1, 2020');

        expect(convertDate(input)).toEqual(expectedOutput);
    });
});
