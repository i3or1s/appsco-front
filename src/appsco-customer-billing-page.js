import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-image/iron-image.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/components/appsco-loader.js';
import './components/components/appsco-date-format.js';
import './components/components/appsco-price.js';
import './billing/appsco-billing-invoice.js';
import './components/page/appsco-content.js';
import './billing/appsco-subscription-cancel.js';
import './billing/appsco-credit-card.js';
import './billing/appsco-billing-send-invoice.js';
import './billing/appsco-update-subscription-action.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCustomerBillingPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --resource-width: 300px;
                --info-width: 300px;

                --paper-card: {
                    min-height: 150px;
                    box-sizing: border-box;
                    font-size: 14px;
                };

                --paper-card-content: {
                    min-height: 70px;
                    box-sizing: border-box;
                };
                --paper-card-actions: {
                    padding: 0;
                    border-color: var(--divider-color);
                };
                --paper-card-header-text: {
                    @apply --page-paper-card-header-text;
                    font-size: 18px;
                    color: var(--primary-text-color);
                    border-bottom: 1px solid var(--divider-color);
                };
            }
            :host([tablet-screen]) {
                --info-width: 100%;
                --resource-width: 240px;
            }
            :host([mobile-screen]) {
                --resource-width: 180px;
            }
            :host .mt20 {
                margin-top: 20px;
            }
            :host .mt10 {
                margin-top: 10px;
            }
            :host .plan-upcoming-invoice {
                min-height: 260px;
            }
            :host .info-header {
                background-color: var(--brand-color);
                padding: 10px 0 5px 10px;
            }
            :host .info-content-container {
                height: calc(100% - 64px - 38px - 40px);
                position: relative;
            }
            :host .info-content {
                padding: 10px;
                overflow: auto;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            .payment-info {
                line-height: 90%;
            }
            .message {
                @apply --info-message;
            }
            :host .credit-card-logo {
                width: auto;
                height: auto;
                max-height: 48px;
            }
            :host .subscription-plan {
                width: 45%;
            }
            :host .upcoming {
                margin-left: 10px;
            }
            :host .subscription-plan-label {
                opacity: 0.6;
                padding: 2px 5px 2px 0;
            }
            :host .subscription-info {
                @apply --info-box;
                margin-bottom: 20px;
                font-size: 14px;
            }
            :host([medium-screen]) .subscription-plan {
                min-width: inherit;
                @apply --layout-flex;
            }
            :host([tablet-screen]) .subscription-plan {
                margin-right: 0;
                margin-bottom: 10px;
            }
            :host .paper-card-action {
                padding: 6px 0;
                margin: 0;
                border-radius: 0;
                width: 100%;
                color: var(--primary-text-color);
                font-weight: 400;
            }
            :host appsco-billing-invoice {
                margin-bottom: 5px;
            }
            :host .invoice-list {
                margin-top: 10px;
                position: relative;
            }
            .invoice-list-title {
                font-weight: 400;
                margin: 20px 0 0 0;
            }
            :host .flex-start {
                @apply --layout-start;
            }
            :host .border-bottom {
                border-bottom: 1px solid #dbdbdb;
            }
            :host .op3 {
                opacity: 0.6;
                font-size: 14px;
            }
            :host .item-quantity {
                text-align: right;
                width:45px;
                padding: 5px 20px 5px 5px;
            }
            :host .item-price {
                text-align: right;
                padding:5px;
            }
            :host .item-item {
                padding:5px 0 5px 5px;
            }
            :host div[info] .close-info-icon {
                position: absolute;
                top: 5px;
                right: 0;
                padding: 0;
                color: #ffffff;
            }
            :host .small {
                font-size:12px;
                margin-right: 10px;
            }
            :host .cancel-subscription-action {
                color: var(--secondary-text-color);
                margin-top: 30px;
                font-size: 12px;
                font-weight: 400;
                text-decoration: underline;
            }

        </style>

        <iron-ajax id="billingCCRequest" url="[[ _creditCardApi ]]" handle-as="json" headers="[[ _headers ]]" auto="" on-response="_handleCCResponse"></iron-ajax>

        <iron-ajax id="billingSubscriptionRequest" url="[[ _subscriptionApi ]]" handle-as="json" headers="[[ _headers ]]" auto="" on-response="_handleSubscriptionResponse"></iron-ajax>

        <iron-ajax id="upcomingInvoiceCall" url="[[ _upcomingInvoiceApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleUpcomingInvoiceResponse"></iron-ajax>

        <iron-ajax id="invoiceListCall" url="[[ _invoiceListApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleInvoicesResponse"></iron-ajax>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    Payment Method
                </div>

                <div class="resource-content">
                    <template is="dom-if" if="[[ _isPaidByInvoice ]]">
                        <div class="payment-info">
                            <p>
                                Payment method: Invoice
                            </p>
                            <p>
                                Assigned licences: [[ _numberOfDistributedLicences ]]
                            </p>
                            <p>
                                Remaining licences: [[ _numberOfRemainingLicences ]]
                            </p>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ _isPaidByCC ]]">

                        <appsco-loader active="[[ _ccLoader ]]" loader-alt="Appsco is loading payment method" multi-color=""></appsco-loader>

                        <template is="dom-if" if="[[ _paymentMethod ]]">
                            <img class="credit-card-logo" src="[[ _computedCCLogo ]]" alt="[[ _cc.brand ]]">

                            <div class="mt20">
                                <p>
                                    Payment method: Credit Card
                                </p>
                                <p>
                                    Available licences: [[ _numberOfAvailableLicences ]]
                                </p>
                                <p>
                                    Remaining licences: [[ _numberOfRemainingLicences ]]
                                </p>
                                <p>
                                    [[ _cc.brand]] **** **** **** [[ _cc.last4 ]]
                                </p>
                                <p>
                                    Expires [[ _cc.exp_month ]]/[[ _cc.exp_year  ]]
                                </p>
                                <p>
                                    Cardholder: [[ _cc.name ]]
                                </p>
                            </div>
                        </template>

                        <template is="dom-if" if="[[ !_paymentMethod ]]">
                            No payment method has been created yet.
                            Please go and add new one.
                        </template>

                        <div class="resource-actions flex-horizontal">
                            <template is="dom-if" if="[[ !_paymentMethod ]]">
                                <paper-button class="button secondary-button flex" on-tap="_onManageCreditCard">
                                    Add payment method
                                </paper-button>
                            </template>

                            <template is="dom-if" if="[[ _paymentMethod ]]">
                                <paper-button class="button secondary-button flex" on-tap="_onManageCreditCard">
                                    Change payment method
                                </paper-button>
                            </template>
                        </div>

                    </template>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <template is="dom-if" if="[[ _subscriptionCanceled ]]">
                        <div class="subscription-info">
                            Current subscription is canceled. It will remain active until subscription period end.
                        </div>
                    </template>

                    <template is="dom-if" if="[[ _isPaidByCC ]]">
                        <template is="dom-if" if="[[ _paymentMethodInfo ]]">
                            <div class="subscription-info">
                                Please add payment method before you subscribe to one of AppsCo packages.
                            </div>
                        </template>
                    </template>

                    <div class="customer-billing-container">
                        <template is="dom-if" if="[[ _isPaidByInvoice ]]">
                            <paper-card heading="Upcoming invoice" class="upcoming-invoice">
                                <div class="card-content">
                                    <p class="message">
                                        Purchasing customer licences is done by invoice. If you require more licences please contact AppsCo Sales at sales@appsco.com.
                                    </p>

                                    <p class="message">
                                        Assigned licences: [[ _numberOfDistributedLicences ]]
                                    </p>

                                    <p class="message">
                                        Remaining licences: [[ _numberOfRemainingLicences ]]
                                    </p>
                                </div>
                            </paper-card>
                        </template>

                        <div class="plan-upcoming-invoice flex-horizontal flex-start">
                            <template is="dom-if" if="[[ _isPaidByCC ]]">
                                <template is="dom-if" if="[[ _cc.brand ]]">
                                    <paper-card heading="Subscription plan" class="subscription-plan">
                                        <appsco-loader active="[[ _subscriptionLoader ]]" loader-alt="Appsco is loading subscription model" multi-color=""></appsco-loader>
                                        <div class="card-content flex-vertical">
                                            <template is="dom-if" if="[[ _subscription.plan ]]">
                                                <div class="flex-horizontal">
                                                    <span class="subscription-plan-label">Started on:</span>
                                                    <appsco-date-format date="[[ _subscription.startedAt.date ]]"></appsco-date-format>
                                                </div>
                                                <div class="flex-horizontal">
                                                    <span class="subscription-plan-label">Activity period:</span>
                                                    <div>
                                                        <appsco-date-format date="[[ _subscription.currentPeriodStart.date ]]"></appsco-date-format> /
                                                        <appsco-date-format date="[[ _subscription.currentPeriodEnd.date ]]"></appsco-date-format>
                                                    </div>
                                                </div>
                                                <div class="flex-horizontal">
                                                    <span class="subscription-plan-label">Plan:</span>
                                                    <span>[[ _subscription.plan.display_text ]]</span>
                                                </div>
                                                <div class="flex-horizontal">
                                                    <span class="subscription-plan-label">Price:</span>
                                                    <appsco-price price="[[ _subscription.plan.amount ]]" currency="[[ _subscription.plan.currency ]]"></appsco-price>
                                                    <span class="per-user-label">&nbsp; per licence</span>
                                                </div>
                                                <div class="flex-horizontal">
                                                    <span class="subscription-plan-label">Customer Licences:</span>
                                                    <span>[[ _subscription.quantity ]]</span>
                                                </div>
                                                <div class="flex-horizontal">
                                                    <span class="subscription-plan-label">Status:</span>
                                                    <span>[[ _subscription.status ]]</span>
                                                </div>
                                            </template>

                                            <template is="dom-if" if="[[ !_subscription.plan ]]">
                                                <p class="message">Subscription plan hasn't been added yet. Please go and subscribe.</p>
                                            </template>
                                        </div>

                                        <div class="card-actions">
                                            <template is="dom-if" if="[[ _subscription.plan ]]">
                                                <paper-button on-tap="_onChangePlan" class="paper-card-action">Change Plan</paper-button>
                                            </template>

                                            <template is="dom-if" if="[[ !_subscription.plan ]]">
                                                <paper-button on-tap="_onChangePlan" class="paper-card-action">Subscribe</paper-button>
                                            </template>
                                        </div>

                                    </paper-card>
                                </template>


                                <template is="dom-if" if="[[ _subscription.plan ]]">
                                    <paper-card heading="Upcoming invoice" class="flex upcoming">
                                        <appsco-loader active="[[ _upcomingInvoiceLoader ]]" loader-alt="Appsco is loading subscription model" multi-color=""></appsco-loader>
                                        <div class="card-content flex-vertical">
                                            <div class="flex-horizontal">
                                                Your next automatic payment is scheduled for&nbsp;
                                                <appsco-date-format date="[[ _upcomingInvoice.date.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;}"></appsco-date-format>.
                                            </div>

                                            <div class="flex-horizontal">
                                                Total amount:&nbsp;
                                                <appsco-price price="[[ _upcomingInvoice.total ]]" currency="[[ _upcomingInvoice.currency ]]"></appsco-price>.
                                            </div>
                                            <div class="mt20 flex-horizontal">
                                                <iron-icon icon="icons:event" class="icon-20"></iron-icon>
                                                &nbsp;Last payment on&nbsp;
                                                <appsco-date-format date="[[ lastInvoice.date.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;}"></appsco-date-format>
                                                &nbsp;for&nbsp;
                                                <appsco-price price="[[ lastInvoice.total ]]" currency="[[ lastInvoice.currency ]]"></appsco-price>.
                                            </div>
                                        </div>
                                    </paper-card>
                                </template>
                            </template>
                        </div>
                    </div>

                    <template is="dom-if" if="[[ _subscription.plan ]]">
                        <div class="invoice-list flex-vertical">

                            <appsco-loader active="[[ _invoiceListLoader ]]" loader-alt="Appsco is loading invoices" multi-color=""></appsco-loader>

                            <h2 class="invoice-list-title">Invoice list</h2>

                            <template is="dom-if" if="[[ _invoicesExists ]]">
                                <template is="dom-repeat" items="[[ _invoices ]]">
                                    <appsco-billing-invoice id="invoiceItem_[[ index ]]" class="appsco-billing-invoice" invoice="[[ item ]]" on-tap="_onInvoiceAction"></appsco-billing-invoice>
                                </template>
                            </template>

                            <template is="dom-if" if="[[ !_invoicesExists ]]">
                                <p class="message">There are no invoices yet.</p>
                            </template>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ _cancelSubscription ]]">
                        <paper-button class="cancel-subscription-action" on-tap="_onCancelSubscription">Cancel subscription</paper-button>
                    </template>
                </div>
            </div>

            <div info="" class="flex-vertical" slot="info">
                <div class="info-header">
                    <appsco-brand logo="/images/appsco-logo-white.png" logo-width="118" logo-height="38">
                    </appsco-brand>

                    <paper-icon-button icon="icons:close" class="close-info-icon" on-tap="_onCloseInfoAction"></paper-icon-button>
                </div>

                <appsco-date-format class="small" date="[[ _selectedInvoice.date.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>

                <div class="info-content-container">
                    <div class="info-content">
                        <div class="flex-horizontal">
                            <span class="item-quantity small op3 border-bottom">Quantity</span>
                            <span class="item-item flex op3 border-bottom">Item</span>
                            <span class="item-price op3 border-bottom">Price</span>
                        </div>

                        <template is="dom-repeat" items="{{ _selectedInvoice.items }}">
                            <div class="flex-horizontal">
                                <span class="item-quantity border-bottom font12">[[ item.quantity ]]</span>
                                <span class="flex item-item border-bottom font12">AppsCo Licences</span>
                            <span class="item-price border-bottom font12">
                                <appsco-price price="[[ item.amount ]]" currency="[[ item.currency ]]"></appsco-price>
                            </span>
                            </div>
                        </template>

                        <div class="flex-horizontal">
                            <span class="item-quantity font12">&nbsp;</span>
                            <span class="flex item-item font12">Tax</span>
                            <span class="item-price font12">[[ _selectedInvoice.tax ]]</span>
                        </div>
                        <div class="flex-horizontal">
                            <span class="item-quantity font12  border-bottom">&nbsp;</span>
                            <span class="flex item-item font12  border-bottom">Tax Percent</span>
                            <span class="item-price font12  border-bottom">[[ _selectedInvoice.tax_percent ]]</span>
                        </div>
                        <div class="flex-horizontal">
                            <span class="item-quantity font12">&nbsp;</span>
                            <span class="flex item-item font12"><strong>Total</strong></span>
                        <span class="item-price font12"><strong>
                            <appsco-price price="[[ _selectedInvoice.total ]]" currency="[[ _selectedInvoice.currency ]]"></appsco-price>
                        </strong></span>
                        </div>

                        <div class="flex-vertical mt20">
                            <span class="font12">Invoice ID</span>
                            <span class="font12">[[ _selectedInvoice.id ]]</span>
                        </div>

                        <div class="flex-vertical mt10">
                            <span class="font12">Purchased from</span>
                            <span class="font12">AppsCo Inc.</span>
                            <span class="font12">911 Washington Avenue</span>
                            <span class="font12">Suite 848</span>
                            <span class="font12">St. Louis, MO 63101</span>
                            <span class="font12">United States</span>
                        </div>
                    </div>
                </div>

                <div class="info-actions flex-horizontal">
                    <paper-button class="send-invoice-button flex" on-tap="_onSendInvoice">
                        Send invoice
                    </paper-button>
                </div>
            </div>

        </appsco-content>

        <appsco-credit-card id="appscoCreditCard" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]">
        </appsco-credit-card>

        <appsco-update-subscription-action id="appscoUpdateSubscriptionAction" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]" on-subscription-updated="_onSubscriptionUpdated">
        </appsco-update-subscription-action>

        <appsco-subscription-cancel id="appscoSubscriptionCancel" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]" on-subscription-canceled="_onSubscriptionCanceled">
        </appsco-subscription-cancel>

        <appsco-billing-send-invoice id="appscoBillingSendInvoice" company="[[ currentCompany ]]" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]" on-invoice-sent="_onInvoiceSent">
        </appsco-billing-send-invoice>
`;
    }

    static get is() { return 'appsco-customer-billing-page'; }

    static get properties() {
        return {
            companyApi: {
                type: String
            },

            currentCompany: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _subscription: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onSubscriptionChanged'
            },

            _invoices: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _selectedInvoice: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _selectedIndex: {
                type: Number,
                value: -1
            },

            _creditCardApi: {
                type: String,
                computed: '_computeCreditCardApi(companyApi)',
                observer: '_showCCLoader'
            },

            _subscriptionApi: {
                type: String,
                computed: '_computeSubscriptionApi(companyApi)',
                observer: '_showSubscriptionLoader'
            },

            _upcomingInvoiceApi: {
                type: String,
                computed: '_computeUpcomingInvoiceApi(companyApi, _subscription)',
                observer: '_showUpcomingInvoiceLoader'
            },

            _invoiceListApi: {
                type: String,
                computed: '_computeInvoiceListApi(companyApi, _subscription)',
                observer: '_showInvoiceListLoader'
            },

            _cc: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _ccLoader: {
                type: Boolean,
                value: true
            },

            _subscriptionLoader: {
                type: Boolean,
                value: true
            },

            _upcomingInvoiceLoader: {
                type: Boolean,
                value: true
            },

            _invoiceListLoader: {
                type: Boolean,
                value: true
            },

            _paymentMethod: {
                type: Boolean,
                computed: '_computePaymentMethod(_cc)'
            },

            _paymentMethodInfo: {
                type: Boolean,
                value: false
            },

            _computedCCLogo: {
                type: String,
                computed: '_computeCCLogo(_cc)'
            },

            _isPaidByInvoice: {
                type: Boolean,
                computed: '_computeIsPaidByInvoice(currentCompany)'
            },

            _isPaidByCC: {
                type: Boolean,
                computed: '_computeIsPaidByCC(currentCompany)'
            },

            _numberOfDistributedLicences: {
                type: String,
                computed: '_computeNumberOfDistributedLicences(currentCompany)'
            },

            _numberOfAvailableLicences: {
                type: String,
                computed: '_computeNumberOfAvailableLicences(_subscription)'
            },

            _numberOfRemainingLicences: {
                type: String,
                computed: '_computeNumberOfRemainingLicences(currentCompany)'
            },

            _invoicesExists: {
                type: Boolean,
                value: false
            },

            _subscriptionCanceled: {
                type: Boolean,
                computed: '_computeSubscriptionCanceled(_subscription)',
                observer: '_toggleCancelSubscriptionAction'
            },

            _cancelSubscription: {
                type: Boolean,
                value: false
            },

            lastInvoice: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            mediumScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mediumScreen, tabletScreen, mobileScreen)'
        ];
    }

    ready() {
        super.ready();

        this.pageLoaded = false;
        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };

        beforeNextRender(this, function() {
            if (this.mobileScreen || this.tabletScreen || this.mediumScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._pageLoaded();
        });
    }

    pageSelected() {
        this.$.billingCCRequest.generateRequest();
        this.reloadSubscription();
    }

    resetPage() {
        this.set('_subscription', {});
        this.set('_cc', {});
        this.set('_upcomingInvoice', {});
        this.set('_selectedInvoice', {});
        this.set('_invoices', []);
        this._paymentMethodInfo = false;
        this._numberOfAvailableLicences = '0';
        this._numberOfDistributedLicences = '0';
        this._numberOfRemainingLicences = '0';
        this._cancelSubscription = false;
        this._onCloseInfoAction();
    }

    setCreditCard(cc) {
        this._paymentMethodInfo = false;
        this._ccLoader = true;
        this.set('_cc', cc);

        setTimeout(function() {
            this._ccLoader = false;
        }.bind(this), 1000);
    }

    reloadSubscription() {
        this._subscriptionLoader = true;
        this.$.billingSubscriptionRequest.generateRequest();
    }

    _onSubscriptionChanged(subscription) {
        for (const key in subscription) {
            this._loadUpcomingInvoice();
            this._loadInvoiceList();
            return false;
        }
    }

    _toggleCancelSubscriptionAction() {
        if (this._subscription.status && !this._subscriptionCanceled) {
            setTimeout(function() {
                this._cancelSubscription = true;
            }.bind(this), 1000);
        }
        else {
            this._cancelSubscription = false;
        }
    }

    _loadUpcomingInvoice() {
        this._upcomingInvoiceLoader = true;
        this.$.upcomingInvoiceCall.generateRequest();
    }

    _loadInvoiceList() {
        this._invoicesExists = false;
        this._invoiceListLoader = true;
        this.$.invoiceListCall.generateRequest();
    }

    _updateScreen(medium, tablet, mobile) {
        this.updateStyles();

        if (mobile) {
            this.$.appscoContent.hideSection('resource');
        }
        else if(!this.$.appscoContent.resourceActive) {
            this.$.appscoContent.showSection('resource');
        }
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _showSubscriptionLoader() {
        this._subscriptionLoader = true;
    }

    _showCCLoader() {
        this._ccLoader = true;
    }

    _showUpcomingInvoiceLoader() {
        this._upcomingInvoiceLoader = true;
    }

    _showInvoiceListLoader() {
        this._invoiceListLoader = true;
    }

    _onManageCreditCard() {
        this.shadowRoot.getElementById('appscoCreditCard').toggle();
    }

    _onChangePlan() {
        const dialog = this.shadowRoot.getElementById('appscoUpdateSubscriptionAction');
        dialog.setSubscription(this._subscription);
        dialog.toggle();
    }

    _computeIsPaidByInvoice(currentCompany) {
        return currentCompany && currentCompany.payingForCustomerType === 'invoice';
    }

    _computeIsPaidByCC(currentCompany) {
        return currentCompany && (currentCompany.payingForCustomerType === 'cc' || !currentCompany.payingForCustomerType);
    }

    _computeNumberOfDistributedLicences(currentCompany) {
        return currentCompany && currentCompany.distributedLicences ? currentCompany.distributedLicences : '0';
    }

    _computeNumberOfAvailableLicences(subscription) {
        return subscription && subscription.quantity ? subscription.quantity : '0';
    }

    _computeNumberOfRemainingLicences(currentCompany) {
        return currentCompany && currentCompany.remainingLicences ? currentCompany.remainingLicences : '0';
    }

    _computePaymentMethod(cc) {
        for (let key in cc) {
            return true;
        }
        return false;
    }

    _computeCCLogo(cc) {
        let logoUrl = '/images/cc/';

        if (cc.brand) {
            if (cc.brand === 'American Express') {
                logoUrl += 'amex.png';
            }
            else {
                logoUrl += cc.brand.toLowerCase().replace(' ', '_') + '.png';
            }
        }
        else {
            logoUrl += 'unknown.png';
        }

        return logoUrl;
    }

    _computeCreditCardApi(companyApi) {
        return companyApi ? companyApi + '/billing/cc' : null;
    }

    _computeSubscriptionApi(companyApi) {
        return companyApi ? companyApi + '/billing/subscriptions' : null;
    }

    _computeUpcomingInvoiceApi(companyApi, subscription) {
        return companyApi && subscription && subscription.id ? companyApi + '/billing/invoice/upcoming/' + subscription.id : null;
    }

    _computeInvoiceListApi(companyApi, subscription) {
        return companyApi && subscription && subscription.id ? companyApi + '/billing/invoice/list/' + subscription.id : null;
    }

    _computeSubscriptionCanceled(subscription) {
        return subscription.status === 'canceled';
    }

    _handleCCResponse(event) {
        const response = event.detail.response;
        this.set('_cc', {});

        if (null == response || 0 === response.length) {
            this._paymentMethodInfo = true;
            this._ccLoader = false;
            return false;
        }

        this.set('_cc', response);
        this._paymentMethodInfo = false;
        this._ccLoader = false;
    }

    _handleSubscriptionResponse(e) {
        if(null == e.detail.response) {
            return;
        }

        const subscriptions = e.detail.response;
        let activeSubscription = '';

        subscriptions.forEach(function(element) {
            if (element.type === 'distribution' && element.status === 'active') {
                this._subscription = activeSubscription = element;
            }
        }.bind(this));

        if (!activeSubscription) {
            this._subscription = {};
            this._cancelSubscription = false;
        }

        this._subscriptionLoader = false;
    }

    _handleUpcomingInvoiceResponse(e) {
        if (null == e.detail.response) {
            return;
        }

        this._upcomingInvoice = e.detail.response;
        this._upcomingInvoiceLoader = false;
    }

    _handleInvoicesResponse(event) {
        const response = event.detail.response;

        this.set('_invoices', []);

        if (null == response) {
            this._invoiceListLoader = false;
            return false;
        }

        if (response.length > 0) {
            this._invoicesExists = true;

            response.forEach(function(el, index) {
                if (0 === index) {
                    this.lastInvoice = el;
                }

                setTimeout(function() {
                    this.push('_invoices', el);

                    if (index === response.length - 1) {
                        this._invoiceListLoader = false;
                        this._toggleCancelSubscriptionAction();
                    }

                }.bind(this), (index + 1) * 30);
            }.bind(this));
        }
        else {
            this._invoiceListLoader = false;
            this._toggleCancelSubscriptionAction();
        }
    }

    _onInvoiceAction(event) {
        const selectedInvoice = event.model.item;

        if (selectedInvoice.id != this._selectedInvoice.id) {
            this._selectedInvoice = selectedInvoice;

            if (this._selectedIndex !== -1) {
                this.shadowRoot.getElementById('invoiceItem_' + this._selectedIndex).deselect();
            }

            this._selectedIndex = event.model.index;

            this.shadowRoot.getElementById('invoiceItem_' + this._selectedIndex).select();

            if (!this._infoShown) {
                this._showInfo();
            }
        }
        else {
            this._onCloseInfoAction();
        }
    }

    _deselectInvoice() {
        this._hideInfo();
        this.set('_selectedInvoice', {});

        if (this.shadowRoot.getElementById('invoiceItem_' + this._selectedIndex)) {
            this.shadowRoot.getElementById('invoiceItem_' + this._selectedIndex).deselect();
        }

        this._selectedIndex = -1;
    }

    _onCloseInfoAction() {
        this._hideInfo();
        this._deselectInvoice();
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
        this._infoShown = true;
    }

    _hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    _onCancelSubscription() {
        const dialog = this.shadowRoot.getElementById('appscoSubscriptionCancel');
        dialog.setSubscription(this._subscription);
        dialog.toggle();
    }

    _onSendInvoice() {
        const dialog = this.shadowRoot.getElementById('appscoBillingSendInvoice');
        dialog.setInvoice(this._selectedInvoice);
        dialog.setSubscription(this._subscription);
        dialog.toggle();
    }

    _onInvoiceSent(event) {
        this._notify('Invoice has been sent to ' + event.detail.sentTo + '.');
    }
}
window.customElements.define(AppscoCustomerBillingPage.is, AppscoCustomerBillingPage);
