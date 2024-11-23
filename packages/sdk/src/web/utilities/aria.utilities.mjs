import { sanitizeObject } from "./object.utilitites.mjs";
const configKeys = ['allowableValues', 'isDefault', 'value'];

export function createAriaDescriptor(ariaConfig = {}) {
    return sanitizeObject(configKeys, ariaConfig)
}