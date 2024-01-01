import { EventDecoratorMetadata } from '../types';

type EventDefinitionOptions = {
  type: Event['type'];
};

export const event = <T, V>(options: EventDefinitionOptions) => {
  return (target: Function, context: ClassMethodDecoratorContext<T>) => {
    //Handle decorator position
    if (!['method'].includes(context.kind)) {
      throw new Error('@event() decorator must be used on methods only.');
    }

    /**
     * Add metadata
     * Used by main Class Decorator to set some behaviors
     * - Add to connectedCallback(): set eventListener on DOM elements
     * - Add to disconnectedCallback(): remove eventListener when node unmount
     */
    if (context.name) {
      context.metadata[context.name] = {
        name: context.name.toString(),
        kind: context.kind,
        type: options.type,
      } satisfies EventDecoratorMetadata;
    }
  };
};