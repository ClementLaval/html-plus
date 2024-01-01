HTML PLUS
---
Enhance your static HTML declaratively with HTML Plus. Easily add dynamic features through web components for an
enriched and extensible user experience.

Required:

- Typescript 5.2 minimum
- Polifyll for Webkit [https://unpkg.com/@ungap/custom-elements@1.3.0/min.js]()

```json
// tsconfig
"target": "es2022",
"lib": [
"es2022",
"esnext.decorators",
"dom"
],
"emitDecoratorMetadata": true,
"experimentalDecorators": false,
```

```ts
// main.js
Symbol.metadata ??= Symbol('Symbol.metadata');
```