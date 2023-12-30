type XAttribute = (name: string | Symbol) => string;

export const xAttribute: XAttribute = (name) => {
  return `x-${name.toString()}`;
};