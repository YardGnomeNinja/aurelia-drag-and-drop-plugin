export class Container {
    id:     string;
    items:  Array<any> = new Array<any>();

    constructor(init?:Partial<Container>) {
        Object.assign(this, init);
    }
}