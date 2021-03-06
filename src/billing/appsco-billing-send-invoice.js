import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../components/components/appsco-loader.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoBillingSendInvoice extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Send invoice</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <div>
                        <template is="dom-if" if="[[ company.company.billing_email ]]">
                            <p>Invoice will be sent to the billing email specified in company settings: [[ company.company.billing_email ]]</p>
                        </template>
                        <template is="dom-if" if="[[ !company.company.billing_email ]]">
                            <p>Invoice will be sent to the contact email specified in company settings: [[ company.company.contact_email ]]</p>
                        </template>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onSend">Send</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-billing-send-invoice'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            invoice: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            subscription: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            companyApi: {
                type: String
            },

            _sendInvoiceApi: {
                type: String,
                computed: '_computeSendInvoiceApi(companyApi, invoice, subscription)'
            },

            _loader: {
                type: Boolean,
                value: false
            }
        };
    }

    _computeSendInvoiceApi(companyApi, invoice, subscription) {
        return companyApi + '/billing/' + subscription.id + '/invoice/' + invoice.id + '/send';
    }

    toggle() {
        this.$.dialog.toggle();
    }

    _onDialogClosed() {
        this._loader = false;
    }

    _onSend() {
        const request = document.createElement('iron-request'),
            options = {
                url: this._sendInvoiceApi,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            };

        this._loader = true;

        request.send(options).then(function(request) {
            this.$.dialog.close();

            this.dispatchEvent(new CustomEvent('invoice-sent', {
                bubbles: true,
                composed: true,
                detail: {
                    sentTo: this.company.billing_email
                }
            }));
        }.bind(this));
    }

    setInvoice(invoice) {
        this.set('invoice', invoice);
    }

    setSubscription(subscription) {
        this.set('subscription', subscription);
    }
}
window.customElements.define(AppscoBillingSendInvoice.is, AppscoBillingSendInvoice);
