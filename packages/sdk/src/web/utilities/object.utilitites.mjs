/** @module utilities/attributes */

// export function mergeObjects(...sourceObjects) {

// }

export function mergeToTemplate(templateObject, ...sourceObjects) {
    sourceObjects.map((obj) => structuredClone(obj));
}

/**
 * Removes keys that are not found in the template and returns a deep clone
 * @param { string[] } allowableKeys
 * @param { object } target
 */
export function sanitizeObject(allowableKeys, target) {
    return allowableKeys.reduce((acc, key) => {
        if (Object.hasOwn(target, key)) {
            acc[key] = structuredClone(target[key]);
        }
        return acc;
    }, {});
}
