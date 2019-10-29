import {FrameworkConfiguration} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';

export {DragAndDropController} from './elements/drag-and-drop-controller';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./elements/data-model-custom-attribute')
  ]);
}
