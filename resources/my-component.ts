import { customElement, property } from '../src/index.js';
import { event } from '../src/decorators/event.js';

@customElement('my-component')
export class MyComponent extends HTMLElement {
  @property({ type: 'number' })
  accessor count = 32;

  @property({ type: 'number' })
  accessor count2 = 10;

  // static get observedAttributes() {
  //   return ['toto'];
  // }

  @event({ type: 'click' })
  increment() {
    this.count += 1;
  }

  @event({ type: 'click' })
  handleIncrement(e: Event) {
    this.increment2(this.count2 % 2 === 0 ? 1 : -1);
  }

  increment2(number: number) {
    this.count2 += number;
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