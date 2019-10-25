import { DragAndDropController } from 'elements/drag-and-drop-controller';

/**
 * UNBREAKABLE RULES:
 *      Items can ONLY be exchanged between containers in the same group.
 *      The first/topmost container in the group defines the following for the entire group. 
 *          Event Handlers (drag, drop, remove, etc.)
 *          Options (copy, direction, removeOnSpill, etc.)
 */


export class App {
    dragAndDropController: DragAndDropController;

    // If desired, store the container items during bind() and register them with the DragAndDropController in attached().
    // However, be sure to use the DragAndDropController to manage and retrieve the items for info regarding their current container and current position.
    itemsA: Array<any> = new Array<any>();
    itemsB: Array<any> = new Array<any>();
    itemsC: Array<any> = new Array<any>();
    itemsD: Array<any> = new Array<any>();

    bind() {
        // Items can be retrieved during bind. However, note that they must be registered with the DragAndDropController in attached().
        this.itemsA.push({ id: "1", propertyY: "item1 propY (origin: container0)", propertyZ: 1, methodABC: function(param) { console.log(`${param}`); return param; } });
        this.itemsA.push({ id: "2", propertyY: "item2 propY (origin: container0)", propertyZ: 2, methodABC: function(param) { console.log(`${param}`); return param; } });
        this.itemsA.push({ id: "3", propertyY: "item3 propY (origin: container0)", propertyZ: 3, methodABC: function(param) { console.log(`${param}`); return param; } });

        this.itemsB.push({ id: "4", propertyY: "item4 propY (origin: container1)", propertyZ: 4 });
        this.itemsB.push({ id: "5", propertyY: "item5 propY (origin: container1)", propertyZ: 5 });

        this.itemsC.push({ id: "6", propertyY: "item6 propY (origin: container2)", propertyZ: 6 });

        this.itemsD.push(123456);
        this.itemsD.push("987654");
    }

    attached() {
        // DragAndDropController must be initialized in attached() as this is the earliest the HTML is available to the lifecycle.
        // DragAndDropController will register any element on the page that meets the following criteria:
        //      Element's class attribute contains: 'js-drag-and-drop-container'
        //      Element has attribute: data-container-group="<group name>"
        this.dragAndDropController = new DragAndDropController(this);

        // Items must be registered with the DragAndDropController.
        this.dragAndDropController.registerContainerItems("containerGroup0", "container0", this.itemsA);
        this.dragAndDropController.registerContainerItems("containerGroup0", "container1", this.itemsB);
        this.dragAndDropController.registerContainerItems("containerGroup0", "container2", this.itemsC);
        this.dragAndDropController.registerContainerItems("alphaOmega", "container3", this.itemsD);
    }

    click_me() {
        // // What's the DragAndDropController look like?
        // console.log(this.dragAndDropController)

        // // What's containerGroup0 look like?
        // console.log(this.dragAndDropController.getContainerGroup('containerGroup0'));
        // console.log(this.dragAndDropController.containerGroups.containerGroup0)
        
        // // What's container0 look like?
        // console.log(this.dragAndDropController.getContainer('containerGroup0', 'container0'));
        // console.log(this.dragAndDropController.containerGroups.containerGroup0.containers.container0)
        
        // // What items are in container0?
        // console.log(this.dragAndDropController.getContainerItems('containerGroup0', 'container0'));
        // console.log(this.dragAndDropController.containerGroups.containerGroup0.containers.container0.items)

        console.log('-------------------------------------------------------')
        let containerGroup0Container0Items = this.dragAndDropController.getContainerItems('containerGroup0', 'container0');
        let containerGroup0Container1Items = this.dragAndDropController.getContainerItems('containerGroup0', 'container1');
        let containerGroup0Container2Items = this.dragAndDropController.getContainerItems('containerGroup0', 'container2');

        console.log('containerGroup0, container0, contains...')
        for (let container0Item of containerGroup0Container0Items) {
            console.log(container0Item.id)
        }
        
        console.log('containerGroup0, container1, contains...')
        for (let container1Item of containerGroup0Container1Items) {
            console.log(container1Item.id)
        }
        
        console.log('containerGroup0, container2, contains...')
        for (let container2Item of containerGroup0Container2Items) {
            console.log(container2Item.id)
        }
        
        console.log('-------------------------------------------------------')

        let alphaOmegaContainer3Items = this.dragAndDropController.getContainerItems('alphaOmega', 'container3');
        
        console.log('alphaOmega, container3, contains...')
        for (let container3Item of alphaOmegaContainer3Items) {
            console.log(container3Item)
        }

        console.log('-------------------------------------------------------')
    }

    cancel_handler0(el: Element, container, source) {
        // console.log(`-- cancel_handler0(el, container, source) --`);
        // console.log(el);
        // console.log(container);
        // console.log(source);
        // console.log(`--------------------------------------------`);
    }

    cloned_handler0(clone, original, type) {
        // console.log(`-- cloned_handler0(clone, original, type) --`);
        // console.log(clone);
        // console.log(original);
        // console.log(type);
        // console.log(`--------------------------------------------`);
    }

    copy_check(el, source) {
        // console.log('copy check')
        return true;
    }
   
    drag_handler0(el: Element, source) {
        // console.log(`-- drag_handler0(el, source) --`);
        // console.log(el);
        // console.log(source);
        // console.log(`-------------------------------`);
    }

    drag_handler1(el: Element, source) {
        // console.log(`-- drag_handler1(el, source) --`);
        // console.log(el);
        // console.log(source);
        // console.log(`-------------------------------`);
    }

    dragend_handler0(el: Element) {
        // console.log(`-- dragend_handler0(el) --`);
        // console.log(el);
        // console.log(el.previousElementSibling)
        // console.log(`---------------------------`);
    }

    dragend_handler1(el: Element) {
        // console.log(`-- dragend_handler0(el) --`);
        // console.log(el);
        // console.log(`---------------------------`);
    }

    drop_handler0(el: Element, target, source, sibling) {
        // console.log(`-- drop_handler0(el, target, source, sibling) --`);
        // console.log(el);
        // console.log(target);
        // console.log(source);
        // console.log(sibling);
        // console.log(`------------------------------------------------`);
    }

    drop_handler1(el: Element, target, source, sibling) {
        // console.log(`-- drop_handler0(el, target, source, sibling) --`);
        // console.log(el);
        // console.log(target);
        // console.log(source);
        // console.log(sibling);
        // console.log(`------------------------------------------------`);
    }

    out_handler0(el: Element, container, source) {
        // console.log(`-- out_handler0(el, container, source) --`);
        // console.log(el);
        // console.log(container);
        // console.log(source);
        // console.log(`------------------------------------------`);
    }

    over_handler0(el: Element, container, source) {
        // console.log(`-- over_handler0(el, container, source) --`);
        // console.log(el);
        // console.log(container);
        // console.log(source);
        // console.log(`------------------------------------------`);
    }

    remove_handler0(el: Element, container, source) {
        // console.log(`-- remove_handler0(el, container, source) --`);
        // console.log(el);
        // console.log(container);
        // console.log(source);
        // console.log(`--------------------------------------------`);
    }

    shadow_handler0(el: Element, container, source) {
        // console.log(`-- shadow_handler0(el, container, source) --`);
        // console.log(el);
        // console.log(container);
        // console.log(source);
        // console.log(`--------------------------------------------`);
    }
}