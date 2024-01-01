import { customElement } from './decorators/custom-element.js';
import { property } from './decorators/property.js';

Symbol.metadata ??= Symbol('Symbol.metadata');

export { customElement, property };