import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior
 */
export const AppscoPageBehavior = {

    properties: {

        _itemsComponent: {
            type: Object,
            value: function() {
                return {};
            }
        },

        _selectedAll: {
            type: Boolean,
            value: false
        }
    },

    selectAllItems: function() {
        const rolesComponent = this._itemsComponent;

        this._selectedAll = !this._selectedAll;

        if (this._selectedAll) {
            rolesComponent.selectAllItems();
            this._showBulkActions();
        }
        else {
            rolesComponent.deselectAllItems();
            this._hideBulkActions();
        }
    },

    _selectAllItems: function() {
        this._selectedAll = true;
    },

    _deselectAllItems: function() {
        this._selectedAll = false;
    },

    _handleItemsSelectedState: function() {
        const itemsComponent = this._itemsComponent,
            totalCount = itemsComponent.getTotalCount(),
            selectedItemsCount = itemsComponent.getSelectedItems().length;

        (totalCount === selectedItemsCount) ? this._selectAllItems() : this._deselectAllItems();
    }
};
