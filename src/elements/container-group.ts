import { Container } from './container';

export class ContainerGroup {
    id:         string;
    dragula:    dragula.Drake;
    containers: { [id: string]: Container } = { };

    constructor(init?:Partial<ContainerGroup>) {
        Object.assign(this, init);
    }
}