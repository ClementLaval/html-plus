import { InputConverter, InputConverterOptions } from '../helpers/input-converter.js';

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
     * Retrieve DOM attribute
     */
    const attributeName = context.name.toString();

    /**
     * Define observedAttributes on the constructor with attributeName to reflect updates
     */
    context.addInitializer(function (this: T) {
      const observedAttributes = this.constructor.observedAttributes || [];
      if (!observedAttributes.includes(attributeName)) {
        observedAttributes.push(attributeName);
        this.constructor.observedAttributes = observedAttributes;
      }
    });

    /**
     * Set new accessor definition
     */
    return {
      get: function (this: T) {
        /**
         * Retrieve initial value passed on accessor
         * @property({type: Number})
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
        return parsedAttributeValue || initialValue;
      },

      set: function (this: T, value: any) {
        /**
         * Update internal property with new value
         */
        target.set.call(this, value);

        const observedAttributes = this.constructor.observedAttributes || [];
        if (!observedAttributes.includes(attributeName)) {
          observedAttributes.push(attributeName);
          this.constructor.observedAttributes = observedAttributes;
        }

        /**
         * Reflect html attribute with the new value
         */
        const element = this as HTMLElement;
        element.setAttribute(attributeName, value.toString());
      },
    };
  };
};