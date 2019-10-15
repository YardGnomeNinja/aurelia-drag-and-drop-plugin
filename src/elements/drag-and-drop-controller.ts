import * as dragula from 'dragula';

export class DragAndDropController {
    private callingContext;
    public containerGroups: { [name: string]: dragula.Drake } = { };
    public containerItems: { [name: string]: any } = { };

    /**
     * Create, instantiate, and register elements designated by the 'js-drag-and-drop-container' class into logical groups to allow drag-and-drop functionality within those groups. 
     * @param callingContext A reference to the object containing the handlers that will be executed when an event is fired.
     */
    constructor(callingContext) {
        this.callingContext = callingContext;

        this.registerContainers();
    }

    private registerContainers() {
        // Get all drag-and-drop containers on the page
        let dragAndDropContainers = Array.from(document.getElementsByClassName("js-drag-and-drop-container"));
        
        for (let dragAndDropContainer of dragAndDropContainers) {
            // Get the name of the group the drag-and-drop container belongs to
            let containerGroupName = dragAndDropContainer.getAttribute("data-container-group");

            // Attempt to get the group the container belongs to
            let dragAndDropContainerGroup = this.containerGroups[containerGroupName];

            // If the group exists
            if (dragAndDropContainerGroup) {
                // Add the container to the group
                dragAndDropContainerGroup.containers.push(dragAndDropContainer);
            } else {
                // Otherwise, create a new group
                let containerGroup = dragula();

                this.registerEventHandlers(containerGroup, dragAndDropContainer);

                // Add the container to the group
                containerGroup.containers.push(dragAndDropContainer)

                // Add the new group to the collection of groups
                this.containerGroups[containerGroupName] = containerGroup;
            }
        }
    }

    private registerEventHandler(eventName: string, containerGroup: dragula.Drake, dragAndDropContainer: Element) {
        // Get the name of the handler from the element.
        let handlerName = dragAndDropContainer.getAttribute(`data-${eventName}`);
        
        // Ensure the handler name is specified before attempting to register it.
        if (handlerName && handlerName.trim() != "") {
            // Ensure the handler function is defined in the defined context.
            if (this.callingContext[handlerName]) {
                switch (eventName) {
                    case 'cancel':
                        containerGroup.on(eventName, this.cancelHandler.bind(this, this.callingContext, handlerName, containerGroup, dragAndDropContainer));
                        break;
                    case 'cloned':
                        containerGroup.on(eventName, this.clonedHandler.bind(this, this.callingContext, handlerName, containerGroup, dragAndDropContainer));
                        break;
                    case 'drag':
                        containerGroup.on(eventName, this.dragHandler.bind(this, this.callingContext, handlerName, containerGroup, dragAndDropContainer));
                        break;
                    case 'dragend':
                        containerGroup.on(eventName, this.dragEndHandler.bind(this, this.callingContext, handlerName, containerGroup, dragAndDropContainer));
                        break;
                    case 'drop':
                        containerGroup.on(eventName, this.dropHandler.bind(this, this.callingContext, handlerName, containerGroup, dragAndDropContainer));
                        break;
                    case 'out':
                        containerGroup.on(eventName, this.outHandler.bind(this, this.callingContext, handlerName, containerGroup, dragAndDropContainer));
                        break;
                    case 'over':
                        containerGroup.on(eventName, this.overHandler.bind(this, this.callingContext, handlerName, containerGroup, dragAndDropContainer));
                        break;
                    case 'remove':
                        containerGroup.on(eventName, this.removeHandler.bind(this, this.callingContext, handlerName, containerGroup, dragAndDropContainer));
                        break;
                    case 'shadow':
                        containerGroup.on(eventName, this.shadowHandler.bind(this, this.callingContext, handlerName, containerGroup, dragAndDropContainer));
                        break;
                }
            } else {
                console.warn(`${dragAndDropContainer.getAttribute("data-container-group")} handler: ${handlerName} has not been implemented.`)
            }
        }
    }

    /**
     * https://github.com/bevacqua/dragula#drakeon-events
     * @param containerGroup The container group (aka Dragula.Drake) the event handlers will be registered to.
     * @param dragAndDropContainer The element containing the names of the handlers to register.
     */
    private registerEventHandlers(containerGroup: dragula.Drake, dragAndDropContainer: Element) {
        this.registerEventHandler('cancel', containerGroup, dragAndDropContainer);
        this.registerEventHandler('cloned', containerGroup, dragAndDropContainer);
        this.registerEventHandler('drag', containerGroup, dragAndDropContainer);
        this.registerEventHandler('dragend', containerGroup, dragAndDropContainer);
        this.registerEventHandler('drop', containerGroup, dragAndDropContainer);
        this.registerEventHandler('out', containerGroup, dragAndDropContainer);
        this.registerEventHandler('over', containerGroup, dragAndDropContainer);
        this.registerEventHandler('remove', containerGroup, dragAndDropContainer);
        this.registerEventHandler('shadow', containerGroup, dragAndDropContainer);
    }

    ////////////////////
    // cancel
    ////////////////////
    private cancelHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for cancel`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for cancel`)
    }

    ////////////////////
    // cloned
    ////////////////////
    private clonedHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, clone, original, type) {
        console.log(`happens before ${handlerName} for cloned`)
        callingContext[handlerName](clone, original, type);
        console.log(`happens after ${handlerName} for cloned`)
    }

    ////////////////////
    // drag
    ////////////////////
    private dragHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, source) {
        console.log(`happens before ${handlerName} for drag`)
        callingContext[handlerName](element, source);
        console.log(`happens after ${handlerName} for drag`)
    }

    ////////////////////
    // dragend
    ////////////////////
    private dragEndHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element) {
        console.log(`happens before ${handlerName} for dragend`)
        console.log(containerGroup)
        callingContext[handlerName](element);
        console.log(`happens after ${handlerName} for dragend`)
    }

    ////////////////////
    // drop
    ////////////////////
    private dropHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, target, source, sibling) {
        console.log(`happens before ${handlerName} for drop`)
        callingContext[handlerName](element, target, source, sibling);
        console.log(`happens after ${handlerName} for drop`)
    }

    ////////////////////
    // out
    ////////////////////
    private outHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for out`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for out`)
    }

    ////////////////////
    // over
    ////////////////////
    private overHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for over`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for over`)
    }

    ////////////////////
    // remove
    ////////////////////
    private removeHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for remove`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for remove`)
    }

    ////////////////////
    // shadow
    ////////////////////
    private shadowHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for shadow`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for shadow`)
    }
}