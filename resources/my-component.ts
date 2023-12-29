import { customElement } from '../src/index.js';

@customElement('my-component')
export class MyComponent extends HTMLElement {
  // @property({ type: 'number' })
  // count;

  connectedCallback() {
    // console.log(typeof this.count);
  }
}