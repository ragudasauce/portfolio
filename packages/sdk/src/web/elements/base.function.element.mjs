import { createAttributeDescription } from '../utilities/attributes.utilities.mjs';

export function createBaseClass(config) {
    const component = class extends HTMLElement {
        static staticProperty = 'intial';
        testingIt = 'yes';
        internals = this.attachInternals();

        constructor() {
            super();
        }

        static get observableAttributes() {
            return ['testing'];
        }

        attributeChangedCallback(name, oldVal, newVal) {
            console.log(name, oldVal, newVal);
        }
    };

    config.attributes.forEach((attribute) => {
        const options = createAttributeDescription(attribute.options);
        Object.defineProperty(component.prototype, attribute.name, options);
    });

    return component;
}

export const BaseComponent = createBaseClass({
    attributes: [
        {
            name: 'testing',
            options: {
                value: 1,
            },
        },
        {
            name: 'settable',
            options: {
                set(value) {
                    this.testingIt = value;
                },
                get() {
                    return this.testingIt;
                },
            },
        },
    ],
});

export class TestClass extends BaseComponent {
    constructor() {
        super();
    }
}
