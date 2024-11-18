/** @module utilities/attributes */


export function mergeObjects(...sourceObjects) {

}

export function mergeToTemplate(templateObject, ...sourceObjects) {
    sourceObjects.map(obj => structuredClone(obj))
}

/**
 * Removes keys that are not found in the template
 * @param {*} template 
 * @param {*} target 
 */
export function sanitizeObject(template, target) {
    return Object.keys(template).reduce((acc, key) => {
        if (Object.hasOwn(target, key)) {
            acc[key] = structuredClone(template[key])
        }
        return acc;
    }, {})

}
