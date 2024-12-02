import { default as SDKBaseElement } from './base.element.mjs';
import { expect } from '@wdio/globals';
import { spyOn } from '@wdio/browser-runner';
import {
    ARIA_VALUE,
    ASSOCIATED_ARIA_PROPERTY,
    DEFAULT_ENABLED,
    INTERNALS,
    INTERNALS_MAP,
    NAME,
} from '../constants/property.name.constants.mjs';
import { createStateDescriptor } from '../utilities/states.utilities.mjs';
import { HORIZONTAL } from '../constants/attribute.value.constants.mjs';

const connectedCallbackSpy = spyOn(
    SDKBaseElement.prototype,
    'connectedCallback'
);

const configInternalSpy = spyOn(SDKBaseElement.prototype, 'configureInternals');
const configShadowRootSpy = spyOn(SDKBaseElement.prototype, 'configureShadowRoot');
const adoptHTMLSpy = spyOn(SDKBaseElement.prototype, 'adoptHTML');
const adoptStyleSheetsSpy = spyOn(SDKBaseElement.prototype, 'adoptStyleSheets');

const basicElement = 'base-element';
const configuredElement = 'configured-element';

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
    }
].map((state) => createStateDescriptor(state));

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
}

ConfiguredElement.prototype[INTERNALS_MAP].set('role', 'checkbox');
ConfiguredElement.prototype[INTERNALS_MAP].set('states', states);

customElements.define(basicElement, BasicElement);
customElements.define(configuredElement, ConfiguredElement);

describe('The SDKBaseHTMLElement Class', function () {
    // it('it should be defined', function () {
    //     expect(SDKBaseElement).toBeTruthy();
    // });

    describe('the constructor', function () {
        let defaultComponent,
            configComponent;
            

        beforeEach(function () {
            defaultComponent = document.createElement(basicElement);
            configComponent = document.createElement(configuredElement);
        });

        it('should create a valid HTML element with an unreachable shadow root if no configuration is specified', function () {
            expect(defaultComponent[INTERNALS]).toBeDefined();
            expect(defaultComponent[INTERNALS].states).toBeDefined();
            expect(defaultComponent[INTERNALS].ariaOrientation).toBe(HORIZONTAL);
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

        it('should create a valid HTML element with a shadow root, styles, aria properites and internal states', function() {
            expect(configComponent[INTERNALS]).toBeDefined();
            expect(configComponent[INTERNALS].states).toBeDefined();
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
    });

    describe('the base class', function () {});

    describe('the lifecyle events', function () {});

    // describe.skip('should encapsulate structure and style', function () {
    //     describe('based upon a default configuration', function () {
    //         it('that can participate in forms and aria states', function () {
    //             expect(
    //                 Object.hasOwn(defaultComponent, 'internals')
    //             ).toBeTruthy();
    //             expect(configComponent.internals).toBeTruthy();
    //         });

    //         it('that can be configured to disable or enable access to the shadow dom', function () {
    //             expect(defaultComponent.shadowRoot).toBeNull();
    //             expect(configComponent.shadowRoot).toBeTruthy();
    //         });

    //         it('that can encapsulate styles', function () {
    //             const sheet = configComponent.shadowRoot.adoptedStyleSheets;
    //             expect(sheet.length).toBe(1);
    //         });
    //     });
    // });

    // describe.skip('should manage states', function() {
    //     beforeEach(function() {
    //         defaultComponent.manageState('required', false);
    //     });

    //     it('by toggling a state', function() {
    //         defaultComponent.manageState('required');
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             true
    //         );
    //         defaultComponent.manageState('required');
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             false
    //         );
    //     });

    //     it('by forcing a state to be applied', function() {
    //         defaultComponent.manageState('required', true);
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             true
    //         );
    //         defaultComponent.manageState('required', true);
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             true
    //         );
    //     });

    //     it('by forcing a state to be removed', function() {
    //         defaultComponent.manageState('required');
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             true
    //         );
    //         defaultComponent.manageState('required', false);
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             false
    //         );
    //     });

    //     it('when the instance is attached to the dom', function() {
    //         const connectedSpy = vi.spyOn(defaultComponent, 'connectedCallback');
    //         const applySpy = vi.spyOn(defaultComponent, 'applyDefaultStates')
    //         expect(defaultComponent.internals.states.has('enabled')).toBe(
    //             false
    //         );
    //         document.body.appendChild(defaultComponent);
    //         defaultComponent.connectedCallback();
    //         expect(connectedSpy).toHaveBeenCalled();
    //         expect(applySpy).toHaveBeenCalled();

    //         expect(defaultComponent.internals.states.has('enabled')).toBe(true);
    //     });
    // });
});
