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
    UPGRADABLE_PROPERTIES_SET,
    LAYOUT_ORIENTATION,
    ARIA_ORIENTATION,
    ARIA_MAP,
    INTERNALS,
    INTERNALS_MAP,
    DEFAULT_ENABLED,
    DEFAULT_VALUE,
    ALLOWABLE_VALUES,
    NAME,
    ASSOCIATED_ARIA_PROPERTY,
    OBSERVABLE,
    UPDATABLE,
    DESCRIPTOR,
} from '../constants/property.name.constants.mjs';
import {
    HORIZONTAL,
    UNDEFINED,
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
const primitiveClass = class SDKBaseHTMLElement extends HTMLElement {
    // Should these be on the base?
    // Will adding to the map effect all elements?
    // I think it will not, but we can test that.
    static [ARIA_MAP] = new Map();
    static [STATES_MAP] = new Map();
    static [UPGRADABLE_PROPERTIES_SET] = new Set();
    static [INTERNALS_MAP] = new Map();
    /**
     *
     * @param {InstanceOptions} config
     */
    constructor(config = {}) {
        super();
        this[INTERNALS] = this.attachInternals();

        this.configureInternals();
        this.configureShadowRoot(config.shadowRootOptions);
        this.adoptHTML(config.html);
        this.adoptStyleSheets(config.styles);
    }

    /**
     *
     * @param {HTMLTemplateElement | string } template
     */
    adoptHTML(template) {
        if (template !== undefined) {
            if (typeof template === 'string') {
                template = document.createElement('template');
                template.content.append(template);
            }
            this[INTERNALS].shadowRoot.append(template.content.cloneNode(true));
        }
    }

    /**
     * @memberof SDKBaseHTMLElement
     * @param {CSSStyleSheet[]} stylesheets
     */
    adoptStyleSheets(stylesheets) {
        if (stylesheets) {
            this[INTERNALS].shadowRoot.adoptedStyleSheets = [...stylesheets];
        }
    }

    /**
     * Creates the initial aria role, aria and custom states by
     * by applying the defaults saved in the internals map.
     */
    configureInternals() {
        const internalsMap = this[INTERNALS_MAP];
        if (internalsMap !== undefined) {
            for (const [
                /** @type {string} */ internalKey,
                /** @type {T} */ internalValue,
            ] of internalsMap.entries()) {
                if (internalKey.includes('aria') || internalKey === 'role') {
                    this.manageAria(internalKey);
                    return;
                }

                if (internalKey === 'states') {
                    Object.entries(internalValue).forEach((state) => {
                        this.manageState(
                            state[NAME],
                            state[DEFAULT_ENABLED] === true
                        );
                    });
                    return;
                }
            }
        }
    }

    /**
     * Configures the shadow root
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
     * Applies a value to a configured aria-* property
     * If no value is passed, the default is used.
     * @param {string} name
     * @param {string} [value]
     */
    manageAria(name, value) {
        const internalsMap = this[INTERNALS_MAP];

        if (internalsMap.has(name)) {
            value =
                value === undefined
                    ? internalsMap.get(name)[DEFAULT_VALUE]
                    : value;
            this[INTERNALS][name] = value;
        }
    }

    /**
     *
     * @param {string} name
     * @param {boolean} [force]
     */
    manageState(name, force = undefined) {
        // this needs to also work for states that have values.
        const states = this[INTERNALS].states;
        const hasState = states.has(name);
        const addCheck = Array.from(
            new Set([force === undefined && !hasState, force === true])
        ).includes(true);
        const key = addCheck ? 'add' : 'delete';

        states[key](name);

        // should also apply the aria if asociated.
    }

    // applyDefaultStates() {
    //     this[STATES_MAP].entries()
    //         .reduce((acc, entry) => {
    //             const name = entry[0];
    //             const options = entry[1];
    //             if (options.isDefault === true) {
    //                 acc.push(name);
    //             }
    //             return acc;
    //         }, [])
    //         .forEach((state) => {
    //             this.manageState(state, true);
    //         });
    // }

    // applyDefaultAria() {
    //     this[ARIA_MAP].entries().forEach((entry) => {
    //         const name = entry[0];
    //         const value = entry[1];
    //         this.manageAria(name, value);
    //     });
    // }

    upgradeProperty(prop) {
        if (Object.hasOwn(this, prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    upgradeProperties() {
        if (this[UPGRADABLE_PROPERTIES_SET] !== undefined) {
            // console.log(
            //     'UPGRADABLE PROPERTIES',
            //     this[UPGRADABLE_PROPERTIES_SET]
            // );
            Array.from(this[UPGRADABLE_PROPERTIES_SET]).forEach((prop) =>
                this.upgradeProperty(prop)
            );
        }
    }

    connectedCallback() {
        this.upgradeProperties();
    }
};

const config = {
    internals: {
        [ARIA_ORIENTATION]: {
            [DEFAULT_VALUE]: HORIZONTAL,
            [ALLOWABLE_VALUES]: [HORIZONTAL, VERTICAL, UNDEFINED],
        },
    },
    attributes: [
        {
            [NAME]: LAYOUT_ORIENTATION,
            [OBSERVABLE]: true,
            [UPDATABLE]: true,
            [ALLOWABLE_VALUES]: [HORIZONTAL, VERTICAL],
            [DEFAULT_VALUE]: HORIZONTAL,
            [ASSOCIATED_ARIA_PROPERTY]: ARIA_ORIENTATION,
            [DESCRIPTOR]: {
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
