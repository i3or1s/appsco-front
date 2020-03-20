import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-collapse/iron-collapse.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomerBillingItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host .customer-logo {
                @apply --layout-vertical;
                @apply --layout-center-justified;
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 50%;
            }

            :host .customer-logo::shadow #sizedImgDiv ,:host .customer-logo::shadow #placeholder {
                border-radius: 50%;
            }

            :host .customer-logo {
                background-color: var(--account-initials-background-color, #f5f8fa);
                color: var(--primary-text-color);
            }

            :host .customer-initials .initials {
                text-align: center;
                text-transform: uppercase;
                font-size: var(--account-initials-font-size, 18px);
                line-height: var(--account-initials-font-size, 18px);
                color: var(--account-initials-font-color);
            }

            :host([mobile-screen]) .item-additional-info {
                display: none;
            }

            iron-collapse {
                @apply --shadow-elevation-2dp;
            }

            :host .reports-container {
                padding: 20px;
                @apply --layout-horizontal;
                @apply --layout-vertical;
                background-color: var(--collapsible-content-background-color);
                display: grid;
                grid-template-columns: 45% 45%;
                grid-gap: 10%;
            }

            :host .report {
                display: grid;
                grid-template-columns: 45% 45%;
                grid-gap: 10%;
            }

            :host .report .info-label {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 13px;
                line-height: 18px;
            }

            :host .report .info-value {
                font-size: 13px;
                line-height: 18px;
                white-space: nowrap;
                color: var(--secondary-text-color);
            }
            :host .item-info {
                padding: 0 10px;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <div class="item">
            <template is="dom-if" if="[[ item.image ]]">
                <iron-image class="customer-logo" sizing="cover" src="[[ item.image ]]"></iron-image>
            </template>

            <template is="dom-if" if="[[ !item.image ]]">
                <div class="customer-logo customer-initials">
                    <span class="initials">[[ _customerInitials ]]</span>
                </div>
            </template>

            <div class="item-info item-basic-info">
                <span class="info-label group-title">[[ item.name ]]</span>
                <span class="info-value">[[ item.billing_email ]]</span>
            </div>

            <div class="item-info item-additional-info">
                <div class="info">
                    <span class="info-label">Assigned licences: </span>

                    <template is="dom-if" if="[[ item.subscription_paid_externally ]]">
                        <span class="info-value">[[ item.max_subscription_size ]]</span>
                    </template>

                    <template is="dom-if" if="[[ !item.subscription_paid_externally ]]">
                        <span class="info-value">0</span>
                    </template>


                </div>

                <div class="info">
                    <span class="info-label">Payment status: </span>

                    <template is="dom-if" if="[[ item.subscription_paid_externally ]]">
                        <span class="info-value">Paid by partner</span>
                    </template>

                    <template is="dom-if" if="[[ !item.subscription_paid_externally ]]">
                        <span class="info-value">Paid by customer</span>
                    </template>

                </div>
            </div>

            <div class="actions">
                <paper-button on-tap="_onShowLicences" hidden\$="[[ _licencesVisible ]]">Show</paper-button>
                <paper-button on-tap="_onHideLicences" hidden\$="[[ !_licencesVisible ]]">Hide</paper-button>
            </div>
        </div>

        <iron-collapse id="licences">
            <div class="reports-container">
                <template is="dom-repeat" items="[[ billingData ]]" as="licence">
                    <div class="report">
                        <span class="info-label">[[ licence.month ]] [[ licence.year ]]</span>
                        <span class="info-value">Licences: [[ licence.used_licences ]]</span>
                    </div>
                </template>
            </div>
        </iron-collapse>
`;
    }

    static get is() { return 'appsco-customer-billing-item'; }

    static get properties() {
        return {
            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _customerInitials: {
                type: String,
                computed: "_computeInitials(item)"
            },

            _licencesVisible: {
                type: Boolean,
                value: false
            }
        };
    }

    _computeInitials(item) {
        let initials = '';
        const name = item.name;
        if (name) {
            const array = name.split(' ');
            if (array.length > 1) {
                initials = array[0].substring(0, 1) + array[1].substring(0, 1);
            } else {
                initials = array[0].substring(0, 2);
            }
        }
        return initials;
    }

    _onShowLicences() {
        this.$.licences.show();
        this._licencesVisible = true;
    }

    _onHideLicences() {
        this.$.licences.hide();
        this._licencesVisible = false;
    }
}
window.customElements.define(AppscoCustomerBillingItem.is, AppscoCustomerBillingItem);
