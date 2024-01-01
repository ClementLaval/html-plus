/**
 * Add accessors to observedAttributes:
 *  - watch properties and enable reactivity through attributeChangedCallback()
 */

export const setObservedAttributes = (
  target: CustomElementConstructor,
  properties: string[]
): void => {
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
        configurable: true,
      });
    }
  });
};