import {
    convertCamelToKebabCase,
    createAttributeDescription,
    createIDLName,
} from '../utilities/attributes.utilities.mjs';
import { createStateDescriptor } from '../utilities/states.utilities.mjs';
import { createAriaDescriptor } from '../utilities/aria.utilities.mjs';
import {
    ARIA_MAP,
    OBSERVED_ATTRIBUTES,
    STATES_MAP,
    UPGRADABLE_PROPERTIES,
} from '../constants/property.name.constants.mjs';

/**
 * @typedef {import('../utilities/attributes.utilities.mjs').AttributeAccessorDescriptor } AttributeAccessorDescriptor
 * @typedef {import('../utilities/attributes.utilities.mjs').AttributeDataDescriptor} AttributeDataDescriptor
 */

/**
 * @typedef { object } AriaConfiguration
 * @property { string } role
 * @property { AriaPropertiesAndStates } propertiesAndStates
 */

/**
 * @typedef { object } AriaPropertiesAndStates
 * @property { string[] } allowableValues
 * @property { boolean } isDefault=false
 * @property { string } name
 * @property { string } value
 */

/**
 * @typedef { object } ShadowRootOptions
 * @property { string } [mode]
 * @property { boolean } [clonable=false]
 * @property { boolean } [delegatesFocus=false]
 * @property { boolean } [serializeable=false]
 * @property { string } [slotAssignment='named']
 */

/**
 * @typedef { object } StateConfiguration
 * @property {string} name
 * @param {StateDescriptor} [descriptor]
 */

/**
 * @typedef { object } StateDescriptor
 * @property { boolean } [isDefault]
 * @property { string } [associatedAria=null]
 * @property { string } [ariaValue]
 */

/**
 * @typedef { object } AttributeConfiguration
 * @property { string } name - The name of the property. The provided string witll be sanatized to include only alpha characters and converted to camelCase.
 * @property { boolean } [upgradable] - Whether or not the property should be redefined when the custom element upgrades
 * @property { boolean } [observable] - Whether or not the property will be included in the observableAttributes property and watched when the element responds to changes.
 * @property { string } [associatedAria]
 * @property { string[] | boolean[] } [allowableValues]
 * @property { AttributeDataDescriptor | AttributeAccessorDescriptor } [descriptor] - The configuration options for Object.defineProperty().
 */

/**
 * @typedef { object } ClassConfigOptions
 * @property { AriaConfiguration } [aria]
 * @property { ShadowRootOptions } [shadowRoot]
 * @property { string | HTMLTemplateElement } [html]
 * @property { string | CSSStyleSheet[] } [styles]
 * @property { string } [style]
 * @property { StateDescriptor[] } [states]
 * @property { AttributeConfiguration[] } [attributes]
 */

function configureAria(targetClass, ariaConfig = {}) {
    if (Object.keys(ariaConfig).length === 0) {
        return;
    }

    if (Object.hasOwn(ariaConfig, 'role') && !Object.hasOwn(targetClass, 'role')) {
        Object.defineProperty(targetClass, 'role', { value: ariaConfig.role });
    }

    if (Object.hasOwn(ariaConfig, 'propertiesAndStates')) {
        if (!Object.hasOwn(targetClass, ARIA_MAP)) {
            Object.defineProperty(targetClass, ARIA_MAP, {
                value: new Map(),
            });
        }

        ariaConfig.propertiesAndStates.forEach((propState) => {
            const descriptor = createAriaDescriptor(propState);
            targetClass[ARIA_MAP].set(propState.name, descriptor);
        });
    }
}

function configureProperties(targetClass, attributes = []) {
    if (attributes.length === 0) {
        return;
    }
    // NOTE: we may want to check the targetClass for observableAttributes
    // an upgradableProperties before we start re-assigning them below.

    // I am worried that extending a class that has these set may miss
    // properties set in the super.

    const observedAttributes = Object.hasOwn(targetClass, OBSERVED_ATTRIBUTES)
        ? new Set(targetClass[OBSERVED_ATTRIBUTES])
        : new Set();

    const upgradableProperties = Object.hasOwn(
        targetClass,
        UPGRADABLE_PROPERTIES
    )
        ? targetClass[UPGRADABLE_PROPERTIES]
        : new Set();

    // NOTE: not sure why Object.hasOwn() is only working with 'static' class fields
    // e.g.: class {
    //     fieldName <- won't show up
    //     static fieldName <- will show up.
    // }
    // This may be because we're looking at just the class and NOT instantiating it.

    // 'static' is actually a good choice since the idea would be that those fields wouldn't change
    // across instances.

    const properties = attributes.reduce((acc, attribute) => {
        const attributeIDLName = createIDLName(attribute.name);
        const isObservable = attribute.observable === true;
        const isUpgradable = attribute.upgradable === true;
        const descriptor = createAttributeDescription(attribute.descriptor);

        if (isObservable) {
            observedAttributes.add(convertCamelToKebabCase(attributeIDLName));
            acc[OBSERVED_ATTRIBUTES] = {
                get() {
                    return [...Array.from(observedAttributes)];
                },
            };
        }

        if (isUpgradable) {
            upgradableProperties.add(attributeIDLName);
            acc[UPGRADABLE_PROPERTIES] = {
                value: new Set().union(upgradableProperties),
            };
        }

        if (Object.hasOwn(descriptor, 'get')) {
            descriptor.get.bind(targetClass);
        }

        if (Object.hasOwn(descriptor, 'set')) {
            descriptor.set.bind(targetClass);
        }

        acc[attributeIDLName] = descriptor;

        return acc;
    }, {});

    Object.defineProperties(targetClass.prototype, properties);
}

function configureStates(targetClass, states = []) {
    if (states.length === 0) {
        return;
    }

    if (!Object.hasOwn(targetClass, STATES_MAP)) {
        Object.defineProperty(targetClass, STATES_MAP, { value: new Map() });
    }

    // states are either in the CustomStateSet or not
    // making states boolean.
    // States that are reflected to aria-states are also generally boolean,
    // though the aria-state should convert the boolean to a string.
    // a notable exception is 'aria-checked' which can also have the string 'mixed'
    // set, indicating an indeterminate state.

    // in such a case, the indeterminate state is boolean, with the string 'mixed'
    // associated to it.

    states.forEach((state) => {
        const descriptor = createStateDescriptor(state.descriptor);
        targetClass[STATES_MAP].set(state.name, descriptor);
    });
}

export function createSDKElement(targetClass = class {}, config = {}) {
    configureAria(targetClass, config.aria);
    configureProperties(targetClass, config.attributes);
    configureStates(targetClass, config.states);
    return targetClass;
}

// export function createWebComponent(targetClass, config) {
//     // register the web component
//     // create an instance of it via new
//     // configureAria
//     // configureProperties
//     // configure states
// }

// /**
//  * @extends HTMLElement
//  * @method { function } adoptHTML
//  */
// const baseComponent = class extends HTMLElement {
//     /**
//      * @implements ShadowRootOptions
//      */
//     #shadowRootOptions = {z
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

//     // statesMap = new Map();

//     constructor(config) {
//         super(config);
//         this.internals = this.attachInternals();
//         this.upgradableProperties = new Set();

//         this.configureShadowRoot(config.shadowRoot);
//         this.adoptHTML(config.html);
//         this.adoptStyleSheets(config.styles);
//     }

//     /**
//      *
//      * @param {string | HTMLTemplateElement} template
//      */
//     adoptHTML(template) {
//         if (template !== undefined) {
//             this.shadowRoot.append(template.content.cloneNode(true));
//         }
//     }

//     /**
//      * @memberof SDKBaseHTMLElement
//      * @param {CSSStyleSheet[]} styles
//      */
//     adoptStyleSheets(styles) {
//         if (styles) {
//             this.shadowRoot.adoptedStyleSheets = [...styles];
//         }
//     }

//     /**
//      * Applies the default states to the component
//      */
//     applyDefaultStates() {
//         this.statesMap
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

//     /**
//      * Upgrades a property (get the google link)
//      * @param {string} prop
//      */
//     upgradeProperty(prop) {
//         if (Object.hasOwn(this, prop)) {
//             let value = this[prop];
//             delete this[prop];
//             this[prop] = value;
//         }
//     }

//     upgradeProperties() {
//         Array.from(this.upgradableProperties).forEach((prop) =>
//             this.upgradeProperty(prop)
//         );
//     }

//     connectedCallback() {
//         this.upgradeProperties();
//         this.applyDefaultStates();
//     }
// };

// const config = {
//     // shadowRootOptions: {},
//     // html: '',
//     // styles: [],
//     // states: []
//     // aria: []
//     attributes: [
//         {
//             name: LAYOUT_ORIENTATION,
//             observable: true,
//             allowableValues: [HORIZONTAL, VERTICAL],
//             descriptor: {
//                 enumerable: true,
//                 set(value) {
//                     this.setAttribute(LAYOUT_ORIENTATION, value);
//                 },
//                 get() {
//                     return this.hasAttribute(LAYOUT_ORIENTATION)
//                         ? this.getAttribute(LAYOUT_ORIENTATION)
//                         : HORIZONTAL;
//                 },
//             },
//         }
//     ],
// };

// export const BaseComponent = createSDKElement(baseComponent, config);


// aria: [
//     {
//         name: 'ariaSelected',
//         value: 'true',
//         allowableValues: [],
//         isDefault: false,
//         isRole: false
//     }
// ]

// aria : {
//     role: '',
//     propertiesAndStates: []
// }
