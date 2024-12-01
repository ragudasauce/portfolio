import { expect } from '@wdio/globals';
import { createSDKElement } from './element.function.mjs';
import {
    HORIZONTAL,
    VERTICAL,
} from '../constants/attribute.value.constants.mjs';
import * as attr from '../constants/attribute.name.constants.mjs';
import * as prop from '../constants/property.name.constants.mjs';

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

    describe('should modify a class based upon configuration', function () {
        let internals, attributes;

        before(function () {
            internals = {
                role: 'checkbox',
                ariaRequired: {
                    [prop.DEFAULT_VALUE]: 'false',
                    [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                },
                ariaChecked: {
                    [prop.DEFAULT_VALUE]: 'false',
                    [prop.ALLOWABLE_VALUES]: ['true', 'false'],
                },
                states: [
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
                ],
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
                        enumerable: true,
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
        });

        let primitive, basic;

        beforeEach(function () {
            basic = class extends HTMLElement {
                constructor() {
                    super();
                }
            };

            primitive = class TestClass extends HTMLElement {
                static [prop.UPGRADABLE_PROPERTIES_SET] = new Set().add(
                    'testing'
                );
                static [prop.INTERNALS_MAP] = new Map().set('testing', {});

                constructor() {
                    super();
                }

                static get [prop.OBSERVED_ATTRIBUTES]() {
                    return ['testing'];
                }
            };
        });

        describe('that defines attributes', function () {
            it('on a basic, unconfigured class', function () {
                const config = {
                    attributes
                };

                let hasTest = basic.test !== undefined;
                let hasLayoutOrientation = basic[prop.LAYOUT_ORIENTATION] !== undefined;
                let hasObservedAttributes = basic[prop.OBSERVED_ATTRIBUTES] !== undefined;
                let hasUpgradableProperties = basic[prop.UPGRADABLE_PROPERTIES_SET] !== undefined

                let target = basic.prototype;

                console.log('HASTEST', hasTest);
                console.log('HAS LAYOUT ORIENTATION', hasLayoutOrientation);
                console.log('OBJECT.hasOwn', Object.hasOwn(basic, prop.LAYOUT_ORIENTATION));
                expect(hasLayoutOrientation).toBe(false);

                const modified = createSDKElement(basic, config);

                hasLayoutOrientation = basic[prop.LAYOUT_ORIENTATION] !== undefined;
                console.log('HAS LAYOUT ORIEJTATION', hasLayoutOrientation);
                console.log('OBJECT.hasOwn', Object.hasOwn(basic, prop.LAYOUT_ORIENTATION));

                expect(hasLayoutOrientation).toBe(true);





                // expect(target.test).toBeUndefined();
                // expect(Object.hasOwn(target, prop.LAYOUT_ORIENTATION)).toBe(
                //     false
                // );

                // expect(Object.hasOwn(target, prop.OBSERVED_ATTRIBUTES)).toBe(
                //     false
                // );
                // expect(
                //     Object.hasOwn(target, prop.UPGRADABLE_PROPERTIES_SET)
                // ).toBe(false);

                // let modified = createSDKElement(basic, config);
                // target = modified.prototype;

                // expect(target.test).toBeDefined();
                // expect(target.state).toBeDefined();
                // expect(Object.hasOwn(target, prop.LAYOUT_ORIENTATION)).toBe(
                //     true
                // );
                // expect(Object.hasOwn(target, prop.OBSERVED_ATTRIBUTES)).toBe(
                //     true
                // );
                // expect(
                //     Object.hasOwn(target, prop.UPGRADABLE_PROPERTIES_SET)
                // ).toBe(true);

                // expect(target[prop.OBSERVED_ATTRIBUTES]).toEqual([
                //     attr.LAYOUT_ORIENTATION,
                // ]);

                // expect(target[prop.UPGRADABLE_PROPERTIES_SET]).toEqual(
                //     new Set().add('test')
                // );
            });

            // it('on a class with pre-existing attributes', function () {
            //     const config = {
            //         attributes,
            //     };

            //     let target = primitive.prototype;

            //     expect(target.test).toBeUndefined();
            //     expect(target.state).toBeUndefined();
            //     expect(Object.hasOwn(target, prop.LAYOUT_ORIENTATION)).toBe(
            //         false
            //     );

            //     expect(Object.hasOwn(target, prop.OBSERVED_ATTRIBUTES)).toBe(
            //         false
            //     );
            //     expect(
            //         Object.hasOwn(target, prop.UPGRADABLE_PROPERTIES_SET)
            //     ).toBe(false);

            //     let modified = createSDKElement(primitive, config);
            //     target = modified.prototype;

            //     expect(target.test).toBeDefined();
            //     expect(target.state).toBeDefined();
            //     expect(Object.hasOwn(target, prop.LAYOUT_ORIENTATION)).toBe(
            //         true
            //     );
            //     expect(Object.hasOwn(target, prop.OBSERVED_ATTRIBUTES)).toBe(
            //         true
            //     );
            //     expect(
            //         Object.hasOwn(target, prop.UPGRADABLE_PROPERTIES_SET)
            //     ).toBe(true);

            //     expect(target[prop.OBSERVED_ATTRIBUTES]).toEqual([
            //         'testing',
            //         attr.LAYOUT_ORIENTATION,
            //     ]);

            //     expect(target[prop.UPGRADABLE_PROPERTIES_SET]).toEqual(
            //         new Set().add('test').add('testing')
            //     );
            // });
        });

        describe.skip('that defines an internal map', function () {
            it('on a basic unconfigured class', function () {
                const config = { internals };
                let target = basic.prototype;
                expect(target[prop.INTERNALS_MAP]).toBeUndefined();
            });
        });
    });
});
