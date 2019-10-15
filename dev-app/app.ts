import { DragAndDropController } from 'elements/drag-and-drop-controller';

/**
 * UNBREAKABLE RULES:
 *      Items can ONLY be exchanged between containers in the same group.
 *      The first/topmost container in the group defines the following for the entire group:
 *          Events (drag, drop, remove, etc.)
 */

 interface ContainerItem {
    id: string, propertyA: string, propertyB: number
 }

export class App {
    dragAndDropController: DragAndDropController;
    container0Items: Array<ContainerItem> = new Array<ContainerItem>();
    container1Items: Array<ContainerItem> = new Array<ContainerItem>();
    container2Items: Array<ContainerItem> = new Array<ContainerItem>();
    container3Items: Array<number> = new Array<number>();

    attached() {
        this.dragAndDropController = new DragAndDropController(this);
    }

    bind() {
        this.container0Items.push({ id: "1", propertyA: "item1 propA (container0)", propertyB: 1 });
        this.container0Items.push({ id: "2", propertyA: "item2 propA (container0)", propertyB: 2 });
        this.container0Items.push({ id: "3", propertyA: "item3 propA (container0)", propertyB: 3 });

        this.container1Items.push({ id: "4", propertyA: "item4 propA (container1)", propertyB: 4 });
        this.container1Items.push({ id: "5", propertyA: "item5 propA (container1)", propertyB: 5 });

        this.container2Items.push({ id: "6", propertyA: "item6 propA (container2)", propertyB: 6 });

        this.container3Items.push(112263);
    }

    click_test() {
        console.log(this.dragAndDropController.containerGroups["containerGroup0"].containers.find((x) => { return x.id == "container0" }).children);
        console.log(this.dragAndDropController.containerGroups["containerGroup0"].containers.find((x) => { return x.id == "container1" }).children);
        console.log(this.dragAndDropController.containerGroups["containerGroup0"].containers.find((x) => { return x.id == "container2" }).children);
        console.log(this.dragAndDropController.containerGroups["alphaOmega"].containers.find((x) => { return x.id == "container3" }).children);

        console.log(this.dragAndDropController.containerGroups["containerGroup0"].containers.find((x) => { return x.id == "container0" }).children[0])
    }

    cancel_handler0(el: Element, container, source) {
        console.log(`-- cancel_handler0(el, container, source) --`);
        console.log(el);
        console.log(container);
        console.log(source);
        console.log(`--------------------------------------------`);
    }

    cloned_handler0(clone, original, type) {
        console.log(`-- cloned_handler0(clone, original, type) --`);
        console.log(clone);
        console.log(original);
        console.log(type);
        console.log(`--------------------------------------------`);
    }

    drag_handler0(el: Element, source) {
        console.log(`-- drag_handler0(el, source) --`);
        console.log(el);
        console.log(source);
        console.log(`-------------------------------`);
    }

    dragend_handler0(el: Element) {
        console.log(`-- dragend_handler0(el) --`);
        console.log(el);
        console.log(`---------------------------`);

        let dataModel = el.getAttribute('data-model');
        if (dataModel && dataModel.trim() != '') {
            console.log(dataModel)
        }
    }

    drop_handler0(el: Element, target, source, sibling) {
        console.log(`-- drop_handler0(el, target, source, sibling) --`);
        console.log(el);
        console.log(target);
        console.log(source);
        console.log(sibling);
        console.log(`------------------------------------------------`);
    }

    out_handler0(el: Element, container, source) {
        console.log(`-- out_handler0(el, container, source) --`);
        console.log(el);
        console.log(container);
        console.log(source);
        console.log(`------------------------------------------`);
    }

    over_handler0(el: Element, container, source) {
        console.log(`-- over_handler0(el, container, source) --`);
        console.log(el);
        console.log(container);
        console.log(source);
        console.log(`------------------------------------------`);
    }

    remove_handler0(el: Element, container, source) {
        console.log(`-- remove_handler0(el, container, source) --`);
        console.log(el);
        console.log(container);
        console.log(source);
        console.log(`--------------------------------------------`);
    }

    shadow_handler0(el: Element, container, source) {
        console.log(`-- shadow_handler0(el, container, source) --`);
        console.log(el);
        console.log(container);
        console.log(source);
        console.log(`--------------------------------------------`);
    }
}