import { sanitizeObject } from './object.utilitites.mjs';
/**
 * @typedef { object } StateDescriptor
 * @property { boolean } [isDefault]
 * @property { string } [associatedAriaState=null]
 * @property { string } [ariaValue]
 */

import { ASSOCIATED_ARIA_PROPERTY, ARIA_VALUE, IS_DEFAULT, NAME } from '../constants/property.name.constants.mjs';

const requiredKeys = new Set().add(NAME);
const optionalKeys = new Set()
    .add(IS_DEFAULT)
    .add(ASSOCIATED_ARIA_PROPERTY)
    .add(ARIA_VALUE);

const message = {
    descriptor: `Missing one or more required properties: ${Array.from(requiredKeys).join('|')}`,
};

/**
 *
 * @param {object} descriptor
 * @returns {StateDescriptor}
 */
export function createStateDescriptor(descriptor = {}) {
    const sanitizedDescriptor = sanitizeObject(
        Array.from(requiredKeys.union(optionalKeys)),
        descriptor
    );
    const sanitizedKeys = new Set(Object.keys(sanitizedDescriptor));
    const requiredSet = sanitizedKeys.intersection(requiredKeys);

    if (requiredSet.size === requiredKeys.size) {
        return sanitizedDescriptor;
    }

    throw new Error(message.descriptor);
}
