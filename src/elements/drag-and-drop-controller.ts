// See https://github.com/bevacqua/dragula#usage for details on Dragula's implementation specifics.

import { Container } from './container';
import { ContainerGroup } from './container-group';
import * as dragula from 'dragula';

/**
 * IMPORTANT: Copying is currently "shallow". Functions and object references will not be available to "copied" items.
 * TODO: Fix "shallow" copying with Lodash https://lodash.com/
 */
export class DragAndDropController {
    private callingContext;
    public containerGroups: { [id: string]: ContainerGroup } = { };
    public hideWarnings = false;

    /**
     * Create, instantiate, and register elements designated by the 'js-drag-and-drop-container' class into logical groups to allow drag-and-drop functionality within those groups. 
     * @param callingContext A reference to the object containing the handlers that will be executed when an event is fired.
     */
    constructor(callingContext, hideWarnings: boolean = false) {
        this.callingContext = callingContext;
        this.hideWarnings = hideWarnings;

        if (!this.hideWarnings) {
            console.warn(
                `WARNING: This plugin is a work in progress and contains a few known bugs and probably many more that are unknown.
                \nIf you accept the risks involved, you can silence this and other warning messages by setting the controller's 'hideWarnings' property to 'true'.
                \nPlease THOROUGHLY test the functionality for your implementation. There are a lot of moving parts here and I'm certain some things have been overlooked.`);
        }

        this.registerContainerGroups(this.containerGroups);
    }

    private buildDragulaOptions(callingContext, containerGroup, containerGroupLeaderHTMLElement: Element) {
        let result = {};

        //////////////////////
        // accepts
        // https://github.com/bevacqua/dragula#optionsaccepts
        //////////////////////
        let optionAccepts = containerGroupLeaderHTMLElement.getAttribute('data-option-accepts');

        if (optionAccepts != undefined) {
            let optionAcceptsTrimmed = optionAccepts.trim();

            if (optionAcceptsTrimmed != "") {
                // If there is a function in the calling context matching the provided name, use it to determine if copy is true.
                let acceptsFunction = callingContext[optionAcceptsTrimmed];

                if (acceptsFunction) {
                    containerGroup.accepts = acceptsFunction;
                    result["accepts"] = acceptsFunction;    
                }
            }
        }

        //////////////////////
        // copy
        // Specifies whether or not elements are copied when dropped.
        // https://github.com/bevacqua/dragula#optionscopy
        //////////////////////
        let optionCopy = containerGroupLeaderHTMLElement.getAttribute('data-option-copy');

        if (optionCopy != undefined) {
            let optionCopyTrimmed = optionCopy.trim();

            if (optionCopyTrimmed != "") {
                let optionCopyLowercase = optionCopyTrimmed.toLowerCase();

                // If the option specifies a boolean.
                if (optionCopyLowercase == 'true' || optionCopyLowercase == 'false') {
                    containerGroup.copy = optionCopyLowercase == 'true';
                    result["copy"] = optionCopyLowercase == 'true';    
                } else {
                    // If there is a function in the calling context matching the provided name, use it to determine if copy is true.
                    let copyFunction = callingContext[optionCopy];

                    if (copyFunction) {
                        containerGroup.copy = copyFunction;
                        result["copy"] = copyFunction;    
                    }
                }
            }
        }

        //////////////////////
        // copySortSource
        // https://github.com/bevacqua/dragula#optionscopysortsource
        //////////////////////
        let optionCopySortSource = containerGroupLeaderHTMLElement.getAttribute('data-option-copy-sort-source');

        if (optionCopySortSource != undefined) {
            let optionCopySortSourceTrimmed = optionCopySortSource.trim();

            if (optionCopySortSourceTrimmed != "") {
                let copySortSource = optionCopySortSourceTrimmed.toLowerCase() == 'true';

                if (!this.hideWarnings && copySortSource) {
                    console.warn(
                        `WARNING: The drag-and-drop container group \"${containerGroup.id}\" is using \"copySortSource\" option which contains a known bug that should be addressed before deploying to production.
                        \n Follow these steps to reproduce the bug and determine if you are okay with the consequences.
                        \n    1. Add two or more items to a container. 
                        \n    2. Begin to drag any item, except the last item, and drop it on itself or immediately above or below it on the \"sort placeholder\". This effectively cancels the drag, however with unintended concequences.
                        \n    3. Drag any \"lower\" item to the \"sort placeholder\" immediately above the item from step 2.
                        \nThe console should display the following error \"TypeError: refNode.parentNode is null\" from aurelia-templating.js. The dragged element will also be removed. This is due to the fact that under normal circumstances moving the item model causes Aurelia Templating to create a new element and retain the element moved by Dragula, thus causing duplication of elements. In the event of the bug, Aurelia Templating is unable to create a new element and the dragged element is removed.`
                    );
                }

                containerGroup.copySortSource = copySortSource;
                result["copySortSource"] = copySortSource;
            }
        }

        //////////////////////
        // direction
        // https://github.com/bevacqua/dragula#optionsdirection
        //////////////////////
        let optionDirection = containerGroupLeaderHTMLElement.getAttribute('data-option-direction');

        if (optionDirection != undefined) {
            let optionDirectionTrimmed = optionDirection.trim();

            if (optionDirectionTrimmed != "") {
                if (optionDirectionTrimmed == 'horizontal' || optionDirectionTrimmed == "vertical") {
                    containerGroup.direction = optionDirectionTrimmed;
                    result["direction"] = optionDirectionTrimmed;    
                }        
            }
        }

        //////////////////////
        // ignoreInputTextSelection
        // https://github.com/bevacqua/dragula#optionsignoreinputtextselection
        //////////////////////
        let optionIgnoreInputTextSelection = containerGroupLeaderHTMLElement.getAttribute('data-option-ignore-input-text-selection');

        if (optionIgnoreInputTextSelection != undefined) {
            let optionIgnoreInputTextSelectionTrimmed = optionIgnoreInputTextSelection.trim();

            if (optionIgnoreInputTextSelectionTrimmed == 'true' || optionIgnoreInputTextSelectionTrimmed == "false") {
                containerGroup.ignoreInputTextSelection = optionIgnoreInputTextSelectionTrimmed.toLowerCase() == 'true';
                result["ignoreInputTextSelection"] = optionIgnoreInputTextSelectionTrimmed.toLowerCase() == 'true';    
            }
        }

        //////////////////////
        // invalid
        // https://github.com/bevacqua/dragula#optionsinvalid
        //////////////////////
        let optionInvalid = containerGroupLeaderHTMLElement.getAttribute('data-option-invalid');

        if (optionInvalid != undefined) {
            let optionInvalidTrimmed = optionInvalid.trim();

            if (optionInvalidTrimmed != "") {
                // If there is a function in the calling context matching the provided name, use it to determine if copy is true.
                let invalidFunction = callingContext[optionInvalidTrimmed];

                if (invalidFunction) {
                    containerGroup.invalid = invalidFunction;
                    result["invalid"] = invalidFunction;    
                }
            }
        }

        //////////////////////
        // isContainer
        // https://github.com/bevacqua/dragula#optionsiscontainer
        //////////////////////
        let optionIsContainer = containerGroupLeaderHTMLElement.getAttribute('data-option-is-container');

        if (optionIsContainer != undefined) {
            let optionIsContainerTrimmed = optionIsContainer.trim();

            if (optionIsContainerTrimmed != "") {
                // If there is a function in the calling context matching the provided name, use it to determine if copy is true.
                let isContainerFunction = callingContext[optionIsContainerTrimmed];

                if (isContainerFunction) {
                    containerGroup.isContainer = isContainerFunction;
                    result["isContainer"] = isContainerFunction;    
                }
            }
        }
        
        //////////////////////
        // mirrorContainer
        // https://github.com/bevacqua/dragula#optionsmirrorcontainer
        //////////////////////
        let optionMirrorContainer = containerGroupLeaderHTMLElement.getAttribute('data-option-mirror-container');

        if (optionMirrorContainer != undefined) {
            let optionMirrorContainerTrimmed = optionMirrorContainer.trim();

            if (!this.hideWarnings && optionMirrorContainerTrimmed != "") {
                console.warn(`WARNING: The drag-and-drop container group \"${containerGroup.id}\" is attempting to use \"mirrorContainer\" option which is currently not implemented via the plugin. To use this feature, configure it manually via the Dragula object on the container group object.`);
            }
        }

        //////////////////////
        // moves
        // https://github.com/bevacqua/dragula#optionsmoves
        //////////////////////
        let optionMoves = containerGroupLeaderHTMLElement.getAttribute('data-option-moves');

        if (optionMoves != undefined) {
            let optionMovesTrimmed = optionMoves.trim();

            if (optionMovesTrimmed != "") {
                // If there is a function in the calling context matching the provided name, use it to determine if copy is true.
                let movesFunction = callingContext[optionMovesTrimmed];

                if (movesFunction) {
                    containerGroup.moves = movesFunction;
                    result["moves"] = movesFunction;
                }
            }
        }

        //////////////////////
        // removeOnSpill
        // https://github.com/bevacqua/dragula#optionsremoveonspill
        //////////////////////
        let optionRemoveOnSpill = containerGroupLeaderHTMLElement.getAttribute('data-option-remove-on-spill');

        if (optionRemoveOnSpill != undefined) {
            let optionRemoveOnSpillTrimmed = optionRemoveOnSpill.trim();

            if (optionRemoveOnSpillTrimmed == 'true' || optionRemoveOnSpillTrimmed == "false") {
                if (!this.hideWarnings && optionRemoveOnSpillTrimmed.toLowerCase() == 'true' && (result["copy"] != undefined && result["copy"] != "" && result["copy"] == true)) {
                    console.warn(`WARNING: The drag-and-drop container group \"${containerGroup.id}\" is attempting to use \"copy\" and \"remove-on-spill\" options together. \"remove-on-spill\" is ignored when using \"copy\".`);
                } else {
                    if (!this.hideWarnings && optionRemoveOnSpillTrimmed.toLowerCase() == 'true') {
                        console.warn(
                            `WARNING: The drag-and-drop container group \"${containerGroup.id}\" is using \"removeOnSpill\" option which contains a known bug that should be addressed before deploying to production.
                            \n Follow these steps to reproduce the bug and determine if you are okay with the consequences.
                            \n    1. Create two containers within the same group. 
                            \n    2. Add multiple items to each container.
                            \n    3. Drag an item from the "second" container "across" the "first/topmost" container and pass beyond the container then release.
                            \nThe item you dragged will be removed ALONG WITH the bottom item from the "first/topmost" container. However, if you check the item collections within the drag and drop controller, you will see that the model for the item you dragged remains but the model for the item that was incorrectly removed was also removed.`
                        );
                    }
                }

                containerGroup.removeOnSpill = optionRemoveOnSpillTrimmed.toLowerCase() == 'true';
                result["removeOnSpill"] = optionRemoveOnSpillTrimmed.toLowerCase() == 'true';    
            }
        }

        //////////////////////
        // revertOnSpill
        // https://github.com/bevacqua/dragula#optionsrevertonspill
        //////////////////////
        let optionRevertOnSpill = containerGroupLeaderHTMLElement.getAttribute('data-option-revert-on-spill');

        if (optionRevertOnSpill != undefined) {
            let optionRevertOnSpillTrimmed = optionRevertOnSpill.trim();

            if (optionRevertOnSpillTrimmed == 'true' || optionRevertOnSpillTrimmed == "false") {
                containerGroup.revertOnSpill = optionRevertOnSpillTrimmed.toLowerCase() == 'true';
                result["revertOnSpill"] = optionRevertOnSpillTrimmed.toLowerCase() == 'true';    
            }
        }

        return result;
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
                let containerGroupDragula = dragula(this.buildDragulaOptions(this.callingContext, containerGroup, containerHTMLElement));

                // Register the Event Handlers found on the HTML container element
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
     * Get a Container.
     * @param containerGroupId 
     * @param containerId 
     */
    public getContainer(containerGroupId: string, containerId: string) {
        let containerGroup = this.containerGroups[containerGroupId];

        if (containerGroup) {
            return containerGroup.containers[containerId];
        }

        return undefined; 
    }

    /**
     * Get a Container Group.
     * @param containerGroupId 
     */
    public getContainerGroup(containerGroupId: string) {
        return this.containerGroups[containerGroupId];
    }

    /**
     * Get an item in the Container by providing the specific function to execute for the find.
     * @param containerGroupId The container group identifier.
     * @param containerId The container identifier.
     * @param findFunction The function used to determine if a match is found. e.g. (x) => { return x.id == localObject.id; }
     */
    public getContainerItemByFunction(containerGroupId: string, containerId: string, findFunction: Function) {
        let containerGroup = this.containerGroups[containerGroupId];

        if (containerGroup) {
            let container = containerGroup.containers[containerId];

            if (container) {
                return container.items.find((x) => findFunction(x));
            }
        }

        return undefined; 
    }

    /**
     * Get an item in the Container by passing in a list of properties and values to match against (bound to be slow for large collections).
     * @param containerGroupId The container group identifier.
     * @param containerId The container identifier.
     * @param propertyNames A list of property name strings to check the values against to ensure a match. e.g. ['id','name']
     * @param propertyValues A list of values that will be used to ensure a matching item is found. e.g. [1,'item 1']
     */
    public getContainerItemByProperties(containerGroupId: string, containerId: string, propertyNames: Array<string>, propertyValues: Array<any>) {
        let containerGroup = this.containerGroups[containerGroupId];

        if (containerGroup) {
            let container = containerGroup.containers[containerId];

            if (container) {
                return container.items.find((x) => {
                    let result = true;

                    for (let i = 0; i < propertyNames.length; i++) {
                        result = result && x[propertyNames[i]] == propertyValues[i];
                    }

                    return result;
                });
            }
        }

        return undefined; 
    }

    /**
     * Get the items in the Container.
     * @param containerGroupId
     * @param containerId 
     */
    public getContainerItems(containerGroupId: string, containerId: string) {
        let containerGroup = this.containerGroups[containerGroupId];

        if (containerGroup) {
            let container = containerGroup.containers[containerId];

            if (container) {
                return container.items;
            }
        }

        return undefined; 
    }

    /**
     * Copy the model associated with the dropped item from the container it started in and to the container it was dropped in.
     */
    private copyContainerItem(containerGroups, sourceContainerHTMLElement: Element, eventItemHTMLElement: Element, eventTargetContainerHTMLElement: Element, eventNextSiblingItemHTMLElement: Element) {
        // Get source container info
        let sourceContainerGroupId = sourceContainerHTMLElement.getAttribute('data-container-group');
        let sourceContainerId = sourceContainerHTMLElement.id;

        // Get event item info
        let eventItemDataModel = eventItemHTMLElement.getAttribute('data-model');
        let eventItemModel = this.getItem(containerGroups, sourceContainerGroupId, sourceContainerId, eventItemDataModel);
        // let eventItemModelIndex = this.getItemIndex(containerGroups, sourceContainerGroupId, sourceContainerId, eventItemModel);

        // Get target container info
        let targetContainerGroupId = eventTargetContainerHTMLElement.getAttribute('data-container-group');
        let targetContainerId = eventTargetContainerHTMLElement.id;

        // Get info about where the item was moved to
        let eventNextSiblingItemDataModel = eventNextSiblingItemHTMLElement == null || eventNextSiblingItemHTMLElement == undefined ? undefined : eventNextSiblingItemHTMLElement.getAttribute('data-model');
        let eventNextSiblingItemModel = this.getItem(containerGroups, targetContainerGroupId, targetContainerId, eventNextSiblingItemDataModel);
        let eventNextSiblingItemModelIndex = this.getItemIndex(containerGroups, targetContainerGroupId, targetContainerId, eventNextSiblingItemModel);

        // Get item from original container and retain the instance
        // let sourceItem = containerGroups[sourceContainerGroupId].containers[sourceContainerId].items.splice(eventItemModelIndex, 1)[0];

        // Shallow Clone, No Methods
        // TODO: Consider using Lodash to properly clone https://lodash.com/
        let eventItemModelClone = JSON.parse(JSON.stringify(eventItemModel));

        // Add item to new container
        // If the next sibling has an index, use it. Otherwise the item was dropped at the "bottom" and the index must be determined by the length of the collection.
        let targetIndex = eventNextSiblingItemModelIndex != -1 ? eventNextSiblingItemModelIndex : containerGroups[targetContainerGroupId].containers[targetContainerId].items.length;
        containerGroups[targetContainerGroupId].containers[targetContainerId].items.splice(targetIndex, 0, eventItemModelClone);

        // Remove copied element from DOM. This is necessary due to the fact that adding the event item model clone to the container creates its own DOM element.
        //console.log(`removing ${eventItemHTMLElement.getAttribute("data-model")} via copy`)
        eventItemHTMLElement.remove();
    }

    /**
     * Get the item matching the eventItemDataModel provided.
     * @param containerGroups 
     * @param sourceContainerGroupId 
     * @param sourceContainerId 
     * @param eventItemDataModel 
     */
    private getItem(containerGroups, sourceContainerGroupId: string, sourceContainerId: string, eventItemDataModel: string) {
        let containerItems = containerGroups[sourceContainerGroupId].containers[sourceContainerId].items;

        return containerItems.find((x) => { return JSON.stringify(x) == eventItemDataModel; });
    }

    /**
     * Move the model associated with the dropped item, out of the container it started in and to the container it was dropped in.
     * TODO: I feel like this may be able to be streamlined.
     */
    private moveContainerItem(containerGroups, sourceContainerHTMLElement: Element, eventItemHTMLElement: Element, eventTargetContainerHTMLElement: Element, eventNextSiblingItemHTMLElement: Element) {
        // Get source container info
        let sourceContainerGroupId = sourceContainerHTMLElement.getAttribute('data-container-group');
        let sourceContainerId = sourceContainerHTMLElement.id;

        // Get event item info
        let eventItemDataModel = eventItemHTMLElement.getAttribute('data-model');
        let eventItemModel = this.getItem(containerGroups, sourceContainerGroupId, sourceContainerId, eventItemDataModel);

        // Get target container info
        let targetContainerGroupId = eventTargetContainerHTMLElement.getAttribute('data-container-group');
        let targetContainerId = eventTargetContainerHTMLElement.id;

        // Get info about where the item was moved to
        let eventNextSiblingItemDataModel = eventNextSiblingItemHTMLElement == null || eventNextSiblingItemHTMLElement == undefined ? undefined : eventNextSiblingItemHTMLElement.getAttribute('data-model');
        let eventNextSiblingItemModel = this.getItem(containerGroups, targetContainerGroupId, targetContainerId, eventNextSiblingItemDataModel);

        // If a move happens within the same container
        if (sourceContainerHTMLElement == eventTargetContainerHTMLElement) {
            // Sorting...

            // Get event item index
            let eventItemModelIndex = this.getItemIndex(containerGroups, sourceContainerGroupId, sourceContainerId, eventItemModel);

            // Get sibling index
            let eventNextSiblingItemModelIndex = this.getItemIndex(containerGroups, targetContainerGroupId, targetContainerId, eventNextSiblingItemModel);

            // If the item changed positions
            if (eventItemModelIndex != eventNextSiblingItemModelIndex) {
                let sourceItem = containerGroups[sourceContainerGroupId].containers[sourceContainerId].items.splice(eventItemModelIndex, 1)[0];
                let targetIndex = undefined;

                // If the item was moved to the bottom during the reordering
                if (eventNextSiblingItemModelIndex == -1) {
                    targetIndex = containerGroups[targetContainerGroupId].containers[targetContainerId].items.length;
                } else {
                    // If the item was moved down the list during the reordering
                    if (eventItemModelIndex < eventNextSiblingItemModelIndex) {
                        targetIndex = eventNextSiblingItemModelIndex - 1;
                    }
                    
                    // If the item was moved up the list during the reordering
                    if (eventItemModelIndex > eventNextSiblingItemModelIndex) {
                        targetIndex = eventNextSiblingItemModelIndex;
                    }
                }

                // Move the eventItemModel
                containerGroups[targetContainerGroupId].containers[targetContainerId].items.splice(targetIndex, 0, sourceItem);

                // The Aurelia Templating engine will create a new element when the sourceItem is added back to the collection.
                // Remove the item Dragula moved in the DOM to avoid having duplicates of the same element.
                eventItemHTMLElement.remove();
            }
        } else {
            // Moving...

            // Get event item index
            let eventItemModelIndex = this.getItemIndex(containerGroups, sourceContainerGroupId, sourceContainerId, eventItemModel);

            // Remove item from original container and retain the instance
            let sourceItem = containerGroups[sourceContainerGroupId].containers[sourceContainerId].items.splice(eventItemModelIndex, 1)[0];

            // Get sibling index
            let eventNextSiblingItemModelIndex = this.getItemIndex(containerGroups, targetContainerGroupId, targetContainerId, eventNextSiblingItemModel);

            // Add item to new container
            // If the next sibling has an index, use it. Otherwise the item was dropped at the "bottom" and the index must be determined by the length of the collection.
            let targetIndex = eventNextSiblingItemModelIndex != -1 ? eventNextSiblingItemModelIndex : containerGroups[targetContainerGroupId].containers[targetContainerId].items.length;
            containerGroups[targetContainerGroupId].containers[targetContainerId].items.splice(targetIndex, 0, sourceItem);
        }
    }

    /**
     * Get the index of the item that matches the itemModel provided.
     * @param containerGroups 
     * @param containerGroupId 
     * @param containerId 
     * @param itemModel 
     */
    getItemIndex(containerGroups, containerGroupId, containerId, itemModel) {
        return containerGroups[containerGroupId].containers[containerId].items.indexOf(itemModel);
    }

    /**
     * Register a Container.
     * @param containerGroup 
     * @param containerHTMLElement 
     */
    private registerContainer(containerGroup: ContainerGroup, containerHTMLElement: Element) {
        let containerId = containerHTMLElement.id;
        let container = new Container({ id: containerId });
        
        containerGroup.containers[containerId] = container;
    }

    /**
     * Register a collection of Items with a Container.
     * @param containerGroupId 
     * @param containerId 
     * @param items 
     */
    public registerContainerItems(containerGroupId: string, containerId: string, items: Array<any>) {
        this.containerGroups[containerGroupId].containers[containerId].items = items;
    }

    /**
     * Register Event Handlers for a Container Group.
     * @param eventName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     */
    private registerEventHandlers(dragulaInstance: dragula.Drake, containerGroupLeaderHTMLElement: Element) {
        // Get the name of the handlers from the element.
        let userDefinedCancelHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-cancel-handler');
        let userDefinedClonedHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-cloned-handler');
        let userDefinedDragHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-drag-handler');
        let userDefinedDragEndHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-dragend-handler');
        let userDefinedDropHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-drop-handler');
        let userDefinedOutHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-out-handler');
        let userDefinedOverHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-over-handler');
        let userDefinedRemoveHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-remove-handler');
        let userDefinedShadowHandlerName = containerGroupLeaderHTMLElement.getAttribute('data-shadow-handler');
        

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

    private removeContainerItem(containerGroups, sourceContainerHTMLElement: Element, eventItemHTMLElement: Element) {
        // Get source container info
        let sourceContainerGroupId = sourceContainerHTMLElement.getAttribute('data-container-group');
        let sourceContainerId = sourceContainerHTMLElement.id;

        // Get event item info
        let eventItemDataModel = eventItemHTMLElement.getAttribute('data-model');
        let eventItemModel = this.getItem(containerGroups, sourceContainerGroupId, sourceContainerId, eventItemDataModel);

        // Get event item index
        let eventItemModelIndex = this.getItemIndex(containerGroups, sourceContainerGroupId, sourceContainerId, eventItemModel);

        // Remove item from original container
        console.log(`removing ${sourceContainerGroupId} - ${sourceContainerId} - ${eventItemModelIndex}`)

        containerGroups[sourceContainerGroupId].containers[sourceContainerId].items.splice(eventItemModelIndex, 1)[0];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // HANDLERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////
    // cancel
    ////////////////////
    /**
     * Defines the default 'cancel' Event Handler which calls the user defined 'cancel' Event Handler if one is defined on the first/topmost Container in the group.
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
        // console.log(`happens before ${userDefinedHandlerName} for cancel`)

        /////////////////////////////
        // User Defined Handler
        /////////////////////////////
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        // Execute userDefinedHandler if it exists
        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource);
        }
        /////////////////////////////
        /////////////////////////////
    
        // console.log(`happens after ${userDefinedHandlerName} for cancel`)
    }

    ////////////////////
    // cloned
    ////////////////////
    /**
     * Defines the default 'cloned' Event Handler which calls the user defined 'cloned' Event Handler if one is defined on the first/topmost Container in the group.
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
        // console.log(`happens before ${userDefinedHandlerName} for cloned`)

        /////////////////////////////
        // User Defined Handler
        /////////////////////////////
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        // Execute userDefinedHandler if it exists
        if (userDefinedHandler) {
            userDefinedHandler(eventItemClone, eventItemOriginal, eventItemType);
        }
        /////////////////////////////
        /////////////////////////////

        // console.log(`happens after ${userDefinedHandlerName} for cloned`)
    }

    ////////////////////
    // drag
    ////////////////////
    /**
     * Defines the default 'drag' Event Handler which calls the user defined 'drag' Event Handler if one is defined on the first/topmost Container in the group.
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     * @param eventSource 
     */
    private dragHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement, eventSource) {
        // console.log(`happens before ${userDefinedHandlerName} for drag`)

        /////////////////////////////
        // User Defined Handler
        /////////////////////////////
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        // Execute userDefinedHandler if it exists
        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSource);
        }
        /////////////////////////////
        /////////////////////////////

        // console.log(`happens after ${userDefinedHandlerName} for drag`)
    }

    ////////////////////
    // dragend
    ////////////////////
    /**
     * Defines the default 'dragend' Event Handler which calls the user defined 'dragend' Event Handler if one is defined on the first/topmost Container in the group.
     * @param callingContext 
     * @param containerGroups 
     * @param handlerName 
     * @param dragulaInstance 
     * @param containerGroupLeaderHTMLElement 
     * @param eventItemHTMLElement 
     */
    private dragEndHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance, containerGroupLeaderHTMLElement, eventItemHTMLElement) {
        // console.log(`happens before ${userDefinedHandlerName} for dragend`)
        // console.log(containerHTMLElement)

        /////////////////////////////
        // User Defined Handler
        /////////////////////////////
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        // Execute userDefinedHandler if it exists
        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement);
        }
        /////////////////////////////
        /////////////////////////////
        
        // console.log(`happens after ${userDefinedHandlerName} for dragend`)
    }

    ////////////////////
    // drop
    ////////////////////
    /**
     * Defines the default 'drop' Event Handler which calls the user defined 'drop' Event Handler if one is defined on the first/topmost Container in the group.
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
    private dropHandler(callingContext, containerGroups, userDefinedHandlerName, dragulaInstance: dragula.Drake, containerGroupLeaderHTMLElement: HTMLElement, eventItemHTMLElement, eventTargetContainerHTMLElement, eventSourceContainerHTMLElement, eventNextSiblingItemHTMLElement) {
        // console.log(`happens before ${userDefinedHandlerName} for drop`)

        /////////////////////////////
        // User Defined Handler
        /////////////////////////////
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        // Execute userDefinedHandler if it exists

        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventTargetContainerHTMLElement, eventSourceContainerHTMLElement, eventNextSiblingItemHTMLElement);
        }
        /////////////////////////////
        /////////////////////////////

        // Get the id of the container group involved
        let containerGroupId = containerGroupLeaderHTMLElement.getAttribute('data-container-group');

        // If the container group is configured for copying items
        if (this.containerGroups[containerGroupId].copy) {
            // If there isn't a target, there's nothing to copy
            if (eventTargetContainerHTMLElement != null) {
                // If the container group is configured for copying items and allows sorting within the same container
                if (this.containerGroups[containerGroupId].copySortSource) {
                    // Check if the source container and target container are the same
                    if (eventSourceContainerHTMLElement == eventTargetContainerHTMLElement) {
                        // If the source container and target container are the same, move the item within the same collection
                        this.moveContainerItem(containerGroups, eventSourceContainerHTMLElement, eventItemHTMLElement, eventTargetContainerHTMLElement, eventNextSiblingItemHTMLElement);
                    } else {
                        // If the source container and target container are different, copy the item
                        this.copyContainerItem(containerGroups, eventSourceContainerHTMLElement, eventItemHTMLElement, eventTargetContainerHTMLElement, eventNextSiblingItemHTMLElement);
                    }
                } else {
                    // Sorting within the same container is not possible, copy the item
                    this.copyContainerItem(containerGroups, eventSourceContainerHTMLElement, eventItemHTMLElement, eventTargetContainerHTMLElement, eventNextSiblingItemHTMLElement);
                }
            }
        } else {
            // Move the item
            this.moveContainerItem(containerGroups, eventSourceContainerHTMLElement, eventItemHTMLElement, eventTargetContainerHTMLElement, eventNextSiblingItemHTMLElement);
        }
    }

    ////////////////////
    // out
    ////////////////////
    /**
     * Defines the default 'out' Event Handler which calls the user defined 'out' Event Handler if one is defined on the first/topmost Container in the group.
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
        // console.log(`happens before ${userDefinedHandlerName} for out`)
        // console.log(callingContext)
        // console.log(containerGroups)
        // console.log(handlerName)
        // console.log(dragulaInstance)
        // console.log(sourceContainerHTMLElement)
        // console.log(eventItemHTMLElement)
        // console.log(eventCurrentlyOverContainerHTMLElement)
        // console.log(eventSourceContainerHTMLElement)

        /////////////////////////////
        // User Defined Handler
        /////////////////////////////
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        // Execute userDefinedHandler if it exists
        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventCurrentlyOverContainerHTMLElement, eventSourceContainerHTMLElement);
        }
        /////////////////////////////
        /////////////////////////////

        // console.log(`happens after ${userDefinedHandlerName} for out`)
    }

    ////////////////////
    // over
    ////////////////////
    /**
     * Defines the default 'over' Event Handler which calls the user defined 'over' Event Handler if one is defined on the first/topmost Container in the group.
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
        // console.log(`happens before ${userDefinedHandlerName} for over`)
        
        /////////////////////////////
        // User Defined Handler
        /////////////////////////////
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        // Execute userDefinedHandler if it exists
        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource);
        }
        /////////////////////////////
        /////////////////////////////

        // console.log(`happens after ${userDefinedHandlerName} for over`)
    }

    ////////////////////
    // remove
    ////////////////////
    /**
     * Defines the default 'remove' Event Handler which calls the user defined 'remove' Event Handler if one is defined on the first/topmost Container in the group.
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
        // console.log(`happens before ${userDefinedHandlerName} for remove`)
        
        /////////////////////////////
        // User Defined Handler
        /////////////////////////////
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        // Execute userDefinedHandler if it exists
        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource);
        }
        /////////////////////////////
        /////////////////////////////

        console.log(containerGroups, eventSourceContainerHTMLElement, eventItemHTMLElement)
        this.removeContainerItem(containerGroups, eventSourceContainerHTMLElement, eventItemHTMLElement);

        // console.log(`happens after ${userDefinedHandlerName} for remove`)
    }

    ////////////////////
    // shadow
    ////////////////////
    /**
     * Defines the default 'shadow' Event Handler which calls the user defined 'shadow' Event Handler if one is defined on the first/topmost Container in the group.
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
        // console.log(`happens before ${userDefinedHandlerName} for shadow`)
        
        /////////////////////////////
        // User Defined Handler
        /////////////////////////////
        let userDefinedHandler = callingContext[userDefinedHandlerName];

        // Execute userDefinedHandler if it exists
        if (userDefinedHandler) {
            userDefinedHandler(eventItemHTMLElement, eventSourceContainerHTMLElement, eventSource);
        }
        /////////////////////////////
        /////////////////////////////

        // console.log(`happens after ${userDefinedHandlerName} for shadow`)
    }
}