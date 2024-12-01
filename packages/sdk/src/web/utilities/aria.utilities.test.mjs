import {
    ALLOWABLE_VALUES,
    DEFAULT_ENABLED,
    DEFAULT_VALUE,
    NAME,
} from '../constants/property.name.constants.mjs';
import { createAriaDescriptor } from './aria.utilities.mjs';
import { expect } from '@wdio/globals';

describe('the aria utilities', function () {
    describe('createAriaDescriptor', function () {
        it('should throw an error if required keys are missing', function () {
            expect(function () {
                createAriaDescriptor();
            }).toThrow();
            expect(function () {
                createAriaDescriptor({ [ALLOWABLE_VALUES]: ['true', 'false'] });
            }).toThrow();
            expect(function () {
                createAriaDescriptor({ [DEFAULT_VALUE]: 'true' });
            }).not.toThrow();
        });

        it('should only return a descriptor with allowable keys', function () {
            const descriptor = {
                [DEFAULT_VALUE]: 'true',
                [ALLOWABLE_VALUES]: ['true', 'false'],
                [DEFAULT_ENABLED]: true,
                family: 'morty, summer, beth',
            };
            const expected = {
                [DEFAULT_VALUE]: 'true',
                [ALLOWABLE_VALUES]: ['true', 'false'],
            };

            const result = createAriaDescriptor(descriptor);

            expect(result).toEqual(expected);
        });
    });
});
