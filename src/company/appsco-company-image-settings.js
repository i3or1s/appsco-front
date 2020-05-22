import '@polymer/polymer/polymer-legacy.js';
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

class AppscoCompanyImageSettings extends mixinBehaviors([AppscoUploadImageBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-upload-image-styles">
        </style>

        <div class="upload-container">
            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <iron-image class="item-image" src\$="[[ company.image ]]" alt="Company logo" sizing="contain"></iron-image>

            <template is="dom-if" if="[[ !previewOnly ]]">
                <label for="imageInput" class\$="item-image-upload [[ _imagePreview ]]">
                    <iron-icon icon="file-upload" class="icon-upload"></iron-icon>
                </label>

                <input type="file" accept="image/*" id="imageInput" name="company-image" class="upload-file" on-change="_onUploadImage">
            </template>
        </div>

        <template is="dom-if" if="[[ !previewOnly ]]">
            <template is="dom-if" if="[[ company.image ]]">
                <paper-button class="remove-action" on-tap="_onRemoveImageAction">Remove logo</paper-button>
            </template>
        </template>
`;
    }

    static get is() { return 'appsco-company-image-settings'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {}
                },
                notify: true
            },

            _imagePreview: {
                type: String,
                computed: '_computeImagePreviewClass(company)'
            }
        };
    }

    reset() {
        const company = JSON.parse(JSON.stringify(this.company));

        this.set('company', {});
        this.set('company', company);
    }

    _computeImagePreviewClass(company) {
        return (company && company.image) ? 'has-image' : 'no-image';
    }

    _setNewImage(file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            this._setObjectAttribute('company', 'image', e.target.result);
        }.bind(this);

        reader.readAsDataURL(file);
    }

    _fireChangeEvent(response) {
        this.dispatchEvent(new CustomEvent('company-logo-changed', {
            bubbles: true,
            composed: true,
            detail: {
                company: JSON.parse(response)
            }
        }));
    }

    _setStateAfterImageIsRemoved(response) {
        this.set('company', response);
        this._fireChangeEvent(JSON.stringify(response));
        this._hideLoader();
    }
}
window.customElements.define(AppscoCompanyImageSettings.is, AppscoCompanyImageSettings);
