import { InputConverter, InputConverterOptions } from '../helpers/input-converter';
import { PropertyDecoratorMetadata } from '../types';

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
  type?: InputConverterOptions['type'];
  converter?: () => any;
};

const defaultOptions: PropertyDefinitionOptions = {
  type: 'string',
};

export const property = <T, V>(
  options: PropertyDefinitionOptions = defaultOptions
) => {
  return (
    target: ClassAccessorDecoratorTarget<T, V>,
    context: ClassAccessorDecoratorContext<T, V>
  ) => {
    /**
     * Handle decorator position
     */
    if (!['accessor'].includes(context.kind)) {
      throw new Error(
        '@property() decorator must be used on auto-accessors only.'
      );
    }

    /**
     * Add metadata
     * Used by main Class Decorator to set some behaviors
     * - Add to observedAttributes: enable reactivity
     * - Add to attributeChangedCallback(): track updates and change DOM
     */
    if (context.name) {
      context.metadata[context.name] = {
        name: context.name.toString(),
        kind: context.kind,
      } satisfies PropertyDecoratorMetadata;
    }

    /**
     * Retrieve DOM attribute
     */
    const attributeName = context.name.toString();

    /**
     * Set new accessor definition
     */
    return {
      get: function (this: T) {
        /**
         * Retrieve initial value passed on accessor
         * @property({type: 'number'})
         * accessor count = 42;
         */
        const initialValue: V = target.get.call(this);

        /**
         * Retrieve data passed in argument on custom element
         * <my-component count="42"></my-component>
         */
        const element = this as HTMLElement;
        const attributeValue = element.getAttribute(attributeName);

        /**
         * Convert attribute value into selected type
         */
        let parsedAttributeValue;

        if (attributeValue) {
          const converter = new InputConverter(attributeValue, {
            type: options.type,
            converter: options.converter,
          });
          parsedAttributeValue = converter.execute();
        }

        /**
         * Return html props by default
         */
        return parsedAttributeValue ?? initialValue;
      },

      set: function (this: T, value: any) {
        /**
         * Reflect html attribute with the new value
         * By setting html attribute, it does active web component reactivity
         * Class value are automatically updated
         */
        const rootElement = this as HTMLElement;
        rootElement.setAttribute(attributeName, value.toString());
      },
    };
  };
};