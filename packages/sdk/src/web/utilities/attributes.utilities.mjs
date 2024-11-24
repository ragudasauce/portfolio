
const camelCasePattern = /^[a-z]+([A-Z][a-z]+)+$/;
const kebabCasePattern = /^[a-z]+(?:[-a-z0-9]+)+$/;
const standardPattern = /^[a-z]+$/;
const notAllowedPattern = /[-_\s]+\w/g;

/**
 * @enum { string }
 * @readonly
 */
export const errorMessages = {
    FORMAT: 'Attribute names must be either kebab-case, camelCase, or single lowercase words',
};

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
    const isKebab = isKebabCase(nameString);
    const isCamel = isCamelCase(nameString);
    const isDefault = isDefaultCase(nameString)
    console.log('NAME', nameString, isKebab, isCamel, isDefault)
    const check = new Set([isKebab,isCamel, isDefault]);

    if (check.size === 1) {
        throw new Error(errorMessages.FORMAT);
    }

    return isKebab ? convertKebabToCamelCase(nameString) : nameString;
}

export function createIDLName(nameString) {
    console.log(nameString)
    return nameString.replace(notAllowedPattern, (match) => {
        console.log(match)
        return match.replace(/[-_\s]/, '').toUpperCase();
    })
}

/**
 * Tests a string against the camelCase pattern.
 * @param {string} string
 * @returns {boolean}
 */
export function isCamelCase(string) {
    const match = camelCasePattern.exec(string);
    return match !== null;
}

/**
 * Tests a string against the default html pattern
 * @param {string} string
 * @returns {boolean}
 */
export function isDefaultCase(string) {
    const match = standardPattern.exec(string);
    return match !== null;
}

/**
 * Tests a string again kebab-case pattern.
 * @param {string} string
 * @returns {boolean}
 */
export function isKebabCase(string) {
    const match = kebabCasePattern.exec(string);
    return match !== null;
}

/**
 * @typedef { object } AttributeDescriptor
 * @property { boolean } [enumerable=false]
 * @property { boolean } [configurable=false]
 */

/**
 * @typedef { object } AttributeDataDescriptor
 * @extends {AttributeDescriptor}
 * @property { null | undefined | boolean | string | object | function } [value=undefined]
 * @property { boolean } [writable=false]
 */

/**
* @typedef { object } AttributeAccessorDescriptor
* @extends {AttributeDescriptor}
* @property { function } [get=undefined]
* @property { function } [set=undefined]

/**
 * 
 * @param {object} options 
 * @returns {AttributeDataDescriptor | AttributeAccessorDescriptor}
 */
export function createAttributeDescription(options) {
    const optionKeys = new Set(Object.keys(options));
    const descriptionKeys = new Set(['enumerable', 'configurable']);
    const dataKeys = new Set(['writable', 'value']);
    const accessorKeys = new Set(['get', 'set']);

    const isAccessor = accessorKeys.intersection(optionKeys).size > 0;
    let isData = dataKeys.intersection(optionKeys).size > 0;

    if ((isData && isAccessor) || (!isData && !isAccessor)) {
        isData = true;
    }

    const template = isData
        ? descriptionKeys.union(dataKeys)
        : descriptionKeys.union(accessorKeys);

    return Array.from(template).reduce((acc, key) => {
        if (Object.hasOwn(options, key)) {
            acc[key] = options[key];
        }
        return acc;
    }, {});
}
