import { Constructor } from './base.js';
import { xAttribute } from '../helpers/xAttribute.js';
import type { ClassDecoratorMetadata, DecoratorMetadata, EventDecoratorMetadata } from '../types';

/**
 * Use the @customElement decorator to register your custom element.
 * Place this decorator on top of your web component class.
 * Ensure that the tag name follows the two-part format and includes a hyphen "-".
 * Refer documentation:
 * https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
 *
 * Example:
 *  - script:
 *    @customElement('my-component')
 *    class MyComponent extends HTMLElement {}
 *
 *  -html:
 *    <my-component></my-component>
 *
 * You can also create customized built-in elements by referencing the HTML type in options.
 * Make sure to specify the appropriate type when extending built-in elements.
 * Tips:
 *  - make sure to use polyfill to get Webkit support [https://unpkg.com/@ungap/custom-elements@1.3.0/min.js]
 *
 * Example:
 *  - script:
 *    @customElement('my-button', {extends: 'button'})
 *    class MyButton extends HTMLButtonElement {}
 *
 *  - html:
 *    <button is="my-button"></button>
 */

export type CustomElementDecorator = (
  // HTML tag name
  name: string,
  // Options (for built-in elements)
  options?: ElementDefinitionOptions
) => (
  target: CustomElementConstructor,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
) => void;

export const customElement: CustomElementDecorator =
  (name, options) => (target, context) => {
    /**
     * Handle decorator position
     */
    if (context.kind !== 'class') {
      throw new Error(
        '@customElement() decorator should be used on class only'
      );
    }

    /**
     * Add metadata
     */
    if (context.name) {
      context.metadata[context.name] = {
        name: context.name,
        kind: context.kind,
      } satisfies ClassDecoratorMetadata;
    }

    /**
     * Add accessors to observedAttributes:
     *  - watch properties and enable reactivity through attributeChangedCallback()
     */
    // retrieve all @property() accessors in current Class
    const properties = Object.entries(
      context.metadata as DecoratorMetadata[]
    ).reduce((acc: string[], [key, value]) => {
      if (value.kind === 'accessor') {
        acc.push(key);
      }
      return acc;
    }, []);
    // retrieve existing observedAttributes
    const observedAttributes =
      target.prototype.constructor.observedAttributes || [];

    // foreach accessors enhanced with @property() decorator
    properties.forEach((property) => {
      if (!observedAttributes.includes(property)) {
        // push property name within observedAttributes
        observedAttributes.push(property);
        Object.defineProperty(target, 'observedAttributes', {
          get: function () {
            return observedAttributes;
          },
        });
      }
    });

    /**
     * Add events to connectedCallback():
     * - assign eventListerner to every targeted nodes at initialization
     */
    // retrieve all @events() in current Class
    const events = Object.entries(
      context.metadata as DecoratorMetadata[]
    ).reduce((acc: EventDecoratorMetadata[], [key, value]) => {
      if (value.kind === 'method') {
        acc.push(value);
      }
      return acc;
    }, []);

    const connectecCallback = target.prototype.connectedCallback;
    target.prototype.connectedCallback = function () {
      // execute existing connectedCallback
      connectecCallback.call(this);

      // foreach events enhanced with @event() decorator
      events.forEach((event) => {
        // retrieve each node per event using x-eventName
        const nodes = this.querySelectorAll(
          `[${xAttribute(event.name)}]`
        ) as HTMLElement[];

        // retrieve method
        const originalMethod = Object.getOwnPropertyDescriptor(
          this.constructor.prototype,
          event.name
        );
        // set a new eventListener for earch node
        nodes.forEach((node) => {
          if (originalMethod) {
            node.addEventListener(event.type, () => {
              originalMethod.value.call(this);
            });
          }
        });
      });

      /**
       * Set DOM attribute with Class property initialValue if not defined
       * If there is no attribute in DOM, the attributeChangedCallback() is not called a start
       * The DOM won't be hydrated until the next property update
       * As @property() decorator can't access DOM directly outside of the accessor.get()
       * Accessor.get() is not called if there is not attribute, then we have do to this on the class decorator
       */

      const missingAttributesInDOM = properties.reduce(
        (acc: string[], property) => {
          if (!this.getAttribute(property)) {
            acc.push(property);
          }
          return acc;
        },
        []
      );

      missingAttributesInDOM.forEach((property) => {
        const classProperty = Object.getOwnPropertyDescriptor(
          this.constructor.prototype,
          property
        );
        if (classProperty?.get) {
          const initialValue = classProperty.get.call(this);
          this.setAttribute(property, initialValue);
        }
      });
    };

    /**
     * Update attributeChangedCallback:
     *  - callback called when reactive property present in observedAttributes is changed
     *  - update DOM
     */
    const attributeChangedCallback = target.prototype.attributeChangedCallback;

    target.prototype.attributeChangedCallback = function (
      name: string,
      oldValue: any,
      newValue: any
    ) {
      // execute existing attributeChangedCallback
      const result = attributeChangedCallback.apply(this, [
        name,
        oldValue,
        newValue,
      ]);

      if (result === false) {
        return;
      }

      // update DOM
      properties.forEach((property) => {
        if (name === property && newValue !== oldValue) {
          const nodes = this.querySelectorAll(
            `[${xAttribute(name)}]`
          ) as HTMLElement[];
          nodes.forEach((node) => (node.textContent = this[name]));
        }
      });
    };

    /**
     * Define custom element globally
     */
    context.addInitializer(function () {
      customElements.define(name, target as CustomElementConstructor, options);
    });

    return undefined;
  };

// TODO: Declare interface to global HTML Tag