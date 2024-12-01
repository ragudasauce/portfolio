import {
    ALLOWABLE_VALUES,
    DEFAULT_VALUE,
} from '../constants/property.name.constants.mjs';
import { sanitizeObject } from './object.utilitites.mjs';

const requiredKeys = new Set().add(DEFAULT_VALUE);
const optionalKeys = new Set().add(ALLOWABLE_VALUES);
const message = {
    descriptor: `Aria missing one or more required properties: ${Array.from(requiredKeys).join('|')}`,
};

export function createAriaDescriptor(descriptor = {}) {
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
