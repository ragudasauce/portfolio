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
                    defaultValue: 'false',
                    allowableValues: ['true', 'false'],
                },
                ariaChecked: {
                    defaultValue: 'false',
                    allowableValues: ['true', 'false'],
                },
                states: [
                    {
                        name: 'testNoOptions',
                    },
                    {
                        name: 'indeterminate',
                        isDefault: false,
                        associatedAria: 'ariaChecked',
                        ariaValue: 'mixed',
                    },
                    {
                        name: 'checked',
                        defaultValue: false,
                        associatedAria: 'ariaChecked',
                    },
                ],
            };
            attributes = [
                {
                    name: 'test',
                    upgradable: true,
                    descriptor: { value: 1 },
                },
                {
                    name: 'state',
                    descriptor: {
                        get() {
                            return this.test;
                        },
                        set(value) {
                            this.test = value;
                        },
                    },
                },
                {
                    name: prop.LAYOUT_ORIENTATION,
                    observable: true,
                    allowableValues: [HORIZONTAL, VERTICAL],
                    descriptor: {
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
                static [prop.STATES_MAP] = new Map().set('testing', {});
                static [prop.INTERNALS_MAP] = new Map().set('testing', {});
                // static role = 'combobox';

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
                    attributes,
                };

                let target = basic.prototype;

                expect(target.test).toBeUndefined();
                expect(target.state).toBeUndefined();
                expect(Object.hasOwn(target, prop.LAYOUT_ORIENTATION)).toBe(
                    false
                );

                expect(Object.hasOwn(target, prop.OBSERVED_ATTRIBUTES)).toBe(
                    false
                );
                expect(
                    Object.hasOwn(target, prop.UPGRADABLE_PROPERTIES_SET)
                ).toBe(false);

                let modified = createSDKElement(basic, config);
                target = modified.prototype;

                expect(target.test).toBeDefined();
                expect(target.state).toBeDefined();
                expect(Object.hasOwn(target, prop.LAYOUT_ORIENTATION)).toBe(
                    true
                );
                expect(Object.hasOwn(target, prop.OBSERVED_ATTRIBUTES)).toBe(
                    true
                );
                expect(
                    Object.hasOwn(target, prop.UPGRADABLE_PROPERTIES_SET)
                ).toBe(true);

                expect(target[prop.OBSERVED_ATTRIBUTES]).toEqual([
                    attr.LAYOUT_ORIENTATION,
                ]);

                expect(target[prop.UPGRADABLE_PROPERTIES_SET]).toEqual(
                    new Set().add('test')
                );
            });

            it('on a class with pre-existing attributes', function () {
                const config = {
                    attributes,
                };

                let target = primitive.prototype;

                expect(target.test).toBeUndefined();
                expect(target.state).toBeUndefined();
                expect(Object.hasOwn(target, prop.LAYOUT_ORIENTATION)).toBe(
                    false
                );

                expect(Object.hasOwn(target, prop.OBSERVED_ATTRIBUTES)).toBe(
                    false
                );
                expect(
                    Object.hasOwn(target, prop.UPGRADABLE_PROPERTIES_SET)
                ).toBe(false);

                let modified = createSDKElement(primitive, config);
                target = modified.prototype;

                expect(target.test).toBeDefined();
                expect(target.state).toBeDefined();
                expect(Object.hasOwn(target, prop.LAYOUT_ORIENTATION)).toBe(
                    true
                );
                expect(Object.hasOwn(target, prop.OBSERVED_ATTRIBUTES)).toBe(
                    true
                );
                expect(
                    Object.hasOwn(target, prop.UPGRADABLE_PROPERTIES_SET)
                ).toBe(true);

                expect(target[prop.OBSERVED_ATTRIBUTES]).toEqual([
                    'testing',
                    attr.LAYOUT_ORIENTATION,
                ]);

                expect(target[prop.UPGRADABLE_PROPERTIES_SET]).toEqual(
                    new Set().add('test').add('testing')
                );
            });
        });

        describe('that defines an internal map', function () {
            it('on a basic unconfigured class', function () {
                const config = { internals };
                let target = basic.prototype;
                expect(target[prop.INTERNALS_MAP]).toBeUndefined();
            });
        });

        // describe('that defines states', function () {
        //     it('on a basic, unconfigured class', function () {
        //         const config = { states };

        //         let target = basic.prototype;

        //         expect(target[prop.STATES_MAP]).toBeUndefined();

        //         const modified = createSDKElement(basic, config);
        //         expect(Object.hasOwn(modified, prop.STATES_MAP)).toBe(true);

        //         const expectedMap = new Map()
        //             .set('testNoOptions', {})
        //             .set('indeterminate', {
        //                 isDefault: true,
        //                 associatedAriaState: 'ariaChecked',
        //                 ariaValue: 'mixed',
        //             });

        //         expect(modified[prop.STATES_MAP]).toEqual(expectedMap);
        //     });

        //     it('on a class with pre-existing attributes', function () {
        //         const config = { states };

        //         let target = primitive.prototype;

        //         expect(target[prop.STATES_MAP]).toBeUndefined();

        //         const modified = createSDKElement(primitive, config);
        //         expect(Object.hasOwn(modified, prop.STATES_MAP)).toBe(true);

        //         const expectedMap = new Map()
        //             .set('testNoOptions', {})
        //             .set('testing', {})
        //             .set('indeterminate', {
        //                 isDefault: true,
        //                 associatedAriaState: 'ariaChecked',
        //                 ariaValue: 'mixed',
        //             });

        //         expect(modified[prop.STATES_MAP]).toEqual(expectedMap);
        //     });
        // });

        // describe('that defines aria', function () {
        //     it('role only', function () {
        //         expect(basic.role).toBeUndefined();
        //         expect(basic.prototype[prop.ARIA_MAP]).toBeUndefined();
        //         const modified = createSDKElement(basic, {
        //             aria: { role: 'checkbox' },
        //         });
        //         expect(modified.role).toBe('checkbox');
        //         expect(modified[prop.ARIA_MAP]).toBeUndefined();
        //     });

        //     it('properties and states only', function () {
        //         expect(basic.role).toBeUndefined();
        //         expect(basic.prototype[prop.ARIA_MAP]).toBeUndefined();

        //         const modified = createSDKElement(basic, {
        //             aria: { propertiesAndStates: internals.propertiesAndStates },
        //         });
        //         expect(modified.role).toBeUndefined();
        //         expect(modified[prop.ARIA_MAP]).toBeDefined();
        //     });

        //     it('role, properties, and states on a basic, unconfigured class', function () {
        //         const config = { aria: internals };

        //         expect(basic.role).toBeUndefined();
        //         expect(basic[prop.ARIA_MAP]).toBeUndefined();

        //         let modified = createSDKElement(basic, config);

        //         expect(modified.role).toBe('checkbox');
        //         expect(modified[prop.ARIA_MAP]).toBeDefined();
        //     });

        //     it('on a class with pre-existing attributes', function () {
        //         const config = { aria: internals };
        //         const initialMap = new Map().set('testing', {});

        //         expect(primitive.role).toBe('combobox');
        //         expect(primitive[prop.ARIA_MAP]).toEqual(initialMap);

        //         const modified = createSDKElement(primitive, config);
        //         const finalMap = new Map()
        //             .set('testing', {})
        //             .set('ariaRequired', {})
        //             .set('ariaCurrent', {
        //                 value: 'page',
        //                 isDefault: false,
        //                 allowableValues: ['page', 'true', 'false'],
        //             });
        //         expect(modified.role).toBe('combobox');
        //         expect(modified[prop.ARIA_MAP]).toEqual(finalMap);
        //     });
        // });
    });
});
