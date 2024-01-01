import { xAttribute } from '../xAttribute.js';
import { EventDecoratorMetadata } from '../../types';

/**
 * Add events to connectedCallback():
 * - assign eventListener to every targeted nodes at initialization
 */
export const setEventListerners = (
  target: CustomElementConstructor,
  events: EventDecoratorMetadata[]
): void => {
  // retrieve existing connectedCallback
  const connectecCallback = target.prototype.connectedCallback;

  target.prototype.connectedCallback = function () {
    // execute existing connectedCallback
    connectecCallback.call(this);

    // foreach methods with @event() decorator
    events.forEach((event) => {
      // retrieve each node per event using x-eventName
      const nodes = this.querySelectorAll(
        `[${xAttribute(event.name)}]`
      ) as HTMLElement[];

      // retrieve method
      const originalMethod = Object.getOwnPropertyDescriptor(
        this.constructor.prototype,
        event.name
      );

      // set a new eventListener for earch node
      nodes.forEach((node) => {
        if (originalMethod) {
          // TODO: inject 'e' as last argument
          node.addEventListener(event.type, (e) => {
            originalMethod.value.call(this, e);
          });
        }
      });
    });
  };
};