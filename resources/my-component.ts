import { customElement, property } from '../src/index.js';

@customElement('my-component')
export class MyComponent extends HTMLElement {
  @property({ type: Number })
  accessor count = 32;

  increment() {
    this.count += 1;
  }

  connectedCallback() {
    // this.increment();
    console.log(this.count);
    // console.log(typeof this.count);
  }
}