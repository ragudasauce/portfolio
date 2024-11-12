import { default as Base } from './base.element.mjs';
import { describe, it, expect } from 'vitest';

describe('The SDKBaseElement', () => {
    it('should exist', () => {
        const component = new Base();
        expect(component).toBeTruthy();
    })
})