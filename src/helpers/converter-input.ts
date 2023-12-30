export type ConverterInputOptions = {
  type?: String | Number | Boolean | Object;
  converter?: Function;
};

export class ConverterInput {
  constructor(
    private value: any,
    public options?: ConverterInputOptions
  ) {}

  execute() {
    switch (this.options?.type) {
      case String: {
        return this.stringToString(this.value);
      }
      case Number: {
        return this.stringToNumber(this.value);
      }
      case Boolean: {
        return this.stringToBoolean(this.value);
      }
      case Object: {
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
    return Boolean(value);
  }

  stringToObject(value: string): Object {
    return JSON.parse(value);
  }
}