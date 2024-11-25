import { default as SDKBaseElement } from './base.element.mjs';
import { expect } from '@wdio/globals';
import { spyOn } from '@wdio/browser-runner';

const connectedCallbackSpy = spyOn(
    SDKBaseElement.prototype,
    'connectedCallback'
);

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
customElements.define(basicElement, BasicElement);
customElements.define(configuredElement, ConfiguredElement);

describe('The SDKBaseHTMLElement Class', function () {
    it('it should be defined', function () {
        expect(SDKBaseElement).toBeTruthy();
    });

    describe('The constructor', function () {
        let defaultComponent, configComponent;

        beforeEach(function () {
            defaultComponent = document.createElement(basicElement);
            configComponent = document.createElement(configuredElement);
        });

        it('could work', async function () {
            // const component = document.createElement(configuredElement);
            defaultComponent.innerHTML = 'hello world';
            document.body.appendChild(defaultComponent);

            expect(connectedCallbackSpy).toHaveBeenCalled();
        });
    });

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
