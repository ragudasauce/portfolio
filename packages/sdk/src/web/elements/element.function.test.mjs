import { expect } from '@wdio/globals';
import { createSDKElement } from './element.function.mjs';
import {
    HORIZONTAL,
    VERTICAL,
} from '../constants/attribute.value.constants.mjs';
import * as attr from '../constants/attribute.name.constants.mjs';
import * as prop from '../constants/property.name.constants.mjs';
import { createStateDescriptor } from '../utilities/states.utilities.mjs';

describe('the createSDKElement function', function () {
    it('should return a basic class if no arguments are passed', function () {
        const result = createSDKElement();
        expect(result instanceof Function).toBe(true);
    });

    it('should return an unmodified class if no configuration is passed', function () {
        const testClass = class TestClass {};
        const result = createSDKElement(testClass);
        expect(Object.getPrototypeOf(result)).toEqual(
            Object.getPrototypeOf(testClass)
        );
    });

    describe('should return a modified class', function () {
        let internals, attributes, states, statesMap;
        let ExtendedElement, PrimitiveElement, BasicElement;
        let extendedTag, primitiveTag, basicTag;

        before(function () {
            states = [
                {
                    [prop.NAME]: 'testNoOptions',
                },
                {
                    [prop.NAME]: 'indeterminate',
                    [prop.DEFAULT_ENABLED]: false,
                    [prop.ASSOCIATED_ARIA_PROPERTY]: 'ariaChecked',
                    [prop.ARIA_VALUE]: 'mixed',
                },
                {
                    [prop.NAME]: 'checked',
                    [prop.DEFAULT_ENABLED]: false,
                    [prop.ASSOCIATED_ARIA_PROPERTY]: 'ariaChecked',
                },
            ];

            statesMap = states.reduce((acc, state) => {
                acc.set(state[prop.NAME], createStateDescriptor(state));
                return acc;
            }, new Map());

            internals = {
                notAllowed: 'a property that is not aria-*, role, or states',
                role: 'checkbox',
                ariaRequired: {
                    [prop.DEFAULT_VALUE]: 'false',
                    [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                },
                ariaChecked: {
                    [prop.DEFAULT_VALUE]: 'false',
                    [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                },
                states,
            };
            attributes = [
                {
                    [prop.NAME]: 'test',
                    [prop.UPDATABLE]: true,
                    [prop.DESCRIPTOR]: { value: 1 },
                },
                {
                    [prop.NAME]: 'state',
                    [prop.DESCRIPTOR]: {
                        get() {
                            return this.test;
                        },
                        set(value) {
                            this.test = value;
                        },
                    },
                },
                {
                    [prop.NAME]: prop.LAYOUT_ORIENTATION,
                    [prop.OBSERVABLE]: true,
                    [prop.ALLOWABLE_VALUES]: [HORIZONTAL, VERTICAL],
                    [prop.DESCRIPTOR]: {
                        set(value) {
                            this.setAttribute(attr.LAYOUT_ORIENTATION, value);
                        },
                        get() {
                            return this.hasAttribute(attr.LAYOUT_ORIENTATION)
                                ? this.getAttribute(attr.LAYOUT_ORIENTATION)
                                : HORIZONTAL;
                        },
                    },
                },
            ];

            const basicDef = class BasicClass extends HTMLElement {
                constructor() {
                    super();
                }
            };

            BasicElement = createSDKElement(basicDef, {
                internals,
                attributes,
            });

            PrimitiveElement = class PrimitiveClass extends HTMLElement {
                static [prop.UPGRADABLE_PROPERTIES_SET] = new Set().add(
                    'testing'
                );

                static [prop.INTERNALS_MAP] = new Map().set('testing', {});

                constructor() {
                    super();
                }

                set layoutOrientation(value) {
                    this.setAttribute('layout-orientation', value);
                }

                get layoutOrientation() {
                    return this.hasAttribute('layout-orientation')
                        ? this.getAttribute('layout-orientation')
                        : HORIZONTAL;
                }

                someMethod() {
                    return true;
                }

                static get [prop.OBSERVED_ATTRIBUTES]() {
                    return ['testing'];
                }
            };

            ExtendedElement = createSDKElement(
                class ExtendedElement extends BasicElement {
                    static [prop.UPGRADABLE_PROPERTIES_SET] = new Set().add(
                        'sometest'
                    );
                    static [prop.INTERNALS_MAP] = new Map()
                        .set('testing', true)
                        .set(
                            'states',
                            new Map().set('existing', {
                                [prop.DEFAULT_ENABLED]: false,
                            })
                        );

                    constructor() {
                        super();
                    }

                    set layoutOrientation(value) {
                        this.setAttribute('layout-orientation', value);
                    }

                    get layoutOrientation() {
                        return this.hasAttribute('layout-orientation')
                            ? this.getAttribute('layout-orientation')
                            : HORIZONTAL;
                    }

                    someMethod() {
                        return true;
                    }

                    static get [prop.OBSERVED_ATTRIBUTES]() {
                        return ['testing'];
                    }
                },
                { internals, attributes }
            );

            extendedTag = 'extended-primitive-element';
            primitiveTag = 'primitive-element';
            basicTag = 'basic-element';

            customElements.define(
                basicTag,
                createSDKElement(BasicElement, { internals, attributes })
            );

            customElements.define(
                primitiveTag,
                createSDKElement(PrimitiveElement, { internals, attributes })
            );
            customElements.define(extendedTag, ExtendedElement);
        });

        describe('that defines properties', function () {
            it('on an unconfigured class instance', function () {
                const targetElement = document.createElement(basicTag);
                const expectedMap = new Map()
                    .set('role', 'checkbox')
                    .set('ariaChecked', {
                        [prop.DEFAULT_VALUE]: 'false',
                        [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                    })
                    .set('ariaRequired', {
                        [prop.DEFAULT_VALUE]: 'false',
                        [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                    })
                    .set('states', statesMap);

                const upgradableSet = new Set().add('test');

                expect(targetElement[prop.INTERNALS_MAP]).toEqual(expectedMap);
                expect(targetElement[prop.UPGRADABLE_PROPERTIES_SET]).toEqual(
                    upgradableSet
                );
                expect(targetElement.test).toBe(1);
                expect(targetElement.state).toBe(1);
                expect(targetElement[prop.LAYOUT_ORIENTATION]).toBe(HORIZONTAL);
            });

            it('on a class with existing properties', function () {
                const targetElement = document.createElement(primitiveTag);
                const expectedMap = new Map()
                    .set('testing', {})
                    .set('role', 'checkbox')
                    .set('ariaChecked', {
                        [prop.DEFAULT_VALUE]: 'false',
                        [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                    })
                    .set('ariaRequired', {
                        [prop.DEFAULT_VALUE]: 'false',
                        [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                    })
                    .set('states', statesMap);

                const upgradableSet = new Set().add('testing').add('test');

                expect(targetElement[prop.INTERNALS_MAP]).toEqual(expectedMap);
                expect(targetElement[prop.UPGRADABLE_PROPERTIES_SET]).toEqual(
                    upgradableSet
                );
                expect(targetElement.test).toBe(1);
                expect(targetElement.state).toBe(1);
                expect(targetElement[prop.LAYOUT_ORIENTATION]).toBe(HORIZONTAL);
            });

            it('on an extended class with existing properties', function () {
                const extendedStatesMap = structuredClone(statesMap);
                extendedStatesMap
                    .set('existing', { [prop.DEFAULT_ENABLED]: false });

                const targetElement = document.createElement(extendedTag);
                const expectedMap = new Map()
                    .set('testing', true)
                    .set('role', 'checkbox')
                    .set('ariaChecked', {
                        [prop.DEFAULT_VALUE]: 'false',
                        [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                    })
                    .set('ariaRequired', {
                        [prop.DEFAULT_VALUE]: 'false',
                        [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                    })
                    .set('states', extendedStatesMap);

                const upgradableSet = new Set().add('sometest').add('test');

                expect(targetElement[prop.INTERNALS_MAP]).toEqual(expectedMap);
                expect(targetElement[prop.UPGRADABLE_PROPERTIES_SET]).toEqual(
                    upgradableSet
                );
                expect(targetElement.test).toBe(1);
                expect(targetElement.state).toBe(1);
                expect(targetElement[prop.LAYOUT_ORIENTATION]).toBe(HORIZONTAL);
            });

            it('automatically for the attributesChangedCallback lifecyle', function () {
                const targetElement = document.createElement(basicTag);
                expect(targetElement[prop.OBSERVED_ATTRIBUTES]).toEqual([
                    attr.LAYOUT_ORIENTATION,
                ]);
            });
        });
    });
});
