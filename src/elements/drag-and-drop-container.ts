import { bindable, containerless, inject } from 'aurelia-framework';
import { DragAndDropItem } from './drag-and-drop-item';
// import * as dragula from 'dragula';

@inject(Element)
@containerless
export class DragAndDropContainer {
    public element:                 HTMLElement;
    @bindable public groupName:     string;
    @bindable public id:            string;
    @bindable public items:         Array<DragAndDropItem> = new Array<DragAndDropItem>();

    constructor(element: HTMLElement) {
        this.element = element;
    }

    attached() {

    }

    dragover_handler(ev: DragEvent) {
        ev.preventDefault();
        console.log(`--------------------`)
        console.log(`DragAndDropContainer ${this.id}'s dragover_handler fired with DragEvent:`);
        console.log(ev);
        console.log(`--------------------`)
        // ev.dataTransfer.dropEffect = "copy";
        // return true;
    }

    drop_handler(ev: DragEvent) {
        console.log(`--------------------`)
        console.log(`DragAndDropContainer ${this.id}'s drop_handler fired with DragEvent:`);
        console.log(ev);
        console.log(`--------------------`)
//         console.log('--------------------------------------------------------------------------------------')
//         ev.preventDefault();

//         var data = ev.dataTransfer.getData("text/plain");
// // console.log(ev)
//         let targetNode = ev.target as HTMLElement;
//         let targetClassList = targetNode.classList as DOMTokenList;
//         let dragAndDropItem = document.getElementById(data);
//         let lineItemId = (dragAndDropItem as any).lineItemId;

//         // dropped on another item or placeholder?
//         if (targetClassList.contains("drag-and-drop-item") || targetClassList.contains("drag-and-drop-dropzone-placeholder")) {
//             targetNode = (ev.target as HTMLElement).parentNode as HTMLElement;
//         }

//         // console.log(lineItemId);
//         let targetNewInvoiceIndex = (targetNode as any).newInvoiceIndex;
//         // console.log(targetNewInvoiceIndex)
//         let itemSearchNewInvoiceIndex = 0;

//         for (let newInvoice of this.newInvoices) {
//             let lineItemIndex = newInvoice.lineItems.findIndex((x) => { return x.id == lineItemId; });

//             if (lineItemIndex != -1) {
//                 // console.log(`found ${lineItemId} at index ${lineItemIndex} of ${itemSearchNewInvoiceIndex}`)
//                 newInvoice.lineItems.splice(lineItemIndex,1);
//             }

//             itemSearchNewInvoiceIndex++;
//         }

//         this.newInvoices[targetNewInvoiceIndex].lineItems.push({ id: lineItemId });
//         targetNode.appendChild(dragAndDropItem);    // append to parent

//         let printInvoiceIndex = 0;
//         for (let newInvoice of this.newInvoices) {
//             console.log(`${printInvoiceIndex} contains...`)
//             for (let lineItem of newInvoice.lineItems) {
//                 console.log(`${lineItem.id}`);
//             }
//             printInvoiceIndex++;
//         }
        // return true;
    }
}
