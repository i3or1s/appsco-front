import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationDetailsPassport extends PolymerElement {
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

        <template is="dom-if" if="[[ claims.country ]]">
            <div label="">Country</div>
            <div content="">
                <div class="flex">
                    [[ claims.country ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.country ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.number ]]">
            <div label="">Passport number</div>
            <div content="">
                <div class="flex">
                    [[ claims.number ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.number ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.nationality ]]">
            <div label="">Nationality</div>
            <div content="">
                <div class="flex">
                    [[ claims.nationality ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.nationality ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.issuingAuthority ]]">
            <div label="">Issuing Authority</div>
            <div content="">
                <div class="flex">
                    [[ claims.issuingAuthority ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.issuingAuthority ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.issuedDate ]]">
            <div label="">Issue date</div>
            <div content="">
                <div class="flex">
                    [[ _dateFormat(claims.issuedDate) ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.issuedDate ]]"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ claims.expirationDate ]]">
            <div label="">Expiration date</div>
            <div content="">
                <div class="flex">
                    [[ _dateFormat(claims.expirationDate) ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.expirationDate ]]"></appsco-copy>
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

    static get is() { return 'appsco-application-details-passport'; }

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
            year: "numeric", month: "short", day: "numeric"
        };

        return (new Date(value)).toLocaleDateString('en', options);
    }
}
window.customElements.define(AppscoApplicationDetailsPassport.is, AppscoApplicationDetailsPassport);
