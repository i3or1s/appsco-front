import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccessReportActions extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                @apply --appsco-access-report-actions;
            }
            :host .action {
                margin-left: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-flex-none;
                @apply --access-report-action;
            }
            :host .export-action {
                @apply --primary-button;
                min-width: 100px;
            }
        </style>
        
        <div class="action">
            <paper-button class="export-action" on-tap="_onExportAction">Export</paper-button>
        </div>
`;
    }

    static get is() { return 'appsco-access-report-actions'; }

    _onExportAction() {
        this.dispatchEvent(new CustomEvent('export-access-report', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoAccessReportActions.is, AppscoAccessReportActions);
