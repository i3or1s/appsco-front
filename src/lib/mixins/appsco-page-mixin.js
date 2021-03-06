import '@polymer/polymer/polymer-legacy.js';
if (!window.Appsco) {
    window.Appsco = {};
}

Appsco.PageMixin = {
    properties: {
        toolbar: {
            type: Object
        }
    },

    _showBulkActions: function() {
        this.toolbar.showBulkActions();
    },

    _hideBulkActions: function() {
        this.toolbar.hideBulkActions();
    },

    _hideProgressBar: function() {
        this.dispatchEvent(new CustomEvent('hide-page-progress-bar', { bubbles: true, composed: true }));
    },

    _showProgressBar: function() {
        this.dispatchEvent(new CustomEvent('show-page-progress-bar', { bubbles: true, composed: true }));
    },

    _resetPageActions: function() {
        this.toolbar.resetPageActions();
    },

    _notify: function(message, persistent) {
        this.dispatchEvent(new CustomEvent('notify', {
            bubbles: true,
            composed: true,
            detail: {
                message: message,
                persistent: persistent ? persistent : false
            }
        }));
    }
};
