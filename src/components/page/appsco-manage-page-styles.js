import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../shared-styles.js';
import '../../webkit-scrollbar-style.js';
import './appsco-page-styles.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="appsco-manage-page-styles">
    <template>
        <style include="appsco-page-styles">
            :host {
                --resource-width: 300px;
            }
            :host div[resource] {
                padding: 10px;
                height: calc(100% - 20px);
            }
            :host div[resource] > .resource-header {
                height: auto;
                line-height: normal;
                padding: 20px 10px 30px;
                position: relative;
            }
            :host div[resource] > .resource-content, :host .content-container {
                padding: 0;
            }
            :host div[resource] > .resource-content {
                padding-top: 10px;
            }
            :host div[resource] > .resource-content > * {
                margin: 4px 0;
            }
            :host div[resource] > .resource-content p {
                margin: 0;
            }
            :host div[content] {
                height: 100%;
            }
            :host .content-container, :host .content-container neon-animated-pages {
                height: 100%;
            }
            appsco-account-image-settings {
                display: block;
            }
            :host([medium-screen]) {
                --resource-width: 240px;
            }
            :host([mobile-screen]) {
                --resource-width: 180px;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
