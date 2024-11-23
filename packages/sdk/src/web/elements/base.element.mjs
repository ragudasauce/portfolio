/**
 * @typedef { object } ShadowRootOptions
 * @property { string } [mode]
 * @property { boolean } [clonable=false]
 * @property { boolean } [delegatesFocus=false]
 * @property { boolean } [serializeable=false]
 * @property { string } [slotAssignment='named']
 */

import {
    STATES_MAP,
    UPGRADABLE_PROPERTIES,
    LAYOUT_ORIENTATION,
    ARIA_ORIENTATION,
} from '../constants/property.name.constants.mjs';
import {
    HORIZONTAL,
    VERTICAL,
} from '../constants/attribute.value.constants.mjs';
import { createSDKElement } from './element.function.mjs';

/**
 * @typedef { object } StateOptions
 * @property { boolean } isBoolean=true
 * @property { string[] } [values]
 * @property { boolean } [isDefault=false]
 * @property { string | boolean } [defaultValue]
 * @property { object } [ariaProperty]
 */

/**
 * @typedef { object } InstanceOptions
 * @property { ShadowRootOptions } [shadowRootOptions]
 * @property { string | HTMLTemplateElement } [html]
 * @property { string | CSSStyleSheet[] } [styles]
 */

/**
 * @extends HTMLElement
 * @method { function } adoptHTML
 */
// export default class SDKBaseHTMLElement extends HTMLElement {
//     #statesMap = new Map();
//     #observableAttributesSet = new Set();
//     #updatablePropertiesSet = new Set();

//     /**
//      * @implements ShadowRootOptions
//      */
//     #shadowRootOptions = {
//         mode: 'closed',
//         clonable: false,
//         delegatesFocus: false,
//         serializeable: false,
//         slotAssignment: 'named',
//     };

//     /**
//      * @implements StateOptions
//      */
//     #stateOptions = {
//         isBoolean: true,
//         values: [true, false],
//         isDefault: false,
//         defaultValue: false,
//         ariaProperty: {},
//     };

//     /**
//      *
//      * @param {InstanceOptions} config
//      */
//     constructor(config = {}) {
//         super();
//         this.internals = this.attachInternals();

//         this.configureShadowRoot(config.shadowRoot);
//         this.adoptHTML(config.html);
//         this.adoptStyleSheets(config.stylesheets);
//     }

//     /**
//      *
//      * @param {HTMLTemplateElement} template
//      */
//     adoptHTML(template) {
//         if (template !== undefined) {
//             this.shadowRoot.append(template.content.cloneNode(true));
//         }
//     }

//     /**
//      * @memberof SDKBaseHTMLElement
//      * @param {*} stylesheets
//      */
//     adoptStyleSheets(stylesheets) {
//         if (stylesheets) {
//             this.shadowRoot.adoptedStyleSheets = [...stylesheets];
//         }
//     }

//     /**
//      *
//      * @param {ShadowRootOptions} options
//      */
//     configureShadowRoot(options) {
//         if (options === undefined) {
//             options = this.#shadowRootOptions;
//         }
//         this.attachShadow(options);
//     }

//     /**
//      *
//      * @param {string} name
//      * @param {StateOptions} options
//      */
//     defineState(name, options) {
//         this.#statesMap.set(name, this.defineStateOptions(options));
//     }

//     /**
//      *
//      * @param {StateOptions} options
//      * @returns {StateOptions}
//      */
//     defineStateOptions(options) {
//         if (options === undefined) {
//             return this.#stateOptions;
//         }

//         return Object.keys(this.#stateOptions).reduce((acc, key) => {
//             acc[key] = Object.hasOwn(options, key)
//                 ? options[key]
//                 : this.#stateOptions[key];
//             return acc;
//         }, {});
//     }

//     /**
//      *
//      * @param {string[]} attributeNames
//      */
//     defineObservableAttributes(attributeNames) {
//         attributeNames.forEach((name) =>
//             this.#observableAttributesSet.add(name)
//         );
//     }

//     /**
//      *
//      * @param {string[]} propertyNames
//      */
//     defineUpgradableProperties(propertyNames) {
//         propertyNames.forEach((name) => this.#updatablePropertiesSet.add(name));
//     }

//     /**
//      *
//      * @returns {Set<string>}
//      */
//     retrieveObservableAttributes() {
//         return this.#observableAttributesSet;
//     }

//     /**
//      *
//      * @param {string} name
//      * @param {boolean} [force]
//      */
//     manageState(name, force) {
//         // this needs to also work for states that have values.
//         const states = this.internals.states;
//         const hasState = states.has(name);
//         const addCheck = Array.from(
//             new Set([force === undefined && !hasState, force === true])
//         ).includes(true);
//         const key = addCheck ? 'add' : 'delete';

//         states[key](name);
//     }

//     applyDefaultStates() {
//         this.#statesMap
//             .entries()
//             .reduce((acc, entry) => {
//                 const name = entry[0];
//                 const options = entry[1];
//                 if (options.isDefault === true) {
//                     acc.push(name);
//                 }
//                 return acc;
//             }, [])
//             .forEach((state) => {
//                 this.manageState(state, true);
//             });
//     }

//     upgradeProperty(prop) {
//         if (Object.hasOwn(this, prop)) {
//             let value = this[prop];
//             delete this[prop];
//             this[prop] = value;
//         }
//     }

//     upgradeProperties() {
//         Array.from(this.#updatablePropertiesSet).forEach((prop) =>
//             this.upgradeProperty(prop)
//         );
//     }

//     connectedCallback() {
//         this.upgradeProperties();
//         this.applyDefaultStates();
//     }
// }

/**
 * @extends HTMLElement
 * @method { function } adoptHTML
 */
const primitiveClass = class SDKBaseHTMLElement extends HTMLElement {
    /**
     *
     * @param {InstanceOptions} config
     */
    constructor(config = {}) {
        super();
        this.internals = this.attachInternals();

        this.configureShadowRoot(config.shadowRootOptions);
        this.adoptHTML(config.html);
        this.adoptStyleSheets(config.stylesheets);
    }

    /**
     *
     * @param {HTMLTemplateElement} template
     */
    adoptHTML(template) {
        if (template !== undefined) {
            this.shadowRoot.append(template.content.cloneNode(true));
        }
    }

    /**
     * @memberof SDKBaseHTMLElement
     * @param {CSSStyleSheet[]} stylesheets
     */
    adoptStyleSheets(stylesheets) {
        if (stylesheets) {
            this.shadowRoot.adoptedStyleSheets = [...stylesheets];
        }
    }

    /**
     *
     * @param {ShadowRootOptions} options
     */
    configureShadowRoot(
        options = {
            mode: 'closed',
            clonable: false,
            delegatesFocus: false,
            serializeable: false,
            slotAssignment: 'named',
        }
    ) {
        this.attachShadow(options);
    }

    /**
     *
     * @param {string} name
     * @param {boolean} [force]
     */
    manageState(name, force) {
        // this needs to also work for states that have values.
        const states = this.internals.states;
        const hasState = states.has(name);
        const addCheck = Array.from(
            new Set([force === undefined && !hasState, force === true])
        ).includes(true);
        const key = addCheck ? 'add' : 'delete';

        states[key](name);
    }

    applyDefaultStates() {
        this[STATES_MAP].entries()
            .reduce((acc, entry) => {
                const name = entry[0];
                const options = entry[1];
                if (options.isDefault === true) {
                    acc.push(name);
                }
                return acc;
            }, [])
            .forEach((state) => {
                this.manageState(state, true);
            });
    }

    upgradeProperty(prop) {
        if (Object.hasOwn(this, prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    upgradeProperties() {
        Array.from(this[UPGRADABLE_PROPERTIES]).forEach((prop) =>
            this.upgradeProperty(prop)
        );
    }

    connectedCallback() {
        this.upgradeProperties();
        this.applyDefaultStates();
    }
};

const config = {
    // shadowRootOptions: {},
    // html: '',
    // styles: [],
    // states: []
    // aria: []
    attributes: [
        {
            name: LAYOUT_ORIENTATION,
            observable: true,
            allowableValues: [HORIZONTAL, VERTICAL],
            associatedAria: ARIA_ORIENTATION,
            descriptor: {
                enumerable: true,
                set(value) {
                    this.setAttribute(LAYOUT_ORIENTATION, value);
                },
                get() {
                    return this.hasAttribute(LAYOUT_ORIENTATION)
                        ? this.getAttribute(LAYOUT_ORIENTATION)
                        : HORIZONTAL;
                },
            },
        },
    ],
};

export default createSDKElement(primitiveClass, config);
