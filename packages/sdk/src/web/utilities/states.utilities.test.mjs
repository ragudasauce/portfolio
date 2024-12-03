import {
    ASSOCIATED_ARIA_PROPERTY,
    DEFAULT_ENABLED,
    NAME,
} from '../constants/property.name.constants.mjs';
import { createStateDescriptor } from './states.utilities.mjs';
import { expect } from '@wdio/globals';

describe('the state utilities', function () {
    describe('createDescriptor', function () {
        // This test is for code that is no longer reachable.
        // it('should throw an error if required keys are missing', function () {
        //     expect(function () {
        //         createStateDescriptor();
        //     }).not.toThrow();
        //     expect(function () {
        //         createStateDescriptor({ [NAME]: 'rick' });
        //     }).not.toThrow();
        //     expect(function () {
        //         createStateDescriptor({ [DEFAULT_ENABLED]: true });
        //     }).not.toThrow();
        // });

        it('should return an object with a default enabled property', function () {
            const expected = {
                [DEFAULT_ENABLED]: false,
            };

            const result = createStateDescriptor();

            expect(result).toEqual(expected);
        });

        it('should only return a descriptor with allowable keys', function () {
            const descriptor = {
                [NAME]: 'rick',
                [DEFAULT_ENABLED]: true,
                family: 'morty, summer, beth',
                [ASSOCIATED_ARIA_PROPERTY]: 'ariaRequired',
            };
            const expected = {
                [DEFAULT_ENABLED]: true,
                [ASSOCIATED_ARIA_PROPERTY]: 'ariaRequired',
            };

            const result = createStateDescriptor(descriptor);

            expect(result).toEqual(expected);
        });
    });
});
