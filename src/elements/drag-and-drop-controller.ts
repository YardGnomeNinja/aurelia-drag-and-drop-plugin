import { Container } from './container';
import { ContainerGroup } from './container-group';
import * as dragula from 'dragula';

export class DragAndDropController {
    private callingContext;
    public containerGroups: { [id: string]: ContainerGroup } = { };

    /**
     * Create, instantiate, and register elements designated by the 'js-drag-and-drop-container' class into logical groups to allow drag-and-drop functionality within those groups. 
     * @param callingContext A reference to the object containing the handlers that will be executed when an event is fired.
     */
    constructor(callingContext) {
        this.callingContext = callingContext;

        this.registerContainerGroups(this.containerGroups);
    }

    /**
     * Create, instantiate, and register elements designated by the 'js-drag-and-drop-container' class.
     * @param containerGroups An object for storing the container groups.
     */
    private registerContainerGroups(containerGroups: { [id: string]: ContainerGroup }) {
        // Get all drag-and-drop containers on the page
        let containerHTMLElements = Array.from(document.getElementsByClassName("js-drag-and-drop-container"));
        
        for (let containerHTMLElement of containerHTMLElements) {
            // Get the name of the group the drag-and-drop container belongs to
            let containerGroupName = containerHTMLElement.getAttribute("data-container-group");

            // Attempt to get the group the container belongs to
            let containerGroup = containerGroups[containerGroupName];

            // If the group exists
            if (containerGroup) {
                // Add the HTML container element to the Dragula containers
                containerGroup.dragula.containers.push(containerHTMLElement);

                // Register the container with the internal collection
                this.registerContainer(containerGroup, containerHTMLElement);
            } else {
                // Otherwise, create a new container group
                containerGroup = new ContainerGroup({ id: containerGroupName });
                
                // Create a new container group Dragula object
                let containerGroupDragula = dragula();

                // Register the event handlers found on the HTML container element
                this.registerEventHandlers(containerGroupDragula, containerHTMLElement);

                // Add the HTML container element to the Dragula container collection
                containerGroupDragula.containers.push(containerHTMLElement)

                // Associate the Dragula object with the container group
                containerGroup.dragula = containerGroupDragula

                // Add the container group object to the collection of container groups
                containerGroups[containerGroupName] = containerGroup;

                // Register the container with the internal collection
                this.registerContainer(containerGroup, containerHTMLElement);
            }
        }
    }

    /**
     * Add object references of each HTML item's associated model to the internal collection to be maintained.
     * @param container 
     * @param containerHTMLElement 
     */
    private registerContainerItems(container: Container, containerHTMLElement: Element) {
        // Iterate the registered container groups
        //console.log(container);
        // Note: Casting .children as any allows 'for' to be used to iterate over the collection
        for (let containerChild of containerHTMLElement.children as any) {
            console.log(containerChild.getAttribute('data-model'))
        }
    }

    /**
     * 
     * @param containerGroup 
     * @param containerHTMLElement 
     */
    private registerContainer(containerGroup: ContainerGroup, containerHTMLElement: Element) {
        let containerId = containerHTMLElement.id;
        let container = new Container({ id: containerId });
        
        containerGroup.containers[containerId] = container;

        this.registerContainerItems(container, containerHTMLElement)
    }

    /**
     * 
     * @param eventName 
     * @param dragulaInstance 
     * @param dragAndDropContainer 
     */
    private registerEventHandler(eventName: string, dragulaInstance: dragula.Drake, dragAndDropContainer: Element) {
        // Get the name of the handler from the element.
        let handlerName = dragAndDropContainer.getAttribute(`data-${eventName}`);
        
        // Ensure the handler name is specified before attempting to register it.
        if (handlerName && handlerName.trim() != "") {
            // Ensure the handler function is defined in the defined context.
            if (this.callingContext[handlerName]) {
                switch (eventName) {
                    case 'cancel':
                        dragulaInstance.on(eventName, this.cancelHandler.bind(this, this.callingContext, handlerName, dragulaInstance, dragAndDropContainer));
                        break;
                    case 'cloned':
                        dragulaInstance.on(eventName, this.clonedHandler.bind(this, this.callingContext, handlerName, dragulaInstance, dragAndDropContainer));
                        break;
                    case 'drag':
                        dragulaInstance.on(eventName, this.dragHandler.bind(this, this.callingContext, handlerName, dragulaInstance, dragAndDropContainer));
                        break;
                    case 'dragend':
                        dragulaInstance.on(eventName, this.dragEndHandler.bind(this, this.callingContext, handlerName, dragulaInstance, dragAndDropContainer));
                        break;
                    case 'drop':
                        dragulaInstance.on(eventName, this.dropHandler.bind(this, this.callingContext, handlerName, dragulaInstance, dragAndDropContainer));
                        break;
                    case 'out':
                        dragulaInstance.on(eventName, this.outHandler.bind(this, this.callingContext, handlerName, dragulaInstance, dragAndDropContainer));
                        break;
                    case 'over':
                        dragulaInstance.on(eventName, this.overHandler.bind(this, this.callingContext, handlerName, dragulaInstance, dragAndDropContainer));
                        break;
                    case 'remove':
                        dragulaInstance.on(eventName, this.removeHandler.bind(this, this.callingContext, handlerName, dragulaInstance, dragAndDropContainer));
                        break;
                    case 'shadow':
                        dragulaInstance.on(eventName, this.shadowHandler.bind(this, this.callingContext, handlerName, dragulaInstance, dragAndDropContainer));
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
    /**
     * 
     * @param callingContext 
     * @param handlerName 
     * @param containerGroup 
     * @param dragAndDropContainer 
     * @param element 
     * @param container 
     * @param source 
     */
    private cancelHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for cancel`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for cancel`)
    }

    ////////////////////
    // cloned
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param handlerName 
     * @param containerGroup 
     * @param dragAndDropContainer 
     * @param clone 
     * @param original 
     * @param type 
     */
    private clonedHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, clone, original, type) {
        console.log(`happens before ${handlerName} for cloned`)
        callingContext[handlerName](clone, original, type);
        console.log(`happens after ${handlerName} for cloned`)
    }

    ////////////////////
    // drag
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param handlerName 
     * @param containerGroup 
     * @param dragAndDropContainer 
     * @param element 
     * @param source 
     */
    private dragHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, source) {
        console.log(`happens before ${handlerName} for drag`)
        callingContext[handlerName](element, source);
        console.log(`happens after ${handlerName} for drag`)
    }

    ////////////////////
    // dragend
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param handlerName 
     * @param containerGroup 
     * @param dragAndDropContainer 
     * @param element 
     */
    private dragEndHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element) {
        console.log(`happens before ${handlerName} for dragend`)
        console.log(containerGroup)
        callingContext[handlerName](element);
        console.log(`happens after ${handlerName} for dragend`)
    }

    ////////////////////
    // drop
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param handlerName 
     * @param containerGroup 
     * @param dragAndDropContainer 
     * @param element 
     * @param target 
     * @param source 
     * @param sibling 
     */
    private dropHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, target, source, sibling) {
        console.log(`happens before ${handlerName} for drop`)
        callingContext[handlerName](element, target, source, sibling);
        console.log(`happens after ${handlerName} for drop`)
    }

    ////////////////////
    // out
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param handlerName 
     * @param containerGroup 
     * @param dragAndDropContainer 
     * @param element 
     * @param container 
     * @param source 
     */
    private outHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for out`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for out`)
    }

    ////////////////////
    // over
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param handlerName 
     * @param containerGroup 
     * @param dragAndDropContainer 
     * @param element 
     * @param container 
     * @param source 
     */
    private overHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for over`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for over`)
    }

    ////////////////////
    // remove
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param handlerName 
     * @param containerGroup 
     * @param dragAndDropContainer 
     * @param element 
     * @param container 
     * @param source 
     */
    private removeHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for remove`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for remove`)
    }

    ////////////////////
    // shadow
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param handlerName 
     * @param containerGroup 
     * @param dragAndDropContainer 
     * @param element 
     * @param container 
     * @param source 
     */
    private shadowHandler(callingContext, handlerName, containerGroup, dragAndDropContainer, element, container, source) {
        console.log(`happens before ${handlerName} for shadow`)
        callingContext[handlerName](element, container, source);
        console.log(`happens after ${handlerName} for shadow`)
    }
}