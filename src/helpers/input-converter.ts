export type InputConverterOptions = {
  type?: 'string' | 'number' | 'boolean' | 'object';
  converter?: Function;
};

export class InputConverter {
  constructor(
    private value: string,
    public options?: InputConverterOptions
  ) {}

  execute() {
    switch (this.options?.type) {
      case 'string': {
        return this.stringToString(this.value);
      }
      case 'number': {
        return this.stringToNumber(this.value);
      }
      case 'boolean': {
        return this.stringToBoolean(this.value);
      }
      case 'object': {
        return this.stringToObject(this.value);
      }

      default:
        throw new Error('Can not detect property type');
    }
  }

  stringToString(value: string): string {
    // TODO: add xss check
    return value.toString();
  }

  stringToNumber(value: string): number {
    return Number(value);
  }

  stringToBoolean(value: string): boolean {
    const trueStr = 'true';
    const falseStr = 'false';

    if (value.toLowerCase() === trueStr) {
      return true;
    }
    if (value.toLowerCase() === falseStr) {
      return false;
    }

    return Boolean(value);
  }

  stringToObject(value: string): Object {
    return JSON.parse(value);
  }
}