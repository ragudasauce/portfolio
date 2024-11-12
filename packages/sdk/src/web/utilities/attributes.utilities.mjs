/** @module utilities/attributes */

const camelCasePattern = /^[a-z]+(?:[A-Z][a-z]+)+$/g;
const kebabCasePattern = /^[a-z]+(?:-[a-z0-9]+)*$/g;
const standardPattern = /^[a-z]+$/g;


/**
 * Converts a camelCaseString to kebab-case-string based upon a delimiter.
 * @param {string} camelCaseString
 * @returns {string}
 */
export function convertCamelToKebabCase(camelCaseString) {
    return camelCaseString.replace(/[A-Z]/g, (match) => {
        return `-${match.toLowerCase()}`;
    });
}

/**
 * Converts a kebab-case-string to a camelCaseString.
 * @param {string} kebabString
 * @returns {string}
 */
export function convertKebabToCamelCase(kebabString) {
    return kebabString.replace(/-[a-z]/g, (match) => {
        return match.replace('-', '').toUpperCase();
    });
}

/**
 * Standardizes the attribute name to camelCase format.
 * @param {string} nameString
 * @returns {string}
 */
export function formatAttributeName(nameString) {
    const check = new Set([
        isKebabCase(nameString),
        isCamelCase(nameString),
        isDefault(nameString),
    ]);

    if (check.size === 1) {
        throw new Error('Attribute names must be either kebab-case, camelCase, or single lowercase words')
    }

    return isKebabCase(nameString)
        ? nameString
        : convertKebabToCamelCase(nameString)
}

/**
 * Tests a string against the camelCase pattern.
 * @param {string} string
 * @returns {boolean}
 */
export function isCamelCase(string) {
    return camelCasePattern.test(string);
}

/**
 * Tests a string against the default html pattern
 * @param {string} string
 * @returns {boolean}
 */
export function isDefault(string) {
    return standardPattern.test(string);
}

/**
 * Tests a string again kebab-case pattern.
 * @param {string} string
 * @returns {boolean}
 */
export function isKebabCase(string) {
    return kebabCasePattern.test(string);
}

export function createAttributeDescription(options) {
    let description = {
        enumerable: false,
        configurable: false
    };

    let data = {
        writable: false,
        value: undefined
    }

    let accessor = {
        get() {},
        set() {}
    }

    const optionKeys = Object.keys(options);
    console.log(optionKeys)
    let isData = optionKeys.some((item) => /writable|value/.test(item));
    const isAccessor = optionKeys.some((item) => /get|set/.test(item));

    if (isData && isAccessor || !isData && !isAccessor) {
        isData = true;
    }

    // const isData = new Set([
    //     Object.hasOwn(options, 'writable'),
    //     Object.hasOwn(options, 'value')
    // ])
}
