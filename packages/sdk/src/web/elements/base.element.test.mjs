import { default as SDKBaseElement } from './base.element.mjs';
import { describe, expect, beforeAll, test, beforeEach, vi } from 'vitest';

describe('The SDKBaseElement', () => {
    const noConfigTestElement = 'base-test-element';
    const configTestElement = 'base-shadow-element';
    let defaultComponent, configComponent;

    beforeAll(() => {
        const template = document.createElement('template');
        template.append('<slot></slot>');

        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(':host { color: blue; }');

        class TestComponent extends SDKBaseElement {
            constructor() {
                super();
                this.defineState('required');
                this.defineState('enabled', {
                    defaultValue: true,
                    isDefault: true,
                });
            }
        }

        const shadowRootOptions = {
            mode: 'open',
            clonable: false,
            delegatesFocus: false,
            serializeable: false,
            slotAssignment: 'named',
        };

        class TestShadowComponent extends SDKBaseElement {
            constructor() {
                super({
                    shadowRootOptions,
                    html: template,
                    stylesheets: [styleSheet],
                });
                this.defineState('enabled', {
                    defaultValue: true,
                    isDefault: true,
                });
            }
        }
        customElements.define(noConfigTestElement, TestComponent);
        customElements.define(configTestElement, TestShadowComponent);
    });

    beforeAll(() => {
        defaultComponent = document.createElement(noConfigTestElement);
        configComponent = document.createElement(configTestElement);
    });
    describe('should encapsulate structure and style', () => {
        describe('based upon a default configuration', () => {
            test('that can participate in forms and aria states', () => {
                expect(
                    Object.hasOwn(defaultComponent, 'internals')
                ).toBeTruthy();
                expect(configComponent.internals).toBeTruthy();
            });

            test('that can be configured to disable or enable access to the shadow dom', () => {
                expect(defaultComponent.shadowRoot).toBeNull();
                expect(configComponent.shadowRoot).toBeTruthy();
            });

            test('that can encapsulate styles', () => {
                const sheet = configComponent.shadowRoot.adoptedStyleSheets;
                expect(sheet.length).toBe(1);
            });
        });
    });

    describe('should manage states', () => {
        beforeEach(() => {
            defaultComponent.manageState('required', false);
        });

        test('by toggling a state', () => {
            defaultComponent.manageState('required');
            expect(defaultComponent.internals.states.has('required')).toBe(
                true
            );
            defaultComponent.manageState('required');
            expect(defaultComponent.internals.states.has('required')).toBe(
                false
            );
        });

        test('by forcing a state to be applied', () => {
            defaultComponent.manageState('required', true);
            expect(defaultComponent.internals.states.has('required')).toBe(
                true
            );
            defaultComponent.manageState('required', true);
            expect(defaultComponent.internals.states.has('required')).toBe(
                true
            );
        });

        test('by forcing a state to be removed', () => {
            defaultComponent.manageState('required');
            expect(defaultComponent.internals.states.has('required')).toBe(
                true
            );
            defaultComponent.manageState('required', false);
            expect(defaultComponent.internals.states.has('required')).toBe(
                false
            );
        });

        test('when the instance is attached to the dom', () => {
            const connectedSpy = vi.spyOn(defaultComponent, 'connectedCallback');
            const applySpy = vi.spyOn(defaultComponent, 'applyDefaultStates')
            expect(defaultComponent.internals.states.has('enabled')).toBe(
                false
            );
            document.body.appendChild(defaultComponent);
            defaultComponent.connectedCallback();
            expect(connectedSpy).toHaveBeenCalled();
            expect(applySpy).toHaveBeenCalled();

            expect(defaultComponent.internals.states.has('enabled')).toBe(true);
        });
    });
});
