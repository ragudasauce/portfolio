import { sanitizeObject } from "./object.utilitites.mjs";
const configKeys = ['value'];

export function createAriaDescriptor(ariaConfig = {}) {
    return sanitizeObject(configKeys, ariaConfig)
}