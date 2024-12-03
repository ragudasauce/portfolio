/**
 * @typedef { object } ShadowRootOptions
 * @property { string } [mode]
 * @property { boolean } [clonable=false]
 * @property { boolean } [delegatesFocus=false]
 * @property { boolean } [serializeable=false]
 * @property { string } [slotAssignment='named']
 */

import {
    UPGRADABLE_PROPERTIES_SET,
    LAYOUT_ORIENTATION,
    ARIA_ORIENTATION,
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
    ARIA_VALUE,
} from '../constants/property.name.constants.mjs';
import { LAYOUT_ORIENTATION as LAYOUT_ORIENTATION_ATTR} from '../constants/attribute.name.constants.mjs';

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
     * @memberof SDKBaseHTMLElement
     * @param {HTMLTemplateElement | string } template
     */
    adoptHTML(template) {
        if (template === undefined) {
            return;
        }

        if (typeof template === 'string') {
            const htmlStr = template;
            template = document.createElement('template');
            template.innerHTML = htmlStr;
        }

        this[INTERNALS].shadowRoot.append(template.content.cloneNode(true));
    }

    /**
     * @memberof SDKBaseHTMLElement
     * @param {CSSStyleSheet[]} stylesheets
     */
    adoptStyleSheets(stylesheets) {
        if (stylesheets === undefined) {
            return;
        }
        this[INTERNALS].shadowRoot.adoptedStyleSheets = [...stylesheets];
    }

    /**
     * Creates the initial aria role, aria and custom states by
     * by applying the defaults saved in the internals map.
     */
    configureInternals() {
        for (const [
            /** @type {string} */ internalKey,
            /** @type {T} */ internalValue,
        ] of this[INTERNALS_MAP]) {
            if (internalKey.includes('aria') || internalKey === 'role') {
                this.manageAria(internalKey);
            }

            if (internalKey === 'states') {
                for (const [stateKey, stateDescriptor] of internalValue) {
                    const defaultEnabled = stateDescriptor[DEFAULT_ENABLED];
                    this.manageState(stateKey, defaultEnabled);
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
     * Applies a value to an aria-* property.
     * If the property has been registerd as an internal, if no value is passed, the default value is used.
     * Otherwise, the property will be unset via `null`.
     * @param {string} name
     * @param {string | null} [value=null]
     */
    manageAria(name, value = null) {
        const internalsMap = this[INTERNALS_MAP];

        if (internalsMap.has(name) && value === null) {
            value = internalsMap.get(name)[DEFAULT_VALUE];
        }

        this[INTERNALS][name] = value;
    }

    /**
     *
     * @param {string} name
     * @param {boolean} [force]
     */
    manageState(name, force = undefined) {
        // this needs to also work for states that have associated states.
        // e.g.: requesting, loading, updating might all be related.
        // only one of those can exist in the states array at a time.
        const state = this[INTERNALS_MAP].get('states').get(name);

        if (state === undefined) {
            return;
        }

        const states = this[INTERNALS].states;
        const hasState = states.has(name);
        const addCheck = Array.from(
            new Set([force === undefined && !hasState, force === true])
        ).includes(true);
        const key = addCheck ? 'add' : 'delete';

        states[key](name);

        const associatedAria = state[ASSOCIATED_ARIA_PROPERTY];
        if (associatedAria !== undefined) {
            const ariaValue = state[ARIA_VALUE] || addCheck.toString();
            this.manageAria(associatedAria, ariaValue)
        }
    }

    upgradeProperty(prop) {
        if (Object.hasOwn(this, prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    upgradeProperties() {
        Array.from(this[UPGRADABLE_PROPERTIES_SET]).forEach((prop) =>
            this.upgradeProperty(prop)
        );
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
                set(value) {
                    // should use validation validate
                    value === ''
                    ? this.removeAttribute(LAYOUT_ORIENTATION_ATTR)
                    : this.setAttribute(LAYOUT_ORIENTATION_ATTR, value);
                },
                get() {
                    return this.hasAttribute(LAYOUT_ORIENTATION_ATTR)
                        ? this.getAttribute(LAYOUT_ORIENTATION_ATTR)
                        : HORIZONTAL;
                },
            },
        },
    ],
};

export default createSDKElement(primitiveClass, config);
