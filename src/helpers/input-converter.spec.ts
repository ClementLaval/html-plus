import { InputConverter } from './input-converter';

describe('Converter Input', () => {
  it('String converter: should return a string', () => {
    // Given a string input
    const value = 'Example string';

    // When convert it with String format
    const converter = new InputConverter(value, { type: 'string' });
    const result = converter.execute();

    // Then should return typeof string
    expect(typeof result).toBe('string');
    expect(result).toBe('Example string');
  });

  it('Number converter: should return a number', () => {
    // Given a valid number as string
    const value = '49843';

    // When convert it with Number format
    const converter = new InputConverter(value, { type: 'number' });
    const result = converter.execute();

    // Then should return typeof number
    expect(typeof result).toBe('number');
    expect(result).toBe(49843);
  });

  it('Boolean converter: should return a boolean', () => {
    // Given a valid boolean as string
    const value = 'false';

    // When convert it with Boolean format
    const converter = new InputConverter(value, { type: 'boolean' });
    const result = converter.execute();

    // Then should return typeof boolean
    expect(typeof result).toBe('boolean');
    expect(result).toBe(false);
  });

  it('Boolean converter: should return a boolean', () => {
    // Given a invalid boolean as string
    const value = '';

    // When convert it with Boolean format
    const converter = new InputConverter(value, { type: 'boolean' });
    const result = converter.execute();

    // Then use Boolean() to determine the result (different of truthy/falsy)
    expect(typeof result).toBe('boolean');
    expect(result).toBe(false);
  });

  it('Object converter: should return a object', () => {
    // Given a valid object as string
    const value = '{"foo": "bar"}';

    // When convert it with Object format
    const converter = new InputConverter(value, { type: 'object' });
    const result = converter.execute();

    // Then should return typeof object
    expect(typeof result).toBe('object');
    expect(result).toMatchObject({ foo: 'bar' });
  });
});