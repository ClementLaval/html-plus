import { Constructor } from '../../decorators/base';
import { type DecoratorMetadata, EventDecoratorMetadata } from '../../types';

/**
 * Return methods from Class context extended with @event() decorator
 */
export const getClassEvents = (
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): EventDecoratorMetadata[] => {
  return Object.entries(context.metadata as DecoratorMetadata[]).reduce(
    (acc: EventDecoratorMetadata[], [key, value]) => {
      if (value.kind === 'method') {
        acc.push(value);
      }
      return acc;
    },
    []
  );
};