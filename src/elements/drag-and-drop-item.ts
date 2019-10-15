import {bindable,containerless} from 'aurelia-framework';

@containerless
export class DragAndDropItem {
    @bindable public id: string;
    @bindable public objectId: string;
    @bindable public text: string;
    // position = { x: 0, y: 0 }

    constructor(init?:Partial<DragAndDropItem>) {
        Object.assign(this, init);
    }

    drag_handler(ev: DragEvent) {
        console.log(`--------------------`)
        console.log(`DragAndDropItem ${this.id}'s drag_handler fired with DragEvent:`);
        console.log(ev);
        console.log(`--------------------`)

    //     // ghostImg.style.zIndex = '99';
    //     // ghostImg.style.top = ev.clientY + 'px';
    //     // ghostImg.style.left = ev.clientX + 'px';
        // return true;
    }

    dragend_handler(ev: DragEvent) {
        console.log(`--------------------`)
        console.log(`DragAndDropItem ${this.id}'s dragend_handler fired with DragEvent:`);
        console.log(ev);
        console.log(`--------------------`)

    //     // Remove the surrogate element each time a drag ends to cleanup after ourselves.
    //     if (document.getElementById("surrogateDragElement")) {
    //         document.getElementById("surrogateDragElement").remove();
    //     }
        // return true;        
    }
    
    dragstart_handler(ev: DragEvent) {
        console.log(`--------------------`)
        console.log(`DragAndDropItem ${this.id}'s dragstart_handler fired with DragEvent:`);
        console.log(ev);
        console.log(`--------------------`)

    //     // Add the target element's id to the data transfer object
    //     ev.dataTransfer.setData("text/plain", (ev.target as HTMLElement).id);
    //     this.createSurrogateDragElement(ev);
        // return true;
    }


    // // Get the drag-and-drop element and rebuild it to ensure it resembles the original element correctly.
    // createSurrogateDragElement(ev: DragEvent) {
    //     // Get the drag-and-drop element.
    //     var dragElement = ev.srcElement as HTMLElement || ev.target as HTMLElement;

    //     // Create a new element of the same type as the drag-and-drop element to act as the copy.
    //     let surrogateDragElement = document.createElement(dragElement.tagName);

    //     // Specify the id used to get the 
    //     surrogateDragElement.id = "surrogateDragElement";

    //     // Set the width to overcome Edge resizing the element to the content size
    //     let dragImageWidth = dragElement.clientWidth;
    //     surrogateDragElement.setAttribute('style', `position: absolute; left: 0px; top: 0px; z-index: -1; width: ${dragImageWidth}px;`);

    //     surrogateDragElement.setAttribute('class', 'drag-and-drop-item');
    //     surrogateDragElement.innerHTML = dragElement.innerHTML;
    //     document.body.appendChild(surrogateDragElement);// And finally we assign the dragImage and center it on cursor
    //     ev.dataTransfer.setDragImage(surrogateDragElement, 20, 20);
    // }
}
