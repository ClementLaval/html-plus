import { xAttribute } from './xAttribute';

describe('xAttribute', () => {
  it('String input: should return xAttribute format', () => {
    // Given an attribute name as string
    const attributeName = 'count';

    // When format to xAttribute
    const result = xAttribute(attributeName);

    // Then should return xAttribute as string
    expect(result).toBe('x-count');
    expect(typeof result).toBe('string');
  });

  it('Symbol input: should return xAttribute format', () => {
    // Given an attribute name as string
    const attributeName = Symbol('count');

    // When format to xAttribute
    const result = xAttribute(attributeName);

    // Then should return xAttribute as string
    expect(result).toBe('x-count');
    expect(typeof result).toBe('string');
  });
});