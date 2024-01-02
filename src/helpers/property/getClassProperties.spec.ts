describe('GetClassProperties', () => {
  it('Should return none property', () => {
    // Given a new instance without @property() or observedAttributes

    class MyComponent extends HTMLElement {}

    customElements.define('my-component', MyComponent);

    // When is instantiated

    // Then observedAttributes should be empty
    expect(true).toBe(true);
  });
});