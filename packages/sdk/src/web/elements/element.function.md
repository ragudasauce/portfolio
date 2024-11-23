# The Element Functions

SDK components abstract common boilerplate setup and standardize component structure so configured and extended components are memory efficient, well tested, documented, and easy to use, configure, and further extend.

## Factory Constructors

There are two factory constructors available to authors:

-   `createSDKElement` which is used to create a pattern whose scope should be general enough to handle several use cases. For example, a common class for custom `form` elements that would share states, accessability, and validation methods.
-   `createWebComponent` which is used to create and register a web component. Using the previous example for a custom form SDK Element, extending that SDKFormElement into a toggle button, combo box, or other custom web component whose value should be included in form submissions.

## Configuration API

Component authors should use the Configuration API to create SDK and Web Component elements. The API exposes these configuration options:

-   Aria
-   Attributes
-   Internals
-   States

Under the hood, the `createSDKElement` and `createWebComponent` factory functions use the configuration object to write properties on a target class's prototype through [Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

### Configuration Aria API

### Configuration Attributes API

HTML Elements have two interfaces for attributes: the [IDL and content interfaces](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#content_versus_idl_attributes).

-   IDL interface is accessible through JavaScript (.) dot notation, e.g.: `element.href`
-   Content interface is set through the HTML tag, e.g.: `<a href="somelink.html">`

The Attributes API defines a contract based upon the arguments passed to [Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). Everything but the name is optional.

#### `name` 

The property name. The provided string will be sanatized to include only a-z, converted to camelCase, and used as the IDL interface name, which is in converted to kebab-case for use in the Content interface. 

#### `upgradable` `optional`

A developer might attempt to set a property on your element before its definition has been loaded. This is especially true if the developer is using a framework which handles loading components, inserting them into to the page, and binding their properties to a model. [Read more on web.dev](https://web.dev/articles/custom-elements-best-practices#make_properties_lazy)

The `SDKBaseElement` provides a `connectedCallback` lifecyle event which will look for attributes that have been marked as upgradable and then run. [See the documentation]().

#### `observable` `optional`

Enabling this option will include the Content interface name in the `static get observedAttributes` return array, which is used by web components to [respond to changes].(https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes).

#### `associatedAria` `optional`


#### `descriptor` `optional`

The [configuration options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description) for the attribute.


#### Contract and Example

```javascript
/** Attribute Configuration Definition
 * @typedef { object } AttributeConfiguration
 * @property { string } name
 * @property { boolean } [upgradable]
 * @property { boolean } [observable]
 * @property { string } [associatedAria]
 * @property { string[] | boolean[] } [allowableValues]
 * @property { AttributeDataDescriptor | AttributeAccessorDescriptor } [descriptor]
 */

{
    attributes: [
        {
            name: 'kebob-case',
            upgradable: true,
            descriptor: { value: 1 },
        }, 
        {
            name: 'camelCase',
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
            name: prop.SOME_CONSTANT,
            observable: true,
            allowableValues: [VALUE1, VALUE2],
            descriptor: {
                set(value) {
                    this.setAttribute(attr.SOME_CONSTANT, value);
                },
                get() {
                    return this.hasAttribute(attr.SOME_CONSTANT)
                        ? this.getAttribute(attr.SOME_CONSTANT)
                        : VALUE1;
                }
            }
        }
    ]
}
```


### Configuration Internals API

### Configuration States API
