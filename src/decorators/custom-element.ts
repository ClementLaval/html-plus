import { Constructor } from './base';
import type { ClassDecoratorMetadata } from '../types';
import { getClassProperties } from '../helpers/property/getClassProperties';
import { setObservedAttributes } from '../helpers/property/setObservedAttributes';
import { getClassEvents } from '../helpers/event/getClassEvents';
import { setEventListerners } from '../helpers/event/setEventListerners';
import { initDomAttributes } from '../helpers/property/initDomAttributes';
import { setAttributeChangedCallback } from '../helpers/property/setAttributeChangedCallback';

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

    // Add metadata
    if (context.name) {
      context.metadata[context.name] = {
        name: context.name,
        kind: context.kind,
      } satisfies ClassDecoratorMetadata;
    }

    //  Retrieve all @property() accessors in current Class
    const properties = getClassProperties(context);

    // Update observedAttributes with properties
    setObservedAttributes(target, properties);

    // Retrieve all @events() in current Class
    const events = getClassEvents(context);

    // Set eventListeners on @events() targets
    setEventListerners(target, events);

    // Init and sync dom attributes for first render
    initDomAttributes(target, properties);

    // Set property callback used when tracked properties changed
    setAttributeChangedCallback(target, properties);

    context.addInitializer(function () {
      // Define custom element globally
      customElements.define(name, target as CustomElementConstructor, options);
    });
  };

// TODO: Declare interface to global HTML Tag