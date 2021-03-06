import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../shared-styles.js';
import '../../webkit-scrollbar-style.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="appsco-page-styles">
    <template>
        <style include="shared-styles webkit-scrollbar-style">
            :host {
                display: block;
                font-size: 14px;
                color: var(--primary-text-color);

                --resource-width: 318px;
                --info-width: 318px;
                --collapsible-content-background-color: #fbfbfb;
            }
            :host * {
                color: var(--primary-text-color);
            }
            :host hr {
                height: 1px;
                margin: 4px 0;
                border: none;
                background-color: var(--divider-color);
            }
            :host .button {
                @apply --primary-button;
            }
            :host .secondary-button {
                @apply --secondary-button;
            }
            :host .danger-button {
                @apply --danger-button;
            }
            :host div[resource] {
                height: 100%;
                overflow: auto;
            }
            :host .resource-header, :host .info-header, :host .content-top-header {
                height: 50px;
                line-height: 30px;
                color: var(--primary-text-color);
                font-size: 16px;
                border-bottom: 1px solid var(--divider-color);
                @apply --layout-flex-none;
            }
            :host div[resource] > *:not(.resource-actions), :host div[info] > *:not(.info-actions) , :host *[content-top] > * {
                padding: 10px;
                box-sizing: border-box;
            }
            :host .resource-actions, :host .info-actions {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
            }
            :host .resource-actions > paper-button, :host .info-actions > paper-button {
                border-radius: 0;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            :host .content-top-actions .action {
                @apply --link-button;
                padding: 4px;
                font-size: 14px;
                font-weight: 400;
                line-height: 18px;
                text-transform: uppercase;
            }
            :host div[content] {
                min-height: 100%;
            }
            :host .content-container {
                padding: 10px;
                @apply --content-container;
            }
            :host div[info] {
                height: 100%;
            }
            :host .info-header .info-icon {
                width: 32px;
                height: 32px;
                margin-right: 5px;
            }
            :host .info-header .info-title {
                @apply --paper-font-subhead;
                font-size: 18px;
            }
            :host .info-content {
                height: calc(100% - 50px - 40px);
                margin-top: 10px;
                overflow: auto;
            }
            :host *[hidden] {
                display: none;
            }
            :host .flex-horizontal {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .flex-vertical {
                @apply --layout-vertical;
            }
            :host .flex {
                @apply --layout-flex;
            }
            :host .flex-end {
                @apply --layout-end-justified;
            }
            :host([tablet-screen]) {
                --resource-width: 250px;
                --info-width: 300px;
            }
            :host([mobile-screen]) {
                --resource-width: 200px;
                --info-width: 100%;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
