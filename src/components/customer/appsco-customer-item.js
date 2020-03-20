import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../account/appsco-account-image.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomerItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles"></style>

        <style>
            :host .customer-icon-container {
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 26px;
                background-color: var(--customer-icon-background-color, var(--account-initials-background-color));
                position: relative;
            }
            :host .customer-icon {
                width: 24px;
                height: 24px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;

                --iron-icon-fill-color: var(--primary-text-color, #ffffff);
            }
            :host([mobile-screen]) .item-additional-info {
                display: none;
            }
            :host .item-info {
                padding: 0 10px;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <iron-ajax id="getPartnerAdminsApiRequest" url="[[ _partnerAdminsApiUrl ]]" headers="[[ _headers ]]" auto="" on-error="_onPartnerAdminsError" on-response="_onPartnerAdminsResponse"></iron-ajax>

        <iron-ajax id="getLicencesApiRequest" url="[[ _licencesApiUrl ]]" headers="[[ _headers ]]" auto="" on-error="_onLicencesError" on-response="_onLicencesResponse"></iron-ajax>

        <div class="item">

            <template is="dom-if" if="[[ selectable ]]">
                <div class="select-action" on-tap="_onSelectItemAction">

                    <div class="customer-icon-container">
                        <iron-icon class="customer-icon" icon="icons:social:domain"></iron-icon>
                    </div>

                    <div class="icon-action">
                        <div class="iron-action-inner">
                            <iron-icon icon="icons:check"></iron-icon>
                        </div>
                    </div>
                </div>
            </template>

            <template is="dom-if" if="[[ !selectable ]]">
                <div class="customer-icon-container">
                    <iron-icon class="customer-icon" icon="icons:social:domain"></iron-icon>
                </div>
            </template>

            <div class="item-info item-basic-info">
                <span class="info-label group-title">[[ item.name ]]</span>
                <span class="info-value">[[ item.contact_email ]]</span>
            </div>

            <div class="item-info item-additional-info">
                <div class="info">
                    <span class="info-label">Partner admins:&nbsp;</span>
                    <span class="info-value">[[ _partnerAdminsCount ]]</span>
                </div>
                <div class="info">
                    <span class="info-label">Licences:&nbsp;</span>
                    <span class="info-value">[[ _licencesCount ]]</span>
                </div>
                <div class="info">
                    <span class="info-label">Status:&nbsp;</span>
                    <template is="dom-if" if="[[ !item.trial_period ]]">
                        <span class="info-value">active</span>
                    </template>

                    <template is="dom-if" if="[[ item.trial_period ]]">
                        <span class="info-value">trial</span>
                    </template>
                </div>
            </div>

            <div class="actions">
                <paper-button on-tap="_onEditItemAction">Edit</paper-button>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-customer-item'; }

    static get properties() {
        return {
            listApi: {
                type: String
            },

            _partnerAdminsApiUrl: {
                type: String,
                computed: '_computePartnerAdminsApiUrl(item, listApi)'
            },

            _licencesApiUrl: {
                type: String,
                computed: '_computeLicencesApiUrl(item, listApi)'
            },

            _partnerAdminsCount: {
                type: Number,
                value: 0
            },

            _partnerAdminsLoaded: {
                type: Boolean,
                value: false
            },

            _licencesCount: {
                type: Number,
                value: 0
            },

            _licencesLoaded: {
                type: Boolean,
                value: false
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    static get observers() {
        return [
            '_listenForItemInfoLoad(_partnerAdminsLoaded, _licencesLoaded)'
        ];
    }

    ready() {
        super.ready();

        if (!this.item.partner) {
            this.item.partner = this.listApi;
        }

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('tap', this._onItemAction);
    }

    reloadInfo() {
        this.$.getPartnerAdminsApiRequest.generateRequest();
        this.$.getLicencesApiRequest.generateRequest();
    }

    _computePartnerAdminsApiUrl(customer, listApi) {
        return (customer.partner && listApi && customer.partner !== listApi) ?
            customer.partner :
            (customer.alias && listApi) ?
                (listApi + '/' + customer.alias + '/partner-admins') :
                null;
    }

    _computeLicencesApiUrl(customer, listApi) {
        return (customer.partner && listApi && customer.partner !== listApi) ?
            customer.partner :
            (customer.alias && listApi) ?
                (listApi + '/' + customer.alias + '/licences') :
                null;
    }

    _onPartnerAdminsError() {
        this._partnerAdminsCount = 0;
        this._partnerAdminsLoaded = true;
    }

    _onPartnerAdminsResponse(event) {
        var response = event.detail.response;

        this._partnerAdminsCount = (response && response.meta) ? response.meta.total : 0;
        this._partnerAdminsLoaded = true;
    }

    _onLicencesError() {
        this._licencesCount = 0;
        this._licencesLoaded = true;
    }

    _onLicencesResponse(event) {
        const response = event.detail.response;

        this._licencesCount = (response && response.appscoLicences) ? response.appscoLicences : 0;
        this._licencesLoaded = true;
    }

    _listenForItemInfoLoad(partnerAdminsLoaded, licencesLoaded) {
        if (this.noAutoDisplay && partnerAdminsLoaded && licencesLoaded) {
            this._showItem();
        }
    }
}
window.customElements.define(AppscoCustomerItem.is, AppscoCustomerItem);
