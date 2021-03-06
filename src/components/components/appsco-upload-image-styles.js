import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="appsco-upload-image-styles">
    <template>
        <style>
            :host {
                text-align: center;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --appsco-upload-image-settings;
            }
            :host .upload-container {
                width: 96px;
                height: 96px;
                margin-left: auto;
                margin-right: auto;
                overflow: hidden;
                position: relative;
                @apply --image-upload-container;
            }
            :host .item-image, :host .item-image-upload, :host .icon-upload {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
            }
            :host .item-image {
                max-width: 100%;
                @apply --item-image;
            }
            :host .item-image-upload {
                background-color: rgba(250, 250, 250, 0.8);
                display: block;
                opacity: 0;
                z-index: 5;
                cursor: pointer;
                @apply --item-image-upload-field;
            }
            :host .item-image-upload.no-image {
                opacity: 1;
            }
            :host .item-image-upload:hover {
                opacity: 1;
                transition: opacity .2s ease-in;
            }
            :host .icon-upload {
                width: 32px;
                height: 32px;
                @apply --image-upload-icon;
            }
            :host .upload-file {
                width: 0;
                height: 0;
                opacity: 0;
            }
            :host .remove-action {
                width: auto;
                margin: 10px auto;
                font-size: 14px;
                text-align: center;
                color: var(--secondary-text-color);
                @apply --image-remove-action;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
