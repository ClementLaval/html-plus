import { customElement, property } from '../src/index.js';
import { event } from '../src/decorators/event.js';

Symbol.metadata ??= Symbol('Symbol.metadata');

@customElement('my-component')
export class MyComponent extends HTMLElement {
  @property({ type: 'number' })
  accessor count = 32;

  @property({ type: 'number' })
  accessor count2 = 100;

  static get observedAttributes() {
    return ['toto'];
  }

  @event({ type: 'click' })
  increment() {
    this.count += 1;
  }

  @event({ type: 'click' })
  increment2() {
    this.count2 += 1;
  }

  connectedCallback() {}

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === 'count' && oldValue === null) {
      console.log('First render');
      return true;
    }

    if (name === 'count' && oldValue !== newValue) {
      console.log('NOP BLOCKED');
      return false;
    }
  }
}