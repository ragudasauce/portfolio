import { sanitizeObject } from './object.utilitites.mjs';
/**
 * @typedef { object } StateDescriptor
 * @property { boolean } [isDefault]
 * @property { string } [associatedAriaState=null]
 * @property { string } [ariaValue]
 */

import {
    ASSOCIATED_ARIA_PROPERTY,
    ARIA_VALUE,
    NAME,
    DEFAULT_ENABLED,
} from '../constants/property.name.constants.mjs';

const defaults = { [DEFAULT_ENABLED]: false };
const requiredKeys = new Set().add(NAME).add(DEFAULT_ENABLED);
const optionalKeys = new Set().add(ASSOCIATED_ARIA_PROPERTY).add(ARIA_VALUE);
const message = {
    descriptor: `Missing one or more required properties: ${Array.from(requiredKeys).join('|')}`,
};

/**
 *
 * @param {object} descriptor
 * @returns {StateDescriptor}
 */
export function createStateDescriptor(descriptor = {}) {
    const merged = Object.assign(defaults, descriptor);
    const sanitizedDescriptor = sanitizeObject(
        Array.from(requiredKeys.union(optionalKeys)),
        merged
    );
    const sanitizedKeys = new Set(Object.keys(sanitizedDescriptor));
    const requiredSet = sanitizedKeys.intersection(requiredKeys);

    if (requiredSet.size === requiredKeys.size) {
        return sanitizedDescriptor;
    }

    throw new Error(message.descriptor);
}
