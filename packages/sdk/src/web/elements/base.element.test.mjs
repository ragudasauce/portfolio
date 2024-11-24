import { default as SDKBaseElement } from './base.element.mjs';
import { expect } from '@wdio/globals';
import { spyOn } from '@wdio/browser-runner';

const connectedCallbackSpy = spyOn(SDKBaseElement.prototype, 'connectedCallback');

describe('The SDKBaseHTMLElement Class', function() {
    it('it should be defined', function() {
        expect(SDKBaseElement).toBeTruthy();
    });

    const noConfigTestElement = 'base-test-element';
    const configTestElement = 'base-shadow-element';
    // let defaultComponent, configComponent;

    before('should work', async function() {
        const template = document.createElement('template');
        template.content.appendChild(document.createElement('slot'));

        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(':host { color: blue; }');

        class UnconfiguredComponent extends SDKBaseElement {
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

        class ConfiguredComponent extends SDKBaseElement {
            constructor() {
                super({
                    shadowRootOptions: shadowRoot,
                    html: template,
                    stylesheets: [styleSheet],
                });
            }
        }
        customElements.define(noConfigTestElement, UnconfiguredComponent);
        customElements.define(configTestElement, ConfiguredComponent);
    });

    describe('testing this if it works', function() {
        it('could work', async function() {
            const component = document.createElement(configTestElement);
            component.innerHTML = 'hello world';
            // const connectedCallbackSpy = spyOn(component, 'connectedCallback')
            document.body.appendChild(component);

            expect(connectedCallbackSpy).toHaveBeenCalled();



            // expect(Object.hasOwn(component, 'shadowRoot'))

            // await expect($(configTestElement)).toBePresent();
        });
    });

    // beforeAll(function() {
    //     defaultComponent = document.createElement(noConfigTestElement);
    //     configComponent = document.createElement(configTestElement);
    // });

    // describe.skip('should encapsulate structure and style', () => {
    //     describe('based upon a default configuration', () => {
    //         test('that can participate in forms and aria states', () => {
    //             expect(
    //                 Object.hasOwn(defaultComponent, 'internals')
    //             ).toBeTruthy();
    //             expect(configComponent.internals).toBeTruthy();
    //         });

    //         test('that can be configured to disable or enable access to the shadow dom', () => {
    //             expect(defaultComponent.shadowRoot).toBeNull();
    //             expect(configComponent.shadowRoot).toBeTruthy();
    //         });

    //         test('that can encapsulate styles', () => {
    //             const sheet = configComponent.shadowRoot.adoptedStyleSheets;
    //             expect(sheet.length).toBe(1);
    //         });
    //     });
    // });

    // describe.skip('should manage states', () => {
    //     beforeEach(() => {
    //         defaultComponent.manageState('required', false);
    //     });

    //     test('by toggling a state', () => {
    //         defaultComponent.manageState('required');
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             true
    //         );
    //         defaultComponent.manageState('required');
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             false
    //         );
    //     });

    //     test('by forcing a state to be applied', () => {
    //         defaultComponent.manageState('required', true);
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             true
    //         );
    //         defaultComponent.manageState('required', true);
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             true
    //         );
    //     });

    //     test('by forcing a state to be removed', () => {
    //         defaultComponent.manageState('required');
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             true
    //         );
    //         defaultComponent.manageState('required', false);
    //         expect(defaultComponent.internals.states.has('required')).toBe(
    //             false
    //         );
    //     });

    //     test('when the instance is attached to the dom', () => {
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
