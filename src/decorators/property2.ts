type Options = {
  type?: 'string' | 'number' | 'boolean' | 'object';
  reflect?: boolean;
};

const defaultOptions: Options = {
  type: 'string',
  reflect: true,
};

export const property = (options: Options = defaultOptions) => {
  return function (target: any, key: string) {
    const attributeName = key;

    Object.defineProperty(target, key, {
      get: function () {
        let value = this.getAttribute(attributeName);

        if (options.type === 'number') {
          return Number(value);
        }

        if (options.type === 'boolean') {
          return Boolean(value);
        }

        if (options.type === 'object') {
          return JSON.parse(value);
        }

        // default String
        return String(value);
      },
      set: function (value: any) {
        if (options.type === 'number') {
          value = Number(value);
        }
        if (value !== null) {
          this.setAttribute(attributeName, value.toString());
        } else {
          this.removeAttribute(attributeName);
        }
      },
      enumerable: true,
      configurable: true,
    });

    const observedAttributes = target.constructor.observedAttributes || [];
    if (!observedAttributes.includes(attributeName)) {
      observedAttributes.push(attributeName);
      target.constructor.observedAttributes = observedAttributes;
    }
  };
};