import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/application/appsco-application-settings-card.js';
import '../components/application/company/appsco-application-assignees.js';
import '../components/application/company/appsco-resource-admins.js';
import '../components/application/appsco-application-log.js';
import '../components/application/appsco-application-analytics-security.js';
import '../components/application/appsco-application-details-idp.js';
import '../components/application/appsco-application-groups.js';
import '../components/application/appsco-application-autologin.js';
import '../components/page/appsco-layout-with-cards-styles.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageApplicationComponentsPage extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-layout-with-cards-styles">
            :host {
                --application-details-value: {
                        font-size: 14px;
                 };
                 
                 --paper-card-content: {
                    padding-top: 16px;
                    padding-bottom: 16px;
                 }
            }
            :host .info-item {
                margin-bottom: 10px;
            }
            :host .info-item:last-of-type {
                margin-bottom: 0;
            }
            :host .info-lead {
                font-size: 14px;
                @apply --text-wrap-break;
            }
            :host .info-additional {
                font-size: 12px;
                color: var(--secondary-text-color);
            }
            appsco-application-details-idp {
                --appsco-application-icons-color: var(--app-secondary-color);

                --application-details-label: {
                     font-size: 12px;
                     line-height: 16px;
                 };
                --application-details-value: {
                     font-size: 14px;
                     line-height: 22px;
                 };
            }
            .appsco-application-log {
                --paper-card-content: {
                     min-height: 70px;
                     padding-top: 0;
                     padding-bottom: 0;
                 };
            }
            appsco-application-log {
                --application-log-progress: {
                     top: 4px;
                 };
                --application-log-item: {
                     padding: 16px 6px 6px 6px;
                 };
                --application-log-item-first: {
                     border-top: none;
                 };
                --appsco-list-item-date: {
                     top: 2px;
                 };
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <iron-ajax auto="" url="[[ companyIdpSamlMetadataApi ]]" headers="[[ _headers ]]" on-response="_onCompanyIdpSamlMetadataReponse"></iron-ajax>

        <div class="cols-layout two-cols-layout">
            <div class="col">
                <paper-card heading="Settings" class="appsco-application-settings-card">
                    <div class="card-content">
                        <appsco-application-settings-card company="" application="{{ application }}">
                        </appsco-application-settings-card>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageApplicationSettings">Manage</paper-button>
                    </div>
                </paper-card>

                <template is="dom-if" if="[[ !resourceAdmin ]]" restamp="">
                    <paper-card heading="Assignees" class="appsco-application-assignees">
                        <div class="card-content">
                            <appsco-application-assignees id="appscoApplicationAssignees" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" size="5" preview="" auto-load=""></appsco-application-assignees>
                        </div>

                        <div class="card-actions">
                            <paper-button on-tap="_onAllAssignees">ALL</paper-button>
                        </div>
                    </paper-card>

                    <paper-card heading="Resource Log" class="appsco-application-log">
                        <div class="card-content">
                            <appsco-application-log id="appscoApplicationLog" size="5" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" company=""></appsco-application-log>
                        </div>

                        <div class="card-actions">
                            <paper-button on-tap="_onAllLog">ALL</paper-button>
                        </div>
                    </paper-card>

                    <template is="dom-if" if="[[ _viewSecurityPermission ]]" restamp="">
                        <div class="security-sharing">
                            <paper-card heading="Security" class="appsco-application-security">
                                <div class="card-content">
                                    <appsco-application-analytics-security application="[[ application ]]" info=""></appsco-application-analytics-security>
                                </div>
                            </paper-card>
                        </div>
                    </template>
                </template>

            </div>

            <template is="dom-if" if="[[ !resourceAdmin ]]" restamp="">
                <div class="col">
                    <template is="dom-if" if="[[ _isSAMLApp ]]" restamp="">
                        <div class="details-idp">
                            <paper-card heading="Appsco IdP information" class="appsco-application-idp-info">
                                <div class="card-content">
                                    <appsco-application-details-idp idp-metadata-xml-url="[[ companyIdpSamlMetadataXmlUrl ]]" idp-metadata="[[ _idpMetadata ]]">
                                    </appsco-application-details-idp>
                                </div>
                            </paper-card>
                        </div>
                    </template>

                    <paper-card heading="Groups" class="appsco-application-groups">
                        <div class="card-content">
                            <appsco-application-groups id="appscoApplicationGroups" authorization-token="[[ authorizationToken ]]" groups-api="[[ groupsApi ]]" application="[[ application ]]" size="5" preview=""></appsco-application-groups>
                            </div>

                        <div class="card-actions">
                            <paper-button on-tap="_onManageGroups">Manage</paper-button>
                        </div>
                    </paper-card>

                    <template is="dom-if" if="[[ _isUnPwAuthType ]]">
                        <div class="security-autologin">
                            <paper-card heading="Autologin" class="appsco-application-autologin">
                                <div class="card-content">
                                    <appsco-application-autologin application="[[ application ]]" authorization-token="[[ authorizationToken ]]" on-autologin-unavailable="_onAutologinUnavailable" on-autologin-changed="_onAutologinChanged"></appsco-application-autologin>

                                    <template is="dom-if" if="[[ _autologinUnavailable ]]">
                                        <p>Auto Login sign on method for this resource is unavailable.</p>
                                    </template>

                                    <template is="dom-if" if="[[ !_autologinUnavailable ]]">

                                        <template is="dom-if" if="[[ _autologinItem ]]">
                                            <p>Turn on Auto Login to automate sign-in process.</p>
                                        </template>

                                        <template is="dom-if" if="[[ !_autologinItem ]]">
                                            <p>Turn off Auto Login if you prefer to choose login account manually after resource opens in browser.</p>
                                        </template>

                                    </template>
                                </div>
                            </paper-card>
                        </div>
                    </template>

                    <paper-card heading="Compliance info" class="appsco-compliance-info">
                        <div class="card-content">
                            <p>Register user information which this application stores. Information can be used for
                                reporting purposes or provided to external systems, in order to accomplish transparency on personal data usage.</p>
                        </div>

                        <div class="card-actions">
                            <paper-button on-tap="_onManageCompliance">Manage</paper-button>
                        </div>
                    </paper-card>

                    <template is="dom-if" if="[[ _shouldShowAdvanced ]]">
                        <paper-card heading="Resource admins" class="appsco-resource-admin">
                            <div class="card-content">
                                <p>Assign users that which will have rights to manage given resource.</p>
                                <appsco-resource-admins id="appscoResourceAdmins" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" size="5" preview="" auto-load=""></appsco-resource-admins>
                            </div>

                            <div class="card-actions">
                                <paper-button on-tap="_onResourceAdmins">Manage</paper-button>
                            </div>
                        </paper-card>
                    </template>
                </div>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-manage-application-components-page'; }

    static get properties() {
        return {
            col2: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * Indicates if it is medium screen size.
             * It uses iron-media-query.
             */
            mediumScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            resourceAdmin: {
                type: Boolean,
                value: false
            },

            groupsApi: {
                type: String
            },

            application: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true,
                observer: '_onApplicationChanged'
            },

            companyIdpSamlMetadataApi: {
                type: String
            },

            _isSAMLApp: {
                type: Boolean,
                computed: '_computeIsSAMLApp(application)'
            },

            _isOpenIDApp: {
                type: Boolean,
                computed: '_computeIsOpenIDApp(application)'
            },

            _isUnPwAuthType: {
                type: Boolean,
                computed: '_computeIsUnPwAuthType(application)'
            },

            _viewSecurityPermission: {
                type: Boolean,
                computed: '_computeViewSecurityPermission(application)'
            },

            _autologinItem: {
                type: Boolean,
                value: false
            },

            _autologinUnavailable: {
                type: Boolean,
                value: false
            },

            _shouldShowAdvanced: {
                type: Boolean,
                value: false
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready(){
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: dom(this.root).querySelectorAll('paper-card'),
                nodeDelay: 50,
                timing: {
                    delay: 200,
                    duration: 100
                }
            },
            'exit': [{
                name: 'hero-animation',
                id: 'hero',
                fromPage: this
            }, {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 500
                }
            }]
        };
    }

    load() {
        this._loadGroups();
    }

    reloadAssignees() {
        this.shadowRoot.getElementById('appscoApplicationAssignees').reload();
    }

    removeAssignee(assignee) {
        this.shadowRoot.getElementById('appscoApplicationAssignees').removeAssignee(assignee);
    }

    _onApplicationChanged() {
        this._autologinUnavailable = false;
        this._autologinItem = this.application.auth_type == 'item';
    }

    _loadGroups() {

        if (this.shadowRoot.getElementById('appscoApplicationGroups') && this.shadowRoot.getElementById('appscoApplicationGroups').$) {
            this.shadowRoot.getElementById('appscoApplicationGroups').loadGroups();
        }
    }

    /**
     * Computes isSAMLApp value
     *
     * @param {Object} application
     * @returns {boolean}
     * @private
     */
    _computeIsSAMLApp(application) {
        return ['saml', 'saml_dropbox', 'saml_office_365'].indexOf(application.auth_type) !== -1;
    }

    _computeIsOpenIDApp(application) {
        return application.auth_type === 'open_id';
    }

    _computeIsUnPwAuthType (application) {
        var isUnpw =
            application.auth_type &&
            (application.auth_type === 'unpw' || application.auth_type === 'item')
        ;
        this.col2 = !isUnpw;
        return isUnpw;
    }

    _computeViewSecurityPermission(application) {
        return ['unpw', 'item'].indexOf(application.auth_type) !== -1;
    }

    _setSharedElement(target) {

        while (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
            target = target.parentNode;
        }

        /**
         * Set hero animation element that is to be shared between pages.
         *
         * @type {{hero: *}}
         */
        this.sharedElements = {
            'hero': target
        };
    }

    _onManageApplicationSettings(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('application-settings', { bubbles: true, composed: true }));
    }

    _onAllAssignees(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('all-assignees', { bubbles: true, composed: true }));
    }

    _onAllLog(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('all-log', { bubbles: true, composed: true }));
    }

    _onCompanyIdpSamlMetadataReponse(event) {
        this._idpMetadata = event.detail.response;
    }

    _onManageGroups(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-groups', { bubbles: true, composed: true }));
    }

    _onManageCompliance(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-compliance', { bubbles: true, composed: true }));
    }

    _onResourceAdmins(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-resource-admins', { bubbles: true, composed: true }));
    }

    _onAutologinUnavailable() {
        this._autologinUnavailable = true;
    }

    _onAutologinChanged() {
        this._autologinItem = !this._autologinItem;
        this.shadowRoot.getElementById('appscoApplicationLog').load();
    }

    showAdvanced() {
        this._shouldShowAdvanced = true;
    }

    hideAdvanced() {
        this._shouldShowAdvanced = false;
    }
}
window.customElements.define(AppscoManageApplicationComponentsPage.is, AppscoManageApplicationComponentsPage);
