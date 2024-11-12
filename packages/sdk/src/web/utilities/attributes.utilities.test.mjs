import { describe, expect, it } from 'vitest';
import {
    convertCamelToKebabCase,
    convertKebabToCamelCase,
    formatAttributeName,
    isCamelCase,
    isDefault,
    isKebabCase,
    createAttributeDescription
} from './attributes.utilities.mjs';

describe('The Attribute Utillities Module', () => {
    describe('the convertCamelToKebabCase method', () => {
        it('should convert the camelCaseString to a kebab-case-string', () => {
            const string = 'thisIsACamelString';
            const expected = 'this-is-a-camel-string';
            const result = convertCamelToKebabCase(string);
            expect(result).toEqual(expected);
        });
    });

    describe('the convertKebabToCamelCase method', () => {
        it('should convert a kebab-case-string to a camelCaseString', () => {
            const string = 'this-is-a-camel-string';
            const expected = 'thisIsACamelString';
            const result = convertKebabToCamelCase(string);
            expect(result).toEqual(expected);
        });
    });

    describe('the formatAttributeName function', () => {
        it('should return an unchanged string if the string is a default string', () => {
            const string = 'attribute';
            const expected = string;
            const result = formatAttributeName(string);
            expect(result).toBe(expected);
        });
        it('should return an unchanged string if the string is a camelCase string', () => {
            const string = 'attributeString';
            const expected = string;
            const result = formatAttributeName(string);
            expect(result).toBe(expected);
        });
        it('should return a camelCase string if a kebab-case-string was passed', () => {
            const string = 'attribute-string';
            const expected = 'attributeString';
            const result = formatAttributeName(string);
            expect(result).toBe(expected);
        });
    });

    describe('the isCamelCase function', () => {
        it('should return true when the input is camelCase', () => {
            const input = 'thisIsCorrect';
            const result = isCamelCase(input);
            const expected = true;
            expect(result).toBe(expected);
        });
        it('should return false when the input is not camelCase', () => {
            const input = 'this-is-not-camel';
            const result = isCamelCase(input);
            const expected = false;
            expect(result).toBe(expected);
        });
    });

    describe('the isKebabCase function', () => {
        it('should return true when the input is kebab-case', () => {
            const input = 'this-is-correct';
            const result = isKebabCase(input);
            const expected = true;
            expect(result).toBe(expected);
        });
        it('should return false when the input is not camelCase', () => {
            const input = 'thisIsNotCorrect';
            const result = isKebabCase(input);
            const expected = false;
            expect(result).toBe(expected);
        });
    });

    describe('the isDefault function', () => {
        it('should return true when the input is a single, lowercase word', () => {
            const input = 'thisiscorrect';
            const result = isDefault(input);
            const expected = true;
            expect(result).toBe(expected);
        });
        it('should return false when the input is not a single, lowercase word', () => {
            let input = 'thisIsNotCorrect';
            let result = isDefault(input);
            const expected = false;
            expect(result).toBe(expected);

            input = 'more than one word';
            result = isDefault(input);
            expect(result).toBe(expected);
        });
    });

    describe('the createAttributeDescription function', () => {
        it('should return an object to set data properties', () => {
            const result = createAttributeDescription({
                get() {
                    return this.value
                },
                set(value) {
                    this.value = value
                }
            })
            console.log(result)
        });
        it('should return an object to set accessor properties', () => {

        });

        it('should return a data property if both data and accessor properties are sent', () => {

        });
    })
});
