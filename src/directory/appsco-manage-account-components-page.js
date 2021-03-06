import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-styles/shadow.js';
import '../components/account/appsco-account-details.js';
import '../components/account/appsco-account-notifications.js';
import '../components/account/appsco-account-log.js';
import '../components/account/company/appsco-account-roles.js';
import '../components/account/company/appsco-account-groups.js';
import '../components/account/company/appsco-account-devices.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './appsco-directory-role-applications.js';
import '../components/page/appsco-layout-with-cards-styles.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageAccountComponentsPage extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-layout-with-cards-styles">
            :host {
                --account-details-value: {
                     font-size: 14px;
                 };

                --iron-icon-height: 20px;
                --iron-icon-width: 20px;
                --iron-icon: {
                     margin-top: -3px;
                 };
                 
                --paper-card-content: {
                    padding-top: 16px;
                    padding-bottom: 16px;
                }
            }
            appsco-account-details {
                --account-detail-container: {
                     margin: 4px 0;
                 };

                --account-details-label: {
                     font-size: 12px;
                     line-height: 16px;
                 };
                --account-details-value: {
                     font-size: 14px;
                     line-height: 22px;
                 };
            }
            .icon-enabled {
                --iron-icon-fill-color: var(--icon-success-color, #0f9d58);
            }
            .icon-disabled {
                --iron-icon-fill-color: var(--icon-danger-color, #db4437);
            }
            .appsco-account-notifications, .appsco-account-log {
                --paper-card-content: {
                     min-height: 70px;
                     padding-top: 0;
                     padding-bottom: 0;
                     box-sizing: border-box;
                 };
            }
            appsco-account-notifications {
                --appsco-account-notifications-container: {
                     padding-top: 4px;
                 };
                --appsco-account-notifications-paper-progress: {
                     top: 4px;
                 };
                --account-notifications-appsco-list-item: {
                     padding: 16px 6px 6px 6px;
                 };
                --account-notifications-appsco-list-item-first: {
                     border-top: none;
                 };
                --appsco-list-item-date: {
                     top: 2px;
                 };
            }
            appsco-account-log {
                --appsco-account-log-container: {
                     padding-top: 4px;
                 };
                --appsco-list-progress-bar: {
                     top: 4px;
                 };
                --appsco-account-log-item: {
                     padding: 16px 6px 8px 6px;
                 };
                --appsco-account-log-item-first: {
                     border-top: none;
                 };
                --log-item-date: {
                     top: 2px;
                 };
            }
            :host .info-item {
                margin-bottom: 10px;
            }
            :host .info-item:last-of-type {
                margin-bottom: 0;
            }
            :host .info-lead {
                font-size: 14px;
            }
            :host .info-additional {
                font-size: 12px;
                color: var(--secondary-text-color);
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <iron-ajax auto="" id="twofaapi" url="[[ twoFaApi ]]" on-response="_on2FAResponse" headers="{{ _headers }}">
        </iron-ajax>

        <div class="cols-layout three-cols-layout">
            <div class="col">
                <paper-card heading="Settings" class="appsco-account-details">
                    <div class="card-content">
                        <appsco-account-details account="{{ role.account }}">
                        </appsco-account-details>
                    </div>

                    <div class="card-actions">
                        <paper-button disabled\$="[[ !canManage ]]" on-tap="_onAccountManageSettings">Manage</paper-button>
                    </div>
                </paper-card>

                <paper-card heading="Two Factor Authentication" class="appsco-account-2fa">
                    <div class="card-content">
                        <div class="status-2fa">
                            <template is="dom-if" if="[[ _twoFAEnabled ]]">
                                <iron-icon icon="check" class="icon-enabled"></iron-icon> Two factor authentication for this user is enabled.
                            </template>

                            <template is="dom-if" if="[[ !_twoFAEnabled ]]">
                                <iron-icon icon="clear" class="icon-disabled"></iron-icon> Two factor authentication for this user is disabled.
                            </template>
                        </div>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageTwoFA" disabled\$="[[ !canManage ]]">Manage</paper-button>
                    </div>
                </paper-card>

                <paper-card heading="Organization Units" class="appsco-account-orgunits">
                    <div class="card-content">
                        <template is="dom-repeat" items="[[ role.account.org_units ]]" rendered-item-count="{{ renderedCount }}">
                            <div class="info-item">
                                <div class="info-lead">[[ _formatOrgUnitName(item.name) ]]</div>
                                <div class="info-additional">[[ item.description ]]</div>
                            </div>
                        </template>

                        <template is="dom-if" if="{{ !renderedCount }}">
                            <p>Account doesn't belong to any organization unit.</p>
                        </template>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageOrgunits">Manage</paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">
                <template is="dom-if" if="[[ _managedUser ]]">
                    <paper-card heading="Notifications" class="appsco-account-notifications">
                        <div class="card-content">
                                <appsco-account-notifications id="appscoAccountNotifications" authorization-token="[[ authorizationToken ]]" notifications-api="[[ notificationsApi ]]" on-notifications-attached="_loadNotifications" on-notifications-load="_onNotificationsLoad">
                                        size="5"&gt;
                                </appsco-account-notifications>
                        </div>

                        <div class="card-actions">
                            <paper-button on-tap="_onAccountNotifications">ALL</paper-button>
                        </div>
                    </paper-card>
                </template>

                <template is="dom-if" if="[[ _changeCompanyRolePermission ]]">
                    <paper-card heading="Company roles" class="appsco-account-roles">
                        <div class="card-content">
                            <appsco-account-roles id="appscoAccountRoles" account="[[ role ]]" authorization-token="[[ authorizationToken ]]">
                            </appsco-account-roles>
                        </div>
                    </paper-card>
                </template>

                <paper-card heading="Shared resources" class="appsco-application-assignees">
                    <div class="card-content">
                        <appsco-directory-role-applications id="roleApplications" company-role="[[ role ]]" authorization-token="[[ authorizationToken ]]" size="5" preview=""></appsco-directory-role-applications>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onAllApplications">ALL</paper-button>
                    </div>
                </paper-card>

                <paper-card heading="Groups" class="appsco-account-groups">
                    <div class="card-content">
                        <appsco-account-groups id="appscoAccountGroup" authorization-token="[[ authorizationToken ]]" groups-api="[[ groupsApi ]]" account="[[ role ]]" size="5" preview=""></appsco-account-groups>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageGroups">Manage</paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">
                <paper-card heading="Activity log" class="appsco-account-log">
                    <div class="card-content">
                        <appsco-account-log id="appscoAccountLog" authorization-token="[[ authorizationToken ]]" log-api="[[ logApi ]]" size="5" short-view="">
                        </appsco-account-log>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onAccountLog">ALL</paper-button>
                    </div>
                </paper-card>

                <paper-card heading="Devices activity" class="appsco-account-device">

                    <template is="dom-if" if="[[ _managedUser ]]">
                        <div class="card-content">
                            <appsco-account-devices id="appscoAccountDevice" authorization-token="[[ authorizationToken ]]" devices-api="[[ devicesApi ]]" account="[[ role ]]" size="5" preview="" on-component-attached="_loadDevices"></appsco-account-devices>
                        </div>

                        <div class="card-actions">
                            <paper-button on-tap="_onManageDevices">Manage</paper-button>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ !_managedUser ]]">
                        <div class="card-content">
                            <p>
                                Domain for this user is not managed by the company.
                                You are not allowed to manage his devices.
                            </p>
                        </div>
                    </template>
                </paper-card>

                <template is="dom-if" if="[[ _shouldShowAdvanced ]]">
                    <paper-card heading="Resource admin" class="appsco-resource-admin">
                        <div class="card-content">
                            <appsco-directory-role-resource-admin-applications id="resourceAdminApplications" company-role="[[ role ]]" authorization-token="[[ authorizationToken ]]" size="5" preview=""></appsco-directory-role-resource-admin-applications>
                        </div>

                        <div class="card-actions">
                            <paper-button on-tap="_onResourceAdminApplications">ALL</paper-button>
                        </div>
                    </paper-card>
                </template>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-manage-account-components-page'; }

    static get properties() {
        return {
            role: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            administrator: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            notificationsApi: {
                type: String
            },

            logApi: {
                type: String
            },

            devicesApi: {
                type: String
            },

            twoFaApi: {
                type: String
            },

            groupsApi: {
                type: String
            },

            twoFaEnforced: {
                type: Boolean,
                value: false
            },

            _twoFAEnabled: {
                type: Boolean,
                value: false
            },

            _changeCompanyRolePermission: {
                type: Boolean,
                computed: '_computeChangeCompanyRolePermission(role, administrator)'
            },

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

            canManage: {
                type: Boolean,
                value: false
            },

            _managedUser: {
                type: Boolean,
                value: true,
                computed: '_computeUserManaged(role)'
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

    static get observers() {
        return [
            '_updateScreen(tabletScreen, mediumScreen)'
        ];
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': [{
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: dom(this.root).querySelectorAll('paper-card'),
                nodeDelay: 50,
                timing: {
                    delay: 200,
                    duration: 100
                }
            }],
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

        beforeNextRender(this, function() {
            if (this.tabletScreen || this.mediumScreen) {
                this.updateStyles();
            }
        });
    }

    _updateScreen(tablet, medium) {
        this.updateStyles();
    }

    _computeUserManaged(role) {
        return role && role.account && role.account.native_company
            ? role.account.native_company.alias === role.company.alias
            : false;
    }

    _formatOrgUnitName(name) {
        return name ? name.substring(0, 30) : '';
    }

    load() {
        this._loadNotifications();
        this.loadLog();
        this._loadGroups();
        this._loadDevices();
    }

    setSharedElement(target, callback) {
        if('notifications' === target) {
            this.sharedElements = {
                'hero': this.$.appscoAccountNotifications
            };
        }
    }

    _setSharedElement(target) {
        while (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
            target = target.parentNode;
        }

        this.sharedElements = {
            'hero': target
        };
    }

    _computeChangeCompanyRolePermission(role, administrator) {
        return (role.roles && role.roles.indexOf('COMPANY_ROLE_PARTNER_ADMIN') === -1 &&
            role.account && administrator.self &&
            (role.account.self !== administrator.self));
    }

    _loadNotifications() {
        if (this.shadowRoot.getElementById('appscoAccountNotifications') && this._managedUser) {
            this.shadowRoot.getElementById('appscoAccountNotifications').loadNotifications();
        }
    }

    _onNotificationsLoad() {
        this.dispatchEvent(new CustomEvent('notifications-seen', { bubbles: true, composed: true }));
    }

    loadLog() {
        this.$.appscoAccountLog.loadLog();
    }

    _loadGroups() {
        this.$.appscoAccountGroup.loadGroups();
    }

    _loadDevices() {
        if (this.shadowRoot.getElementById('appscoAccountDevice')  && this._managedUser) {
            this.shadowRoot.getElementById('appscoAccountDevice').loadDevices();
        }
    }

    load2FaApi() {
        this.$.twofaapi.generateRequest();
    }

    _on2FAResponse(event) {
        var response = event.detail.response;

        this._twoFAEnabled = response ? response.enabled : false;
    }

    _onAccountManageSettings(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('account-settings', { bubbles: true, composed: true }));
    }

    _onManageTwoFA(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-two-fa', {
            bubbles: true,
            composed: true,
            detail: {
                twoFAEnabled: this._twoFAEnabled
            }
        }));
    }

    _onManageOrgunits(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-orgunits', { bubbles: true, composed: true }));
    }

    _onManageGroups(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-groups', { bubbles: true, composed: true }));
    }

    _onAccountNotifications(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('all-notifications', { bubbles: true, composed: true }));
    }

    _onAccountLog(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('whole-log', { bubbles: true, composed: true }));
    }

    _onAllApplications(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-applications', { bubbles: true, composed: true }));
    }

    _onResourceAdminApplications(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-resource-admin-applications', { bubbles: true, composed: true }));
    }

    _onManageDevices(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-devices', { bubbles: true, composed: true }));
    }

    reloadApplications() {
        this.$.roleApplications.reload();
    }

    reloadResourceAdmins() {
        this.shadowRoot.getElementById('resourceAdminApplications').reload();
    }

    showAdvanced() {
        this._shouldShowAdvanced = true;
    }

    hideAdvanced() {
        this._shouldShowAdvanced = false;
    }
}
window.customElements.define(AppscoManageAccountComponentsPage.is, AppscoManageAccountComponentsPage);
