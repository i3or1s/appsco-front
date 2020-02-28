import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior
 */
export const AppscoListObserverBehavior = {

    properties: {

        _observableItems: {
            type: Array,
            observer: '_itemsChanged'
        },

        _observableType: {
            type: String
        }
    },

    populateItems: function (items) {
        this._observableItems = items;
    },

    setObservableType: function(type){
        this._observableType = type;
    },

    _itemsChanged: function () {
        var event = this._observableItems.length === 0 ? 'observable-list-empty' : 'observable-list-filled';
        this.dispatchEvent(new CustomEvent(event, {
            bubbles: true,
            composed: true,
            detail: {
                items: this._observableItems,
                type: this._observableType
            }
        }));
    }
};
