import { default as SDKBaseElement } from './base.element.mjs';
import { expect } from '@wdio/globals';
import { spyOn } from '@wdio/browser-runner';
import {
    ARIA_VALUE,
    ASSOCIATED_ARIA_PROPERTY,
    DEFAULT_ENABLED,
    INTERNALS,
    INTERNALS_MAP,
    LAYOUT_ORIENTATION,
    NAME,
    OBSERVED_ATTRIBUTES,
    UPGRADABLE_PROPERTIES_SET,
} from '../constants/property.name.constants.mjs';
import { createStateDescriptor } from '../utilities/states.utilities.mjs';
import {
    HORIZONTAL,
    VERTICAL,
} from '../constants/attribute.value.constants.mjs';
import * as attr from '../constants/attribute.name.constants.mjs';

const connectedCallbackSpy = spyOn(
    SDKBaseElement.prototype,
    'connectedCallback'
);

const configInternalSpy = spyOn(SDKBaseElement.prototype, 'configureInternals');
const configShadowRootSpy = spyOn(
    SDKBaseElement.prototype,
    'configureShadowRoot'
);
const adoptHTMLSpy = spyOn(SDKBaseElement.prototype, 'adoptHTML');
const adoptStyleSheetsSpy = spyOn(SDKBaseElement.prototype, 'adoptStyleSheets');
const upgradePropertiesSpy = spyOn(SDKBaseElement.prototype, 'upgradeProperties');
const upgradePropertySpy = spyOn(SDKBaseElement.prototype, 'upgradeProperty');

const basicElement = 'base-element';
const configuredElement = 'configured-element';
const alternativeElement = 'alternative-element';

const template = document.createElement('template');
template.content.appendChild(document.createElement('slot'));

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(':host { color: blue; }');

class BasicElement extends SDKBaseElement {
    constructor() {
        super();
    }
}

const states = [
    {
        [NAME]: 'testNoOptions',
    },
    {
        [NAME]: 'indeterminate',
        [DEFAULT_ENABLED]: false,
        [ASSOCIATED_ARIA_PROPERTY]: 'ariaChecked',
        [ARIA_VALUE]: 'mixed',
    },
    {
        [NAME]: 'checked',
        [DEFAULT_ENABLED]: false,
        [ASSOCIATED_ARIA_PROPERTY]: 'ariaChecked',
    },
    {
        [NAME]: 'required',
        [DEFAULT_ENABLED]: true,
        [ASSOCIATED_ARIA_PROPERTY]: 'ariaRequired',
    },
];

const statesMap = states.reduce((acc, state) => {
    acc.set(state[NAME], createStateDescriptor(state));
    return acc;
}, new Map());

const shadowRoot = {
    mode: 'open',
    clonable: false,
    delegatesFocus: false,
    serializeable: false,
    slotAssignment: 'named',
};

class ConfiguredElement extends SDKBaseElement {
    constructor() {
        super({
            shadowRootOptions: shadowRoot,
            html: template,
            styles: [styleSheet],
        });
    }

    test = 1;
}

ConfiguredElement.prototype[INTERNALS_MAP].set('role', 'checkbox');
ConfiguredElement.prototype[INTERNALS_MAP].set('states', statesMap);
ConfiguredElement.prototype[UPGRADABLE_PROPERTIES_SET].add('test');

class AlternateElement extends SDKBaseElement {
    constructor() {
        super({
            shadowRootOptions: shadowRoot,
            html: '<p><slot></slot></p>',
            styles: [styleSheet],
        });
    }
}

customElements.define(basicElement, BasicElement);
customElements.define(configuredElement, ConfiguredElement);
customElements.define(alternativeElement, AlternateElement);

describe('The SDKBaseHTMLElement Class', function () {
    describe('the constructor', function () {
        let defaultComponent, configComponent, alternativeComponent;

        beforeEach(function () {
            defaultComponent = document.createElement(basicElement);
            configComponent = document.createElement(configuredElement);
            alternativeComponent = document.createElement(alternativeElement);
        });

        it('should create a valid HTML element with an unreachable shadow root if no configuration is specified', function () {
            expect(defaultComponent[INTERNALS]).toBeDefined();
            expect(defaultComponent[INTERNALS].states).toBeDefined();
            expect(defaultComponent[INTERNALS].ariaOrientation).toBe(
                HORIZONTAL
            );
            expect(defaultComponent.shadowRoot).toBeNull();
            expect(configInternalSpy).toHaveBeenCalled();
            expect(configShadowRootSpy).toHaveBeenCalledWith(undefined);
            expect(adoptHTMLSpy).toHaveBeenCalledWith(undefined);
            expect(adoptStyleSheetsSpy).toHaveBeenCalledWith(undefined);
            configInternalSpy.mockClear();
            configShadowRootSpy.mockClear();
            adoptHTMLSpy.mockClear();
            adoptStyleSheetsSpy.mockClear();
        });

        it('should create a valid HTML element with a shadow root, styles, aria properites and internal states', function () {
            expect(configComponent[INTERNALS_MAP].has('role')).toBe(true);
            expect(configComponent[INTERNALS_MAP].has('states')).toBe(true);
            expect(configComponent[INTERNALS]).toBeDefined();
            expect(configComponent[INTERNALS].states).toBeDefined();
            expect(configComponent[INTERNALS].states.has('required')).toBe(
                true
            );
            expect(configComponent[INTERNALS].ariaOrientation).toBe(HORIZONTAL);
            expect(configComponent.shadowRoot).toBeDefined();
            expect(configComponent.shadowRoot.adoptedStyleSheets).toBeDefined();
            expect(configInternalSpy).toHaveBeenCalled();
            expect(configShadowRootSpy).toHaveBeenCalledWith(shadowRoot);
            expect(adoptHTMLSpy).toHaveBeenCalledWith(template);
            expect(adoptStyleSheetsSpy).toHaveBeenCalledWith([styleSheet]);
            configInternalSpy.mockClear();
            configShadowRootSpy.mockClear();
            adoptHTMLSpy.mockClear();
            adoptStyleSheetsSpy.mockClear();
        });

        it('should create a valid shadow DOM from a string or <template>', function () {
            const alternativeShadow =
                alternativeComponent[INTERNALS].shadowRoot.innerHTML;
            const configShadow =
                configComponent[INTERNALS].shadowRoot.innerHTML;
            expect(alternativeShadow).toEqual('<p><slot></slot></p>');
            expect(configShadow).toEqual('<slot></slot>');
        });
    });

    describe('the base class', function () {
        let defaultComponent, configComponent;

        beforeEach(function () {
            defaultComponent = document.createElement(basicElement);
            configComponent = document.createElement(configuredElement);
        });

        describe('manages aria states and properties', function () {
            it('that have been configured', function () {
                expect(defaultComponent[INTERNALS].ariaOrientation).toBe(
                    HORIZONTAL
                );
                defaultComponent.manageAria('ariaOrientation', VERTICAL);
                expect(defaultComponent[INTERNALS].ariaOrientation).toBe(
                    VERTICAL
                );
            });

            it('that have not been configured', function () {
                expect(defaultComponent[INTERNALS].ariaRequired).toBeNull;
                defaultComponent.manageAria('ariaRequired', 'true');
                expect(defaultComponent[INTERNALS].ariaRequired).toBe('true');
                defaultComponent.manageAria('ariaRequired');
                expect(defaultComponent[INTERNALS].ariaRequired).toBeNull;
            });
        });

        describe('manages internal state', function () {
            it('only if the state was registered', function () {
                const stateName = 'unregistered';
                const states = configComponent[INTERNALS].states;
                expect(states.has(stateName)).toBe(false);
                configComponent.manageState(stateName, true);
                expect(states.has(stateName)).toBe(false);
            });

            it('by enabling', function () {
                const stateName = 'checked';
                const states = configComponent[INTERNALS].states;
                expect(states.has(stateName)).toBe(false);
                configComponent.manageState(stateName, true);
                expect(states.has(stateName)).toBe(true);
            });

            it('by removing', function () {
                const stateName = 'required';
                const states = configComponent[INTERNALS].states;
                expect(states.has(stateName)).toBe(true);
                configComponent.manageState(stateName, false);
                expect(states.has(stateName)).toBe(false);
            });

            it('by toggling', function () {
                const stateName = 'required';
                const states = configComponent[INTERNALS].states;
                expect(states.has(stateName)).toBe(true);
                configComponent.manageState(stateName);
                expect(states.has(stateName)).toBe(false);
                configComponent.manageState(stateName);
                expect(states.has(stateName)).toBe(true);
            });

            it('that also have associated aria states', function () {
                const stateName = 'required';
                const states = configComponent[INTERNALS].states;
                expect(states.has(stateName)).toBe(true);
                expect(configComponent[INTERNALS].ariaRequired).toBe('true');

                configComponent.manageState(stateName);
                expect(states.has(stateName)).toBe(false);
                expect(configComponent[INTERNALS].ariaRequired).toBe('false');
            });
        });

        it('defines observed attributes', function () {
            expect(defaultComponent[OBSERVED_ATTRIBUTES]).toEqual([
                attr.LAYOUT_ORIENTATION,
            ]);
        });

        describe('defines setters and getters', function () {
            it('for layout direction', function () {
                expect(configComponent[LAYOUT_ORIENTATION]).toBe(HORIZONTAL);
                expect(configComponent.hasAttribute('layout-orientation')).toBe(
                    false
                );

                configComponent[LAYOUT_ORIENTATION] = VERTICAL;
                expect(configComponent[LAYOUT_ORIENTATION]).toBe(VERTICAL);
                expect(configComponent.hasAttribute('layout-orientation')).toBe(
                    true
                );
                expect(configComponent.getAttribute('layout-orientation')).toBe(
                    VERTICAL
                );

                configComponent[LAYOUT_ORIENTATION] = HORIZONTAL;
                expect(configComponent[LAYOUT_ORIENTATION]).toBe(HORIZONTAL);
                expect(configComponent.hasAttribute('layout-orientation')).toBe(
                    true
                );
                expect(configComponent.getAttribute('layout-orientation')).toBe(
                    HORIZONTAL
                );

                configComponent[LAYOUT_ORIENTATION] = '';
                expect(configComponent[LAYOUT_ORIENTATION]).toBe(HORIZONTAL);
                expect(configComponent.hasAttribute('layout-orientation')).toBe(
                    false
                );
            });
        });

        describe('the lifecyle events', function () {
            it('will update properties when connected to the DOM', function () {
                defaultComponent.test = 'blue';
                document.body.appendChild(defaultComponent);
                expect(connectedCallbackSpy).toHaveBeenCalled();
                expect(upgradePropertiesSpy).toHaveBeenCalled();
                expect(upgradePropertySpy).toHaveBeenCalled();
                connectedCallbackSpy.mockClear();
                upgradePropertiesSpy.mockClear();
                upgradePropertySpy.mockClear();
            });
        });
    });
});
