import { describe, expect, test } from 'vitest';
import {
    convertCamelToKebabCase,
    convertKebabToCamelCase,
    createAttributeDescription,
    createIDLName,
    errorMessages,
    formatAttributeName,
    isCamelCase,
    isDefaultCase,
    isKebabCase,
} from './attributes.utilities.mjs';

describe('The Attribute Utillities Module', () => {
    describe('the convertCamelToKebabCase method', () => {
        test('should convert the camelCaseString to a kebab-case-string', () => {
            const string = 'thisIsACamelString';
            const expected = 'this-is-a-camel-string';
            const result = convertCamelToKebabCase(string);
            expect(result).toEqual(expected);
        });
    });

    describe('the convertKebabToCamelCase method', () => {
        test('should convert a kebab-case-string to a camelCaseString', () => {
            const string = 'this-is-a-camel-string';
            const expected = 'thisIsACamelString';
            const result = convertKebabToCamelCase(string);
            expect(result).toEqual(expected);
        });
    });

    describe('the createIDLName method', () => {
        test('should convert a kebab-case-string to camelCase', () => {
            let string = 'test-string';
            let result = createIDLName(string);
            let expected = 'testString';
            expect(result).toBe(expected);

            string = 'test-string-more-kebab';
            result = createIDLName(string);
            expected = 'testStringMoreKebab'
            expect(result).toBe(expected);
        });

        test('should convert a snake case string to camel case', () => {
            let string = 'test_string';
            let result = createIDLName(string);
            let expected = 'testString';
            expect(result).toBe(expected);

            string = 'test_string_more_kebab';
            result = createIDLName(string);
            expected = 'testStringMoreKebab'
            expect(result).toBe(expected);
        })

        test('should convert a string with spaces to camelCase', () => {
            let string = 'test string';
            let result = createIDLName(string);
            let expected = 'testString';
            expect(result).toBe(expected);

            string = 'test string more kebab';
            result = createIDLName(string);
            expected = 'testStringMoreKebab'
            expect(result).toBe(expected);
        })

        test('should convert a mixed case string to camelCase', () => {
            let string = 'test_string';
            let result = createIDLName(string);
            let expected = 'testString';
            expect(result).toBe(expected);

            string = 'test_string-more kebab';
            result = createIDLName(string);
            expected = 'testStringMoreKebab'
            expect(result).toBe(expected);
        })

        test('should have no effect on a camelCase string', () => {
            let string = 'testString';
            let result = createIDLName(string);
            expect(result).toBe(string);
        })
        test('should have no effect on a string with only letters', () => {
            let string = 'test';
            let result = createIDLName(string);
            expect(result).toBe(string);
        });
    })

    describe('the formatAttributeName function', () => {
        test('should return an unchanged string if the string is a default string', () => {
            const string = 'attribute';
            const expected = string;
            const result = formatAttributeName(string);
            expect(result).toBe(expected);
        });

        test('should return an unchanged string if the string is a camelCase string', () => {
            const string = 'attributeString';
            const expected = string;
            const result = formatAttributeName(string);
            expect(result).toBe(expected);
        });
        test('should return a camelCase string if a kebab-case-string was passed', () => {
            const string = 'attribute-string';
            const expected = 'attributeString';
            const result = formatAttributeName(string);
            expect(result).toBe(expected);
        });
        test('should throw an error if an attribute does not meet kebab, camel, or single word crtesteria', () => {
            const expected = new Error(errorMessages.FORMAT);
            expect(() => formatAttributeName('some string')).toThrowError(
                expected
            );
        });
    });

    describe('the isCamelCase function', () => {
        test('should return true when the input is camelCase', () => {
            const input = 'thisIsCorrect';
            const result = isCamelCase(input);
            const expected = true;
            expect(result).toBe(expected);
        });
        test('should return false when the input is not camelCase', () => {
            expect(isCamelCase('this-is-not-camel')).toBe(false);
        });
    });

    describe('the isKebabCase function', () => {
        test('should return true when the input is kebab-case', () => {
            // expect(isKebabCase('this-is-also-correct')).toBeTruthy();
            expect(isKebabCase('this-correct')).toBeTruthy();
        });

        test('should return false when the input is not kebab-case', () => {
            let input = 'thisIsNotCorrect';
            let result = isKebabCase(input);
            const expected = false;
            expect(result).toBe(expected);

            input = 'this is not correct';
            result = isKebabCase(input);
            expect(result).toBe(expected);
        });
    });

    describe('the isDefault function', () => {
        test('should return true when the input is a single, lowercase word', () => {
            const input = 'thisiscorrect';
            const result = isDefaultCase(input);
            const expected = true;
            expect(result).toBe(expected);
        });
        test('should return false when the input is not a single, lowercase word', () => {
            let input = 'thisIsNotCorrect';
            let result = isDefaultCase(input);
            const expected = false;
            expect(result).toBe(expected);

            input = 'more than one word';
            result = isDefaultCase(input);
            expect(result).toBe(expected);
        });
    });

    describe('the createAttributeDescription function', () => {
        test('should return an object to set data properties', () => {
            const writable = true;
            const value = 2;
            const expected = {
                writable,
                value,
            };
            const result = createAttributeDescription({
                writable,
                value,
                someProp: 'not inluded',
            });
            expect(result).toEqual(expected);
        });
        test('should return an object to set accessor properties', () => {
            const result = createAttributeDescription({
                get() {
                    return this.value;
                },
                set(value) {
                    this.value = value;
                },
                someProp: 'not inluded',
            });

            // deep equality fails, because functions cannot be compared without failing.
            // instead - just confirm the keys are what we expect
            expect(Object.hasOwn(result, 'get')).toBe(true);
            expect(Object.hasOwn(result, 'set')).toBe(true);
            expect(Object.hasOwn(result, 'someProp')).toBe(false);
        });

        test('should return a data property if both data and accessor properties are sent', () => {
            const writable = true;
            const value = 2;
            const expected = {
                writable,
                value,
            };

            const result = createAttributeDescription({
                ...expected,
                get() {
                    return this.value;
                },
                set(value) {
                    this.value = value;
                },
                someProp: 'not inluded',
            })

            expect(result).toEqual(expected)
        });
    });
});
