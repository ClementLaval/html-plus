import { customElement, property } from '../src/index.js';

@customElement('my-component')
export class MyComponent extends HTMLElement {
  @property({ type: 'number' })
  accessor count = 32;

  // static get observedAttributes() {
  //   return ['count'];
  // }

  increment() {
    this.count += 1;
  }

  connectedCallback() {
    this.increment();
    setTimeout(() => this.increment(), 2000);
  }

  attributeChangedCallback(name: string) {
    console.log(name);
    const els = this.querySelectorAll(`[x-${name}]`);
    els.forEach((el) => (el.textContent = this[name]));
  }
}