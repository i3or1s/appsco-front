import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomerSubscriptionToggle extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                @apply --appsco-customer-subscription-toggle;
            }
            :host paper-toggle-button {
                cursor: pointer;
            }
            :host .info {
                margin-top: 10px;
            }
        </style>

        <paper-toggle-button id="switch" checked\$="[[ customer.subscription_paid_externally ]]" on-change="_onSwitchChanged">Subscription paid by partner</paper-toggle-button>
        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <div class="info">
            <template is="dom-if" if="[[ _isSubscriptionPaidExternally  ]]">
                <p>Subscription is paid for the customer by partner.</p>
                <p>You have [[ partner.remainingLicences ]] available licences to distribute.</p>
            </template>

            <template is="dom-if" if="[[ !_isSubscriptionPaidExternally  ]]">
                <p>Subscription is paid by customer.</p>

                <p>In order to set the customer subscription payment type as partner pays for customer,
                    you need to have at least [[ customer.used_licences ]] licences available.</p>

                <p>Once you change the payment type to partner pays for customer, the number of licences the customer
                    is currently using ([[ customer.used_licences ]]) will automatically be withdrawn from your
                    available customer licences ([[ partner.remainingLicences ]]).
                </p>
            </template>

            <template is="dom-if" if="[[ _isSubscriptionPaidExternally  ]]">
                <p>Customer has [[ customer.used_licences ]] used licences currently.</p>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-customer-subscription-toggle'; }

    static get properties() {
        return {
            customer: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            partner: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            apiErrors: {
                type: Array,
                value: function () {
                    return {};
                }
            },

            _isSubscriptionPaidExternally: {
                type: Boolean,
                computed: '_computeIsSubscriptionPaidExternally(customer)'
            },

            _subscriptionPaidStateApi: {
                type: String,
                computed: '_computeSubscriptionPaidStateApi(customer)'
            },

            _errorMessage: {
                type: String
            }
        };
    }

    resetCustomer() {
        const customer = JSON.parse(JSON.stringify(this.customer));
        this.set('customer', {});
        this.set('customer', customer);
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _turnSubscriptionPaidExternallyOn() {
        this.customer.subscription_paid_externally = true;
        this.resetCustomer();
        this._callSubscriptionPaidExternallyApi(1);
    }

    _turnSubscriptionPaidExternallyOff() {
        this.customer.subscription_paid_externally = false;
        this.resetCustomer();
        this._callSubscriptionPaidExternallyApi(0);
    }

    _callSubscriptionPaidExternallyApi(status) {
        const request = document.createElement('iron-request'),
            options = {
                url: this._subscriptionPaidStateApi,
                method: 'PUT',
                handleAs: 'json',
                headers: this._headers,
                body: 'form[subscription_paid_externally]=' + status
            };

        if (!this._subscriptionPaidStateApi || !this._headers) {
            this._showError(this.apiErrors.getError(404));
            return false;
        }

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('customer-subscription-state-changed', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        customer: request.response.customer,
                        partner: request.response.partner
                    }
                }));
            }

        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this.customer.subscription_paid_externally = !status;
            this.resetCustomer();
        }.bind(this));
    }

    _onSwitchChanged(event) {
        event.target.checked ? this._turnSubscriptionPaidExternallyOn() : this._turnSubscriptionPaidExternallyOff();
    }

    _computeIsSubscriptionPaidExternally(customer) {
        return customer && customer.subscription_paid_externally == true;
    }

    _computeSubscriptionPaidStateApi(customer) {
        return customer ? (customer.self + '/paid-externally') : null;
    }
}
window.customElements.define(AppscoCustomerSubscriptionToggle.is, AppscoCustomerSubscriptionToggle);
