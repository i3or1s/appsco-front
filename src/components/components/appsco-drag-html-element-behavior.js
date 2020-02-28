import '@polymer/polymer/polymer-legacy.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

/**
 * @polymerBehavior
 */
export const AppscoDragHTMLElementBehavior = {

    properties: {},

    _addDragElementOverlay: function(dragElement) {
        var overlay = '<div class="application-overlay" ' +
                'style="background: rgba(0, 0, 0, 0.4); position: absolute;' +
                'top: 0;left: 0;right: 0;bottom: 0;"></div>',
            template = document.createElement('template');

        template.innerHTML = overlay;
        dom(dragElement.root).appendChild(template.content.firstChild);
    },

    _removeDragElementOverlay: function(dragElement) {
        var draggedElement = dom(dragElement.root);

        draggedElement.removeChild(draggedElement.childNodes[draggedElement.childNodes.length - 1]);
    },

    dragStart: function(event) {
        var draggedHTMLElement = event.target;

        event.stopPropagation();

        event.dataTransfer.setDragImage(draggedHTMLElement, 50, 50);

        AppscoDragHTMLElementBehavior._addDragElementOverlay(draggedHTMLElement);
        draggedHTMLElement.className = draggedHTMLElement.className + ' is-dragged';
        event.dataTransfer.setData('dragItem', JSON.stringify(draggedHTMLElement.dataDragItem));
    },

    dragEnd: function(event) {
        var draggedHTMLElement = event.target;

        event.stopPropagation();

        AppscoDragHTMLElementBehavior._removeDragElementOverlay(draggedHTMLElement);
        draggedHTMLElement.className = draggedHTMLElement.className.replace(' is-dragged', '');
    },

    initializeDragBehavior: function() {
        var dragElements = dom(this.root).querySelectorAll('.drag-item');

        if (dragElements && 0 < dragElements.length) {
            var length = dragElements.length;

            for (var i = 0; i < length; i++) {
                var dragElement = dragElements[i];

                dragElement.addEventListener('dragstart', this.dragStart, false);
                dragElement.addEventListener('dragend', this.dragEnd, false);
            }
        }
    }
};
