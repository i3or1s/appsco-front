import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/components/appsco-loader.js';
import { AppscoUploadImageBehavior } from '../components/components/appsco-upload-image-behavior.js';
import '../components/components/appsco-upload-image-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoResourceImageSettings extends mixinBehaviors([AppscoUploadImageBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-upload-image-styles">
            :host .upload-container {
                width: 64px;
                height: 64px;
                @apply --image-upload-container;
            }
        </style>

        <div class="upload-container">

            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <iron-image class="item-image" src="[[ resource.application_url ]]" alt="Resource image" sizing="cover"></iron-image>

            <template is="dom-if" if="[[ !previewOnly ]]">
                <label for="resourceImageInput" class\$="item-image-upload [[ _imagePreview ]]">
                    <iron-icon icon="file-upload" class="icon-upload"></iron-icon>
                </label>

                <input type="file" accept="image/*" id="resourceImageInput" name="resource-image" class="upload-file" on-change="_onUploadImage">
            </template>
        </div>

        <template is="dom-if" if="[[ !previewOnly ]]">
            <template is="dom-if" if="[[ resource.application_url ]]">
                <paper-button class="remove-action" on-tap="_onRemoveImageAction">Reset icon</paper-button>
            </template>
        </template>

        <slot name="info" old-content-selector="[info]"></slot>
`;
    }

    static get is() { return 'appsco-resource-image-settings'; }

    static get properties() {
        return {
            /**
             * resource to update.
             */
            resource: {
                type: Object,
                value: function () {
                    return {}
                },
                notify: true
            },

            _imagePreview: {
                type: String,
                computed: '_computeImagePreviewClass(resource)'
            }
        };
    }

    /**
     * Resets component.
     */
    reset() {
        var resource = JSON.parse(JSON.stringify(this.resource));

        this.set('resource', {});
        this.set('resource', resource);
    }

    _computeImagePreviewClass(resource) {
        return (resource && resource.application_url) ? 'has-image' : 'no-image';
    }

    _setNewImage(file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            this._setObjectAttribute('resource', 'application_url', e.target.result);
        }.bind(this);

        reader.readAsDataURL(file);
    }

    _fireChangeEvent() {
        this.dispatchEvent(new CustomEvent('resource-image-changed', { bubbles: true, composed: true }));
    }

    _setStateAfterImageIsRemoved(response) {
        this.set('resource', response);
        this._fireChangeEvent();
        this._hideLoader();
    }
}
window.customElements.define(AppscoResourceImageSettings.is, AppscoResourceImageSettings);
