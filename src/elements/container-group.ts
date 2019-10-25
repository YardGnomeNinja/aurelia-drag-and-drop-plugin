import { Container } from './container';

export class ContainerGroup {
    containers: { [id: string]: Container } = { };
    copy: any;
    copySortSource: boolean;
    dragula: dragula.Drake;
    id: string;

    constructor(init?:Partial<ContainerGroup>) {
        Object.assign(this, init);
    }
}