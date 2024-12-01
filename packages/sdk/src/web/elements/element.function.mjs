import {
    convertCamelToKebabCase,
    createAttributeDescription,
    createIDLName,
    formatAttributeName,
} from '../utilities/attributes.utilities.mjs';
import { createStateDescriptor } from '../utilities/states.utilities.mjs';
import { createAriaDescriptor } from '../utilities/aria.utilities.mjs';
import {
    DESCRIPTOR,
    INTERNALS_MAP,
    OBSERVED_ATTRIBUTES,
    UPGRADABLE_PROPERTIES_SET,
} from '../constants/property.name.constants.mjs';

/**
 * @typedef {import('../utilities/attributes.utilities.mjs').AttributeAccessorDescriptor } AttributeAccessorDescriptor
 * @typedef {import('../utilities/attributes.utilities.mjs').AttributeDataDescriptor} AttributeDataDescriptor
 */

/**
 * NOTE THIS NEEDS WORK. I THINK ITS A RECORD.
 * @typedef { object } AriaConfiguration
 * @property { string } role
 * @property { AriaPropertiesAndStates } propertiesAndStates
 */

/**
 * @typedef { object } AriaPropertiesAndStates
 * @property { string[] } [allowableValues]
 * @property { string } defaultValue
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
 * @property { boolean } [defaultEnabled=false]
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
        Object.defineProperty(targetClass.prototype, INTERNALS_MAP, { value: new Map() });
    }

    const internalsMap = targetClass.prototype[INTERNALS_MAP];

    Object.entries(internalsConfig).forEach(entry => {
        const propertyKey = formatAttributeName(entry[0])
        const value = entry[1];
        if (propertyKey.includes('aria')) {
            internalsMap.set(propertyKey, createAriaDescriptor(value));
            return;
        } 
        
        if (propertyKey === 'states') {
            internalsMap.set(propertyKey, value.map((state) => createStateDescriptor(state)))
            return;
        }

        if (propertyKey === 'role') {
            internalsMap.set(propertyKey, value);
            return;
        }
    })
}

function configureAttributes(targetClass, attributes = []) {
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
        const descriptor = createAttributeDescription(attribute[DESCRIPTOR]);

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

    Object.defineProperties(targetClass, properties);
}

/**
 * @template {new (...args:any[]) => any} T
 */
export function createSDKElement(
    /** @type {T} */ targetClass = class {},
    /** @type { ClassConfigOptions} */ config = {}
) {
    configureInternals(targetClass, config.internals);
    configureAttributes(targetClass, config.attributes);
    return targetClass;
}

// export function createWebComponent(targetClass, config) {
//     // register the web component
//     // create an instance of it via new
//     // configureAria
//     // configureProperties
//     // configure states
// }
