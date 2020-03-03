import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationImage extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            :host .application-image {
                @apply --layout-vertical;
                @apply --layout-center-justified;
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 50%;
                @apply --application-image;
            }
            :host .application-image.no-radius {
                border-radius: 0;
            }
            :host .application-initials {
                background-color: var(--application-initials-background-color, #f5f8fa);
                color: var(--primary-text-color);
            }
            :host .application-initials .initials {
                text-align: center;
                text-transform: uppercase;
                font-size: var(--application-initials-font-size, 18px);
                line-height: var(--application-initials-font-size, 18px);
                color: var(--application-initials-font-color);
            }
        </style>

        <template is="dom-if" if="[[ application.application_url ]]">
            <iron-image class="application-image no-radius" sizing="cover" preload="" fade="" src="[[ application.application_url ]]"></iron-image>
        </template>

        <template is="dom-if" if="[[ !application.application_url ]]">
            <div class="application-image application-initials">
                <span class="initials">[[ _applicationInitials ]]</span>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-application-image'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _applicationInitials: {
                type: String,
                computed: '_computeApplicationInitials(application)'
            }
        };
    }

    _computeApplicationInitials(application) {
        return application.title ? application.title.substring(0, 2) : '';
    }
}
window.customElements.define(AppscoApplicationImage.is, AppscoApplicationImage);
