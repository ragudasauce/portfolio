import { sanitizeObject } from "./object.utilitites.mjs";
/**
 * @typedef { object } StateDescriptor
 * @property { boolean } [isDefault]
 * @property { string } [associatedAriaState=null]
 * @property { string } [ariaValue]
 */

const configKeys = ['isDefault', 'associatedAriaState', 'ariaValue'];

/**
 *
 * @param {object} descriptor
 * @returns {StateDescriptor}
 */
export function createStateDescriptor(descriptor = {}) {
    return sanitizeObject(configKeys, descriptor)
}
