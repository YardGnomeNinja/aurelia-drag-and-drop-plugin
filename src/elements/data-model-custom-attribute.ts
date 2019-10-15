/**
 * Allows a JSON representation of an object to be attached to an element.
 */
export class DataModelCustomAttribute {
    static inject = [Element];

    element: Element;
    value: any;

    constructor(element: Element) {
        this.element = element;
    }

    bind() {
        this.element.setAttribute('data-model', JSON.stringify(this.value));
    }
}