/**
 * Set DOM attribute with Class property initialValue if not defined
 * If there is no attribute in DOM, the attributeChangedCallback() is not called a start
 * The DOM won't be hydrated until the next property update
 * As @property() decorator can't access DOM directly outside of the accessor.get()
 * Accessor.get() is not called if there is not attribute, then we have do to this on the class decorator
 */
export const initDomAttributes = (
  target: CustomElementConstructor,
  properties: string[]
): void => {
  // retrieve existing connectedCallback
  const connectecCallback = target.prototype.connectedCallback;

  target.prototype.connectedCallback = function () {
    // execute existing connectedCallback
    connectecCallback.call(this);

    const missingAttributesInDOM = properties.reduce(
      (acc: string[], property) => {
        if (this.getAttribute(property) === null) {
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
};