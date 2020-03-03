import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationDetailsSoftwareLicence extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host div[label] {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                @apply --application-details-label;
            }

            :host div[content] {
                color: var(--primary-text-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --paper-font-subhead;
                @apply --application-details-value;
            }

            :host .flex {
                @apply --layout-flex;
                @apply --paper-font-common-nowrap;
            }

            :host > div {
                margin: 6px 0;
            }
        </style>

        <template is="dom-if" if="[[ claims.productName ]]">
            <div label="">Product name</div>
            <div content="">
                <div class="flex">
                    [[ claims.productName ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.productName ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.publisher ]]">
            <div label="">Publisher</div>
            <div content="">
                <div class="flex">
                    [[ claims.publisher ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.publisher ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.licenceKey ]]">
            <div label="">Licence key</div>
            <div content="">
                <div class="flex">
                    ********************
                </div>
                <div>
                    <appsco-copy value="[[ claims.licenceKey ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.website ]]">
            <div label="">Website</div>
            <div content="">
                <div class="flex">
                    [[ claims.website ]]
                </div>
                <div>
                    <a href="[[ claims.website ]]" target="_blank" rel="noopener noreferrer">
                        <paper-icon-button icon="icons:open-in-new"></paper-icon-button>
                    </a>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.numberOfLicences ]]">
            <div label="">Number of licences</div>
            <div content="">
                <div class="flex">
                    [[ claims.numberOfLicences ]]
                </div>
                <div>

                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.licence ]]">
            <div label="">Licence</div>
            <div content="">
                <div class="flex">
                    ****************
                </div>
                <div>
                    <appsco-copy value="[[ claims.licence ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.licenceExpirationDate ]]">
            <div label="">Licence expiration date</div>
            <div content="">
                <div class="flex">
                    [[ _dateFormat(claims.licenceExpirationDate) ]]
                </div>
                <div>

                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.note ]]">
            <div label="">Note</div>
            <div content="">
                <div class="flex">
                    [[ claims.note ]]
                </div>
                <div>

                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-application-details-softwarelicence'; }

    static get properties() {
        return {
            claims: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            }
        };
    }

    _dateFormat(value) {
        if (!value) {
            return '';
        }

        const options = {
            year: "numeric", month: "numeric", day: "numeric"
        };

        return (new Date(value)).toLocaleDateString('en', options);
    }
}
window.customElements.define(AppscoApplicationDetailsSoftwareLicence.is, AppscoApplicationDetailsSoftwareLicence);
