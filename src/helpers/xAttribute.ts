export const xAttribute = (name: string | Symbol): string => {
  let attributeName;

  if (typeof name === 'string') {
    attributeName = name;
  }

  if (typeof name === 'symbol') {
    const symbolInfoMap = new Map();
    symbolInfoMap.set(name, 'count');
    attributeName = symbolInfoMap.get(name);
  }
  return `x-${attributeName.toString()}`;
};