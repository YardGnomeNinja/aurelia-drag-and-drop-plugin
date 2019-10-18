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
        let containerHTMLElements = Array.from(document.getElementsByClassName('js-drag-and-drop-container'));
        
        for (let containerHTMLElement of containerHTMLElements) {
            // Get the name of the group the drag-and-drop container belongs to
            let containerGroupName = containerHTMLElement.getAttribute('data-container-group');

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
     * @param containerGroupLeaderHTMLElement 
     */
    private registerEventHandlers(dragulaInstance: dragula.Drake, containerGroupLeaderHTMLElement: Element) {
        // Get the name of the handlers from the element.
        let userDefinedCancelHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-cancel');
        let userDefinedClonedHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-cloned');
        let userDefinedDragHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-drag');
        let userDefinedDragEndHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-dragend');
        let userDefinedDropHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-drop');
        let userDefinedOutHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-out');
        let userDefinedOverHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-over');
        let userDefinedRemoveHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-remove');
        let userDefinedShadowHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-shadow');
        

        dragulaInstance.on('cancel', this.cancelHandler.bind(this, this.callingContext, this.containerGroups, userDefinedCancelHandlerName, dragulaInstance, containerGroupLeaderHTMLElement));
        dragulaInstance.on('cloned', this.clonedHandler.bind(this, this.callingContext, this.containerGroups, userDefinedClonedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement));
        dragulaInstance.on('drag', this.dragHandler.bind(this, this.callingContext, this.containerGroups, userDefinedDragHandlerName, dragulaInstance, containerGroupLeaderHTMLElement));
        dragulaInstance.on('dragend', this.dragEndHandler.bind(this, this.callingContext, this.containerGroups, userDefinedDragEndHandlerName, dragulaInstance, containerGroupLeaderHTMLElement));
        dragulaInstance.on('drop', this.dropHandler.bind(this, this.callingContext, this.containerGroups, userDefinedDropHandlerName, dragulaInstance, containerGroupLeaderHTMLElement));
        dragulaInstance.on('out', this.outHandler.bind(this, this.callingContext, this.containerGroups, userDefinedOutHandlerName, dragulaInstance, containerGroupLeaderHTMLElement));
        dragulaInstance.on('over', this.overHandler.bind(this, this.callingContext, this.containerGroups, userDefinedOverHandlerName, dragulaInstance, containerGroupLeaderHTMLElement));
        dragulaInstance.on('remove', this.removeHandler.bind(this, this.callingContext, this.containerGroups, userDefinedRemoveHandlerName, dragulaInstance, containerGroupLeaderHTMLElement));
        dragulaInstance.on('shadow', this.shadowHandler.bind(this, this.callingContext, this.containerGroups, userDefinedShadowHandlerName, dragulaInstance, containerGroupLeaderHTMLElement));
    }

    private getItem(containerGroups, sourceContainerGroupId: string, sourceContainerId: string, eventItemDataModel: string) {
        let containerItems = containerGroups[sourceContainerGroupId].containers[sourceContainerId].items;

        return containerItems.find((x) => { return JSON.stringify(x) == eventItemDataModel; });
    }

    /**
     * Move the model associated with the dropped item out of the container it started in to the container it was dropped in.
     * TODO: I feel like this may be able to be streamlined.
     */
    private moveContainerItem(containerGroups, sourceContainerHTMLElement: Element, eventItemHTMLElement: Element, eventTargetContainerHTMLElement: Element, eventNextSiblingItemHTMLElement: Element) {
        // Get source container info
        let sourceContainerGroupId = sourceContainerHTMLElement.getAttribute('data-container-group');
        let sourceContainerId = sourceContainerHTMLElement.id;

        // Get event item info
        let eventItemDataModel = eventItemHTMLElement.getAttribute('data-model');
        let eventItemModel = this.getItem(containerGroups, sourceContainerGroupId, sourceContainerId, eventItemDataModel);
        let eventItemModelIndex = this.getItemIndex(containerGroups, sourceContainerGroupId, sourceContainerId, eventItemModel);

        // Get target container info
        let targetContainerGroupId = eventTargetContainerHTMLElement.getAttribute('data-container-group');
        let targetContainerId = eventTargetContainerHTMLElement.id;

        // Get info about where the item was moved to
        let eventNextSiblingItemDataModel = eventNextSiblingItemHTMLElement == null || eventNextSiblingItemHTMLElement == undefined ? undefined : eventNextSiblingItemHTMLElement.getAttribute('data-model');
        let eventNextSiblingItemModel = this.getItem(containerGroups, targetContainerGroupId, targetContainerId, eventNextSiblingItemDataModel);
        let eventNextSiblingItemModelIndex = this.getItemIndex(containerGroups, targetContainerGroupId, targetContainerId, eventNextSiblingItemModel);

        // Remove item from original container and retain the instance
        let sourceItem = containerGroups[sourceContainerGroupId].containers[sourceContainerId].items.splice(eventItemModelIndex, 1)[0];

        // Add item to new container
        // If the next sibling has an index, use it. Otherwise the item was dropped at the "bottom" and the index must be determined by the length of the collection.
        let targetIndex = eventNextSiblingItemModelIndex != -1 ? eventNextSiblingItemModelIndex : containerGroups[targetContainerGroupId].containers[targetContainerId].items.length;
        containerGroups[targetContainerGroupId].containers[targetContainerId].items.splice(targetIndex, 0, sourceItem);
    }

    getItemIndex(containerGroups, containerGroupId, containerId, itemModel) {
        return containerGroups[containerGroupId].containers[containerId].items.indexOf(itemModel);
    }

    ////////////////////////////////////////
    // HANDLERS
    ////////////////////////////////////////

    ////////////////////
    // cancel
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     * @param eventSourceContainerHTMLElement 
     * @param eventSource 
     */
    private cancelHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource) {
        // console.log(`happens before ${handlerName} for cancel`)

        let userDefinedHandler = callingContext[userDefinedHandlerName];

        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource);
        }
    
        // console.log(`happens after ${handlerName} for cancel`)
    }

    ////////////////////
    // cloned
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemClone 
     * @param eventItemOriginal 
     * @param eventItemType 
     */
    private clonedHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemClone, eventItemOriginal, eventItemType) {
        // console.log(`happens before ${handlerName} for cloned`)
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        if (userDefinedHandler) {
            userDefinedHandler(eventItemClone, eventItemOriginal, eventItemType);
        }
        // console.log(`happens after ${handlerName} for cloned`)
    }

    ////////////////////
    // drag
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     * @param eventSource 
     */
    private dragHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement, eventSource) {
        // console.log(`happens before ${handlerName} for drag`)
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSource);
        }
        // console.log(`happens after ${handlerName} for drag`)
    }

    ////////////////////
    // dragend
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     */
    private dragEndHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement) {
        // console.log(`happens before ${handlerName} for dragend`)
        // console.log(containerHTMLElement)
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement);
        }
        // console.log(`happens after ${handlerName} for dragend`)
    }

    ////////////////////
    // drop
    ////////////////////
    /**
     * 
     * NOTE: A null, eventNextSiblingItemHTMLElement, indicates that the item was dropped at the 'bottom' of the list.
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     * @param eventTargetContainerHTMLElement 
     * @param eventSourceContainerHTMLElement 
     * @param eventNextSiblingItemHTMLElement 
     */
    private dropHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement, eventTargetContainerHTMLElement, eventSourceContainerHTMLElement, eventNextSiblingItemHTMLElement) {
        // console.log(`happens before ${handlerName} for drop`)
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventTargetContainerHTMLElement, eventSourceContainerHTMLElement, eventNextSiblingItemHTMLElement);
        }

        // TODO: Identify if there is anything that should stop the move from happening
        this.moveContainerItem(containerGroups, eventSourceContainerHTMLElement, eventItemHTMLElement, eventTargetContainerHTMLElement, eventNextSiblingItemHTMLElement);

        // console.log(callingContext)
        // console.log(containerGroups)
        // console.log(handlerName)
        // console.log(dragulaInstance)
        // console.log(sourceContainerHTMLElement)
        // console.log(eventItemHTMLElement)
        // console.log(eventTargetContainerHTMLElement)
        // console.log(eventSourceContainerHTMLElement)
        // console.log(eventNextSiblingItemHTMLElement)
        // Don't drop if user handler cancels it?
        // Reorder the item collection based on the new order
    }

    ////////////////////
    // out
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     * @param eventCurrentlyOverContainerHTMLElement 
     * @param eventSourceContainerHTMLElement 
     */
    private outHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement, eventCurrentlyOverContainerHTMLElement, eventSourceContainerHTMLElement) {
        // console.log(`happens before ${handlerName} for out`)
        // console.log(callingContext)
        // console.log(containerGroups)
        // console.log(handlerName)
        // console.log(dragulaInstance)
        // console.log(sourceContainerHTMLElement)
        // console.log(eventItemHTMLElement)
        // console.log(eventCurrentlyOverContainerHTMLElement)
        // console.log(eventSourceContainerHTMLElement)
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventCurrentlyOverContainerHTMLElement, eventSourceContainerHTMLElement);
        }
        // console.log(`happens after ${handlerName} for out`)
    }

    ////////////////////
    // over
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     * @param eventSourceContainerHTMLElement 
     * @param eventSource 
     */
    private overHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource) {
        // console.log(`happens before ${handlerName} for over`)
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource);
        }
        // console.log(`happens after ${handlerName} for over`)
    }

    ////////////////////
    // remove
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     * @param eventSourceContainerHTMLElement 
     * @param eventSource 
     */
    private removeHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource) {
        // console.log(`happens before ${handlerName} for remove`)
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource);
        }
        // console.log(`happens after ${handlerName} for remove`)
    }

    ////////////////////
    // shadow
    ////////////////////
    /**
     * 
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     * @param eventSourceContainerHTMLElement 
     * @param eventSource 
     */
    private shadowHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource) {
        // console.log(`happens before ${handlerName} for shadow`)
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource);
        }
        // console.log(`happens after ${handlerName} for shadow`)
    }
}