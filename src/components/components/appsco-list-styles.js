import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="appsco-list-styles">
    <template>
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --appsco-list;

                --paper-progress-container-color: var(--body-background-color);
                --paper-progress-height: 2px;
            }
            :host .list-container {
                width: 100%;
                min-height: 160px;
                padding-top: 10px;
                position: relative;
                @apply --list-container;
            }
            :host .list {
                @apply --layout-vertical;
                @apply --layout-start;
                @apply --list;
            }
            :host .load-more-box {
                margin-top: 10px;
                padding-top: 4px;
                position: relative;
            }
            :host .load-more-box paper-progress {
                width: 100%;
                position: absolute;
                top: 4px;
                left: 0;
            }
            :host .list-progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-list-progress-bar;
            }
            :host .load-more-action {
                display: block;
                width: 120px;
                margin: 10px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host([display-grid]) .list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                @apply --layout-start;
                margin-right: -20px;
            }
            .popup-menu-item-list {
                padding: 0;
            }
            .popup-menu-item {
                align-items: center;                    
                cursor:pointer;
                font-size: 14px;
                height: 40px;
                line-height: 24px;
                min-height: 40px;
                padding: 0 16px;
                position: relative;
                user-select: none;
                width: 168px;
                -webkit-font-smoothing: antialiased;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
