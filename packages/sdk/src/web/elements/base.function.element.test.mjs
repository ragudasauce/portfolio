import { describe, test, expect, beforeAll } from 'vitest';
import { TestClass, BaseComponent } from './base.function.element.mjs';
// import { page, render } from '@vitest/browser/context';
// import { $ } from 'webdriverio';

describe('the TestClass Class', () => {
    beforeAll(() => {
        customElements.define('test-component', TestClass);
    });
    test('the class to be defined', () => {
        expect(TestClass).toBeDefined();
        expect(BaseComponent).toBeDefined();
    });

    test('base class properties', () => {
        expect(Object.hasOwn(BaseComponent, 'testing')).toBeDefined();
        expect(Object.hasOwn(TestClass, 'testing')).toBeDefined();
    });

    test('the class to be an HTML element', () => {
        const component = document.createElement('test-component');
        expect(component instanceof HTMLElement).toBe(true);
        expect(component instanceof BaseComponent).toBe(true);
    });

    test('should have properties', () => {
        const component = document.createElement('test-component');
        // document.body.appendChild(component)
        expect(component.internals).toBeDefined();
        expect(component.internals.states).toBeDefined();
        expect(component.testing).toBe(1);
        expect(component.testingIt).toBe('yes');
        component.testingIt = 'no';
        expect(component.settable).toBe('no');
        component.settable = 'yes';
        expect(component.settable).toBe('yes');

        // console.log(Object.hasOwn(BaseComponent, 'observableAttributes'))

        component.setAttribute('testing', '4')
        // console.log(component.observableAttributes)
    });

    test('append child', async () => {
        // const test  = render(<test-component></test-component>);
        // cons
        // await expect.element(page)
        // const body = page.elementLocator(body);
        // console.log(body);
        // const component = document.createElement('test-component');
        // const body = await $('body');
        // body.append(component)
    })
});
