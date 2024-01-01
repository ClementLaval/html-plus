import { customElement, property } from '../src/index.js';
import { event } from '../src/decorators/event.js';

Symbol.metadata ??= Symbol('Symbol.metadata');

@customElement('my-component')
export class MyComponent extends HTMLElement {
  @property({ type: 'number' })
  accessor count = 32;

  static get observedAttributes() {
    return ['toto'];
  }

  @event({ type: 'click' })
  increment() {
    this.count += 1;
  }

  connectedCallback() {
    // this.increment();
  }

  attributeChangedCallback(name: string) {
    // console.log(name);
    // const els = this.querySelectorAll(`[x-${name}]`);
    // els.forEach((el) => (el.textContent = this[name]));
  }
}