// import { describe, expect, test } from 'vitest';
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
import { expect } from '@wdio/globals';


describe('The Attribute Utillities Module', function() {
    describe('the convertCamelToKebabCase method', function() {
        it('should convert the camelCaseString to a kebab-case-string', function() {
            const string = 'thisIsACamelString';
            const expected = 'this-is-a-camel-string';
            const result = convertCamelToKebabCase(string);
            expect(result).toEqual(expected);
        });
    });

    describe('the convertKebabToCamelCase method', function() {
        it('should convert a kebab-case-string to a camelCaseString', function() {
            const string = 'this-is-a-camel-string';
            const expected = 'thisIsACamelString';
            const result = convertKebabToCamelCase(string);
            expect(result).toEqual(expected);
        });
    });

    describe('the createIDLName method', function() {
        it('should convert a kebab-case-string to camelCase', function() {
            let string = 'test-string';
            let result = createIDLName(string);
            let expected = 'testString';
            expect(result).toBe(expected);

            string = 'test-string-more-kebab';
            result = createIDLName(string);
            expected = 'testStringMoreKebab'
            expect(result).toBe(expected);
        });

        it('should convert a snake case string to camel case', function() {
            let string = 'test_string';
            let result = createIDLName(string);
            let expected = 'testString';
            expect(result).toBe(expected);

            string = 'test_string_more_kebab';
            result = createIDLName(string);
            expected = 'testStringMoreKebab'
            expect(result).toBe(expected);
        })

        it('should convert a string with spaces to camelCase', function() {
            let string = 'test string';
            let result = createIDLName(string);
            let expected = 'testString';
            expect(result).toBe(expected);

            string = 'test string more kebab';
            result = createIDLName(string);
            expected = 'testStringMoreKebab'
            expect(result).toBe(expected);
        })

        it('should convert a mixed case string to camelCase', function() {
            let string = 'test_string';
            let result = createIDLName(string);
            let expected = 'testString';
            expect(result).toBe(expected);

            string = 'test_string-more kebab';
            result = createIDLName(string);
            expected = 'testStringMoreKebab'
            expect(result).toBe(expected);
        })

        it('should have no effect on a camelCase string', function() {
            let string = 'testString';
            let result = createIDLName(string);
            expect(result).toBe(string);
        });

        it('should have no effect on a string with only letters', function() {
            let string = 'test';
            let result = createIDLName(string);
            expect(result).toBe(string);
        });
    })

    describe('the formatAttributeName function', function() {
        it('should return an unchanged string if the string is a default string', function() {
            const string = 'attribute';
            const expected = string;
            const result = formatAttributeName(string);
            expect(result).toBe(expected);
        });

        it('should return an unchanged string if the string is a camelCase string', function() {
            const string = 'attributeString';
            const expected = string;
            const result = formatAttributeName(string);
            expect(result).toBe(expected);
        });

        it('should return a camelCase string if a kebab-case-string was passed', function() {
            const string = 'attribute-string';
            const expected = 'attributeString';
            const result = formatAttributeName(string);
            expect(result).toBe(expected);
        });

        it('should throw an error if an attribute does not meet kebab, camel, or single word crtesteria', function() {
            const expected = new Error(errorMessages.FORMAT);
            expect(function(){ formatAttributeName('some string')}).toThrow(
                expected
            );
        });
    });

    describe('the isCamelCase function', function() {
        it('should return true when the input is camelCase', function() {
            const input = 'thisIsCorrect';
            const result = isCamelCase(input);
            const expected = true;
            expect(result).toBe(expected);
        });

        it('should return false when the input is not camelCase', function() {
            expect(isCamelCase('this-is-not-camel')).toBe(false);
        });
    });

    describe('the isKebabCase function', function() {
        it('should return true when the input is kebab-case', function() {
            // expect(isKebabCase('this-is-also-correct')).toBeTruthy();
            expect(isKebabCase('this-correct')).toBeTruthy();
        });

        it('should return false when the input is not kebab-case', function() {
            let input = 'thisIsNotCorrect';
            let result = isKebabCase(input);
            const expected = false;
            expect(result).toBe(expected);

            input = 'this is not correct';
            result = isKebabCase(input);
            expect(result).toBe(expected);
        });
    });

    describe('the isDefault function', function() {
        it('should return true when the input is a single, lowercase word', function() {
            const input = 'thisiscorrect';
            const result = isDefaultCase(input);
            const expected = true;
            expect(result).toBe(expected);
        });

        it('should return false when the input is not a single, lowercase word', function() {
            let input = 'thisIsNotCorrect';
            let result = isDefaultCase(input);
            const expected = false;
            expect(result).toBe(expected);

            input = 'more than one word';
            result = isDefaultCase(input);
            expect(result).toBe(expected);
        });
    });

    describe('the createAttributeDescription function', function() {
        it('should return an object to set data properties', function() {
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
        
        it('should return an object to set accessor properties', function() {
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

        it('should return a data property if both data and accessor properties are sent', function() {
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
