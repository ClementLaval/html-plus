import { Constructor } from './base.js';

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
    // Handle decorator position
    if (context.kind !== 'class') {
      throw new Error(
        '@customElement() decorator should be used on class only'
      );
    }
    // Define custom element globally
    customElements.define(name, target as CustomElementConstructor, options);
  };

// TODO: Declare interface to global HTML Tag