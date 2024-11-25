import {
    convertCamelToKebabCase,
    createAttributeDescription,
    createIDLName,
    formatAttributeName,
} from '../utilities/attributes.utilities.mjs';
import { createStateDescriptor } from '../utilities/states.utilities.mjs';
import { createAriaDescriptor } from '../utilities/aria.utilities.mjs';
import {
    ARIA_MAP,
    INTERNALS,
    INTERNALS_MAP,
    NAME,
    OBSERVED_ATTRIBUTES,
    STATES_MAP,
    UPGRADABLE_PROPERTIES_SET,
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

function configureInternals(targetClass, internalsConfig = {}) {
    if (Object.keys(internalsConfig).length === 0) {
        return;
    }

    if (!Object.hasOwn(targetClass, INTERNALS_MAP)) {
        Object.defineProperty(targetClass, INTERNALS_MAP, { value: new Map() });
    }

    const internalsMap = targetClass[INTERNALS_MAP];

    Object.entries(internalsConfig).forEach(entry => {
        const propertyKey = formatAttributeName(entry[0])
        const value = entry[1];
        if (propertyKey !== 'states') {
            internalsMap.set(propertyKey, value);
        } else {
            internalsMap.set(propertyKey, value.map((state) => createStateDescriptor(state)))
        }
    })
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
        UPGRADABLE_PROPERTIES_SET
    )
        ? targetClass[UPGRADABLE_PROPERTIES_SET]
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
            acc[UPGRADABLE_PROPERTIES_SET] = {
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

// function configureStates(targetMap, states = []) {
//     if (states.length === 0) {
//         return;
//     }

//     // if (!Object.hasOwn(targetMap, STATES_MAP)) {
//     //     Object.defineProperty(targetMap, STATES_MAP, { value: new Map() });
//     // }

//     // states are either in the CustomStateSet or not
//     // making states boolean.
//     // States that are reflected to aria-states are also generally boolean,
//     // though the aria-state should convert the boolean to a string.
//     // a notable exception is 'aria-checked' which can also have the string 'mixed'
//     // set, indicating an indeterminate state.

//     // in such a case, the indeterminate state is boolean, with the string 'mixed'
//     // associated to it.

//     states.forEach((state) => {
//         const descriptor = createStateDescriptor(state);
//         targetMap.states.set(state[NAME], descriptor);
//     });
// }

/**
 * @template {new (...args:any[]) => any} T
 */
export function createSDKElement(
    /** @type {T} */ targetClass = class {},
    /** @type { ClassConfigOptions} */ config = {}
) {
    configureInternals(targetClass, config.internals);
    configureProperties(targetClass, config.attributes);
    // configureStates(targetClass, config.states);
    return targetClass;
}

// export function createWebComponent(targetClass, config) {
//     // register the web component
//     // create an instance of it via new
//     // configureAria
//     // configureProperties
//     // configure states
// }
