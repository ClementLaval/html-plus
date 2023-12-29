import { Constructor } from './base.js';

/**
 * Allow for custom element classes with private constructors
 */
type CustomElementClass = Omit<typeof HTMLElement, 'new'>;

export type CustomElementDecorator = (
  name: string,
  options?: ElementDefinitionOptions
) => (
  target: CustomElementClass,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
) => void;

export const customElement: CustomElementDecorator =
  (name, options) => (target, context) => {
    if (context.kind !== 'class') {
      throw new Error(
        '@customElement() decorator should be used on class only'
      );
    }
    customElements.define(name, target as CustomElementConstructor, options);
  };