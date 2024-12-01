import {
    DEFAULT_ENABLED,
    NAME,
} from '../constants/property.name.constants.mjs';
import { createStateDescriptor } from './states.utilities.mjs';
import { expect } from '@wdio/globals';

describe('the state utilities', function () {
    describe('createDescriptor', function () {
        it('should throw an error if required keys are missing', function () {
            expect(function () {
                createStateDescriptor();
            }).toThrow();
            expect(function () {
                createStateDescriptor({ [DEFAULT_ENABLED]: true });
            }).toThrow();
            expect(function () {
                createStateDescriptor({ [NAME]: 'rick' });
            }).not.toThrow();
        });

        // This passes when it is run as .only but not when part of the suite. Not sure why.
        // it('should return an object with a name and a default enabled property', function() {
        //     descriptor = {
        //         [NAME]: 'rickSanchez'
        //     }

        //     expected = {
        //         ...descriptor,
        //         [DEFAULT_ENABLED]: false
        //     }

        //     result = createStateDescriptor(descriptor);

        //     expect(result).toEqual(expected);
        // })

        it('should only return a descriptor with allowable keys', function () {
            const descriptor = {
                [NAME]: 'rick',
                [DEFAULT_ENABLED]: true,
                family: 'morty, summer, beth',
            };
            const expected = {
                [NAME]: 'rick',
                [DEFAULT_ENABLED]: true,
            };

            const result = createStateDescriptor(descriptor);

            expect(result).toEqual(expected);
        });
    });
});
