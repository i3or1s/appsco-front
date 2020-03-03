import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationDetailsUnpw extends PolymerElement {
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

        <template is="dom-if" if="[[ claims.username ]]">
            <div label="">Username</div>
            <div content="">
                <div class="flex">
                    [[ claims.username ]]
                </div>
                <div>
                    <appsco-copy value="[[ claims.username ]]" name="username"></appsco-copy>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ _showPassword ]]">
            <div label="">Password</div>
            <div content="">
                <div class="flex">
                    ********************
                </div>
                <div>
                    <appsco-copy value="[[ _showPassword ]]" name="password"></appsco-copy>
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
                    <appsco-copy value="[[ claims.note ]]"></appsco-copy>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-application-details-unpw'; }

    static get properties() {
        return {
            _showPassword: {
                type: Boolean,
                computed: '_computeShowPassword(company, claims)'
            },

            company: {
                type: Object,
                notify: true
            },

            claims: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            }
        };
    }

    _computeShowPassword(company, claims) {
        return company && company.disable_resource_copy_button ?
            false :
            claims.password
            ;
    }
}
window.customElements.define(AppscoApplicationDetailsUnpw.is, AppscoApplicationDetailsUnpw);
