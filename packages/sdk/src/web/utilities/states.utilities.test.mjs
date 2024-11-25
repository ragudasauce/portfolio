import { createStateDescriptor } from './states.utilities.mjs';
import { expect } from '@wdio/globals';

describe('the state utilities', function() {
    describe('createDescriptor', function() {
        it('should throw an error if required keys are missing', function() {
            expect(function() {  createStateDescriptor();}).toThrow();
            expect(function() {  createStateDescriptor({ isDefault: true })}).toThrow();
            expect(function() {  createStateDescriptor({ name: 'rick'})} ).not.toThrow();
        });

        it('should only return a descriptor with allowable keys', function() {
            const descriptor = {
                name: 'rick',
                isDefault: true,
                family: 'morty, summer, beth',
            };
            const expected = {
                name: 'rick',
                isDefault: true,
            };

            expect(createStateDescriptor(descriptor)).toEqual(expected);
        });
    });
});
