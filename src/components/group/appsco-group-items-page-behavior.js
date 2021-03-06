import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior
 */
export const AppscoGroupItemsPageBehavior = {
    properties: {

        group: {
            type: Object,
            value: function() {
                return {};
            }
        },

        authorizationToken: {
            type: String,
            value: ''
        }
    },

    loadPage: function() {
        this.$.appscoCompanyGroupItems.loadItems();
    },

    addGroupItems: function(items) {
        this.$.appscoCompanyGroupItems.addGroupItems(items);
    },

    removeGroupItems: function(items) {
        this.$.appscoCompanyGroupItems.removeGroupItems(items);
    },

    _onAddToGroupAction: function() {
        this.dispatchEvent(new CustomEvent('add-item-to-group-event', {
            bubbles: true,
            composed: true,
            detail: {
                resourceType: this.resourceType
            }
        }));
    },

    _onClosePageAction: function() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }
};
