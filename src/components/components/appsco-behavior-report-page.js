import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior
 */
export const AppscoBehaviourReportPage = {
    properties: {
    },

    getFilters: function() {
        return {};
    },

    getMethod: function() {
        return 'GET';
    },

    getFileName: function() {
        return 'report.xlsx';
    },

    getOnSuccessEvent: function() {
        return '';
    },

    getOnFailEvent: function() {
        return '';
    },

    getFailMessage: function() {
        return 'Report export failed';
    }
};
