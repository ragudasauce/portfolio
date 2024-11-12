import {
    convertCamelToKebabCase,
    formatAttributeName,
} from '../utilities/attributes.utilities.mjs';

/**
 * @typedef { object } AttributeOptions
 * @extends {AttributeDescriptor}
 * @param { boolean } observable
 * @property { null | undefined | boolean | string | object | function } value
 * @property { boolean } writable
 * @property { function } get
 * @property { function } set
 */

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
 */

/**
 * @extends HTMLElement
 */
export default class SDKBaseHTMLElement extends HTMLElement {
    observableAttributeSet = new Set();

    constructor() {
        super();
    }

    /**
     *
     * @param {*} attrName
     * @param { AttributeOptions } options
     * @returns { AttributeDataDescriptor | AttributeAccessorDescriptor }
     */
    // createPropertyDescription(options) {

    //     // let sanitized = {
    //     //     enumerable: false,
    //     //     configurable: false,
    //     //     writable: false,
    //     //     value: undefined
    //     // };

    //     // const accessorCheck = Array.from(
    //     //     new Set([
    //     //         Object.hasOwn(options, 'get()'),
    //     //         Object.hasOwn(options, 'set()'),
    //     //     ])
    //     // );

    //     // const dataCheck = Array.from(
    //     //     new Set([
    //     //         Object.hasOwn(options, 'value'),
    //     //         Object.hasOwn(options, 'writable'),
    //     //     ])
    //     // );

    //     // const check = new Set([
    //     //     accessorCheck.includes(true),
    //     //     dataCheck.includes(true),
    //     // ]);

    //     // if (
    //     //     check.size === 1 ||
    //     //     (check.size === 2 && Array.from(check)[1] === true)
    //     // ) {
    //     //     if (Object.hasOwn(options, 'value')) {
    //     //         sanitized.value = options.value;
    //     //     }
    //     //     if (Object.hasOwn(options, 'writable')) {
    //     //         sanitized.writable = options.writable;
    //     //     }
    //     // } else {
    //     //     if (Object.hasOwn(options, 'get')) {
    //     //         sanitized.get = options.get;
    //     //     }
    //     //     if (Object.hasOwn(options, 'set')) {
    //     //         sanitized.set = options.set;
    //     //     }
    //     // }

    //     return sanitized;
    // }

    /**
     *
     * @param {string} name
     * @param {AttributeOptions} options
     */
    createAttribute(name, options) {
        // const attrName = formatAttributeName(name);
        // const isObservable = options.observable === true;
        // const description = createPropertyDescription(options);

        // if (isObservable) {
        //     this.observableAttributeSet.add(attrName);
        // }

        // Object.defineProperty(this, attrName, {});

        // set [attrName]
        // idl?
        // reflects?
        // observed?
        // type? boolean | number | string
    }
}
