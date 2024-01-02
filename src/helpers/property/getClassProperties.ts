import type { DecoratorMetadata } from '../../types';
import { Constructor } from '../../decorators/base';

/**
 * Return accessors properties from Class context extended with @property() decorator
 */
export const getClassProperties = (
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): string[] => {
  return Object.entries(context.metadata as DecoratorMetadata[]).reduce(
    (acc: string[], [key, value]) => {
      if (value.kind === 'accessor') {
        acc.push(key);
      }
      return acc;
    },
    []
  );
};