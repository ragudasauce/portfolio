import { describe, test, expect } from 'vitest';
import { createStateDescriptor } from './states.utilities.mjs';

describe('the state utilities', () => {
    describe('createDescriptor', () => {
        test('should return an empty descriptor', () => {
            expect(createStateDescriptor()).toEqual({});
        });
        test('should return an over-ridden default descriptor', () => {
            const descriptor = {
                isDefault: true,
                associatedAriaState: 'ariaDisabled',
            };

            expect(createStateDescriptor(descriptor)).toEqual(descriptor);
        });

        test('should only return a descriptor with allowable keys', () => {
            const descriptor = {
                isDefault: true,
                rickAndMorty: 'is great to watch',
            };
            const expected = {
                isDefault: true,
            };

            expect(createStateDescriptor(descriptor)).toEqual(expected);
        });
    });
});
