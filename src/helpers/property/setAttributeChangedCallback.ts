import { xAttribute } from '../xAttribute.js';

/**
 * Update attributeChangedCallback:
 *  - callback called when reactive property present in observedAttributes is changed
 *  - update DOM
 */
export const setAttributeChangedCallback = (
  target: CustomElementConstructor,
  properties: string[]
): void => {
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

    if (result === false || result === null) {
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
};