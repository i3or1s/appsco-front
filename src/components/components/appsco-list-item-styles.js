import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="appsco-list-item-styles">
    <template>
        <style>
            :host {
                display: none;

                --icon-action-fill-color: rgba(158, 160, 166, 0.5);
            }
            :host([selected]) {
                --icon-action-fill-color: rgb(158, 160, 166);
            }
            :host .item {
                @apply --shadow-elevation-2dp;
                @apply --layout-horizontal;
                @apply --layout-center;
                width: 100%;
                height: 70px;
                padding: 0 10px;
                overflow: hidden;
                background-color: var(--item-background-color, #fff);
                color: var(--color, #414042);
                box-sizing: border-box;
                border-radius: 3px;
                text-align: left;
                cursor: pointer;
                position: relative;
                transition: all 0.1s ease-out;
                @apply --appsco-list-item;
            }
            :host .item:hover, :host([activated]) .item {
                @apply --shadow-elevation-6dp;
                transition: all 0.2s ease-in;
                @apply --appsco-list-item-activated;
            }
            :host .select-action {
                @apply --layout-flex-none;
                width: var(--item-icon-width, 52px);
                height: var(--item-icon-height, 52px);
                position: relative;
            }
            :host .item-icon {
                width: var(--item-icon-width, 52px);
                height: var(--item-icon-height, 52px);
                cursor: pointer;
                opacity: 1;
                transition: opacity 0.1s linear;
                @apply --layout-flex-none;
            }
            :host .icon-action {
                background-color: var(--icon-action-fill-color);
                width: var(--item-icon-width, 52px);
                height: var(--item-icon-height, 52px);
                border-radius: var(--icon-action-border-radius, 26px);
                @apply --layout-flex-none;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                transition: all 0.1s linear;
            }
            :host .iron-action .iron-action-inner {
                position: relative;
            }
            :host .icon-action iron-icon {
                color: #ffffff;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
            }
            :host .select-action:hover .item-icon {
                opacity: 0.2;
                transition: opacity 0.2s 0.05s linear;
            }
            :host([hover-disabled]) .select-action:hover .item-icon {
                opacity: 1;
            }
            :host([hover-disabled]) .select-action:hover .icon-action {
                opacity: 0;
            }
            :host([selected]) .item-icon, :host([selected]) .select-action:hover .item-icon {
                opacity: 0;
            }
            :host .select-action:hover .icon-action, :host([selected]) .icon-action {
                opacity: 1;
                transition: all 0.2s linear;
            }
            :host .item-title {
                display: block;
                height: 32px;
                line-height: 16px;
                @apply --paper-font-common-base;
                font-size: 14px;
                font-weight: 400;
                overflow: hidden;
            }
            :host .item-info {
                @apply --layout-vertical;
                @apply --layout-start;
                padding: 0 10px;
            }
            :host .item-basic-info {
                width: 220px;
                @apply --item-basic-info;
            }
            :host .info-label {
                font-size: 16px;
                height: auto;
                line-height: normal;
                @apply --item-info-label;
            }
            :host .info-value {
                display: block;
                font-size: 12px;
                @apply --item-info-value;
            }
            :host .item-basic-info .info-label, :host .item-basic-info .info-value {
                width: 226px;
                @apply --paper-font-common-nowrap;
            }
            :host .item-additional-info {
                width: 65%;
                border-left: 1px solid var(--divider-color);
                @apply --item-additional-info;
            }
            :host .item-additional-info .info {
                width: 70%;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .item-additional-info .info-label {
                color: var(--secondary-text-color);
            }
            :host .item-additional-info .info-label, :host .item-additional-info .info-value {
                font-size: 13px;
                line-height: 18px;
                white-space: nowrap;
            }
            :host .item-additional-info .info-value {
                @apply --paper-font-common-nowrap;
            }
            :host .actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                position: absolute;
                right: 4px;
                bottom: 4px;
                @apply --item-actions;
            }
            :host .actions paper-button {
                @apply --paper-font-common-base;
                @apply --paper-font-common-nowrap;
                padding: 4px;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.018em;
                line-height: 18px;
                text-transform: uppercase;
            }
            :host paper-button[disabled] {
                background: transparent;
            }
            :host([display-grid]) .item {
                text-align: center;
                width: 140px;
                height: 156px;
                overflow: hidden;
                @apply --shadow-elevation-2dp;
                position: relative;
                background-color: var(--item-background-color, #fff);
                color: var(--color, #333);
                padding: 0 4px;
                cursor: pointer;
                box-sizing: inherit;
                display: block;
            }
            :host([display-grid]) .item .select-action,
            :host([display-grid]) .item iron-image.not-selectable {
                display: inline-block;
                margin: 24px 0 10px 0;
                overflow: hidden;
            }
            :host([display-grid]) .item .resource-title {
                display: block;
                height: 32px;
                line-height: 16px;
                @apply --paper-font-common-base;
                font-size: 14px;
                font-weight: 400;
                overflow: hidden;
            }
            :host([display-grid]) .actions {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host([tablet-screen]) .item-additional-info {
                display: none;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
