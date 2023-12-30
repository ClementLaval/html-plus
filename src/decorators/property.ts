import { ConverterInput, ConverterInputOptions } from '../helpers/converter-input.js';

/**
 * Use @property() decorator on a custom element variable to bind
 * it with the DOM, and automatically track updated.
 *
 * What @property() does:
 *  - Add argument within custom element constructor and html tag
 *  - Add property to current HTML tag
 *  - Convert in/out data, depending on options.type
 *  - Create getter/setter to be sync with html attribute
 *  - Add attribute name to static observedAttributes
 *  - Attach a tracker on DOM elements who access it with 'x-propertyName'
 *
 *  Doc: https://www.youtube.com/watch?v=1hq_tNPWASM&t
 */

type PropertyDefinitionOptions = {
  type?: ConverterInputOptions['type'];
  converter?: () => any;
};

const defaultOptions = {
  type: String,
};

export type PropertyDecorator = (
  options?: PropertyDefinitionOptions
) => <T, V>(
  target: ClassAccessorDecoratorTarget<T, V>,
  context: ClassAccessorDecoratorContext<T, V>
) => ClassAccessorDecoratorTarget<T, V>;

export const property: PropertyDecorator =
  (options = defaultOptions) =>
  (target, context) => {
    /**
     * Handle decorator position
     */
    if (!['accessor'].includes(context.kind)) {
      throw new Error(
        '@property() decorator must be used on auto-accessors only.'
      );
    }

    /**
     * Retrieve DOM attribute
     */
    const attributeName = context.name.toString();

    return {
      get: function (this) {
        /**
         * Retrieve initial value passed on accessor
         * @property({type: Number})
         * accessor count = 42;
         */
        const initialValue = target.get.call(this);

        /**
         * Retrieve data passed in argument on custom element
         * <my-component count="42"></my-component>
         */
        const element = this as HTMLElement;
        let attributeValue = element.getAttribute(attributeName);

        if (attributeValue) {
          attributeValue = new ConverterInput(attributeValue, {
            type: options.type,
            converter: options.converter,
          }).execute();
        }

        /**
         * Return html props by default
         */
        return attributeValue || initialValue;
      },
      set: function (this, value) {
        /**
         * Update internal property with new value
         */
        target.set.call(this, value);

        /**
         * Reflect html attribute with the new value
         */
        const element = this as HTMLElement;
        const attributeValue = element.setAttribute(attributeName, value);
      },
    };
  };