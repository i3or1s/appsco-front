import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './components/account/appsco-account-image-settings.js';
import './directory/appsco-manage-account-components-page.js';
import './account/appsco-account-settings-page.js';
import './account/appsco-account-notifications-page.js';
import './account/appsco-account-log-page.js';
import './directory/appsco-account-orgunits-page.js';
import './directory/appsco-manage-account-change-password-page.js';
import './directory/appsco-directory-role-applications-page.js';
import './directory/appsco-directory-role-resource-admin-applications-page.js';
import './directory/appsco-account-groups-page.js';
import './directory/appsco-account-devices-page.js';
import './directory/appsco-manage-account-twofa-page.js';
import './components/account/appsco-account-image.js';
import './directory/appsco-manage-account-page-actions.js';
import './components/company-role/appsco-role-reset-two-fa.js';
import './components/account/company/appsco-account-approve-device.js';
import './components/account/company/appsco-account-disapprove-device.js';
import './components/application/company/appsco-application-assignee-revoke.js';
import './components/application/company/appsco-application-assignee-claims.js';
import './components/account/company/appsco-account-orgunit.js';
import './components/account/company/appsco-account-remove-orgunit.js';
import './components/account/company/appsco-account-remove-group.js';
import './components/application/company/appsco-resource-admin-revoke.js';
import './components/resource/appsco-add-resource-to-resource-admin.js';
import './lib/mixins/appsco-page-mixin.js';
import './lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageAccountPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-manage-page-styles">
            :host div[resource] {
                height: calc(100% - 32px - 20px);
            }
            appsco-account-image-settings {
                display: block;
            }
            appsco-account-image {
                --account-image: {
                    width: 96px;
                    height: 96px;
                    margin-left: auto;
                    margin-right: auto;
                };

                --account-initials-background-color: var(--body-background-color-darker);
                --account-initials-font-size: 24px;
            }
            .account-managed-by {
                margin-top: 10px;
            }
            .change-password-hero {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                width: 100px;
                height: 100px;
                opacity: 0;
                visibility: hidden;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    <template is="dom-if" if="[[ account.picture_url ]]">
                        <appsco-account-image-settings id="appscoAccountImageSettings" account="{{ account }}" authorization-token="[[ authorizationToken ]]" image-settings-api="[[ imageSettingsApi ]]" preview-only="">
                        </appsco-account-image-settings>
                    </template>

                    <template is="dom-if" if="[[ !account.picture_url ]]">
                        <appsco-account-image account="[[ account ]]"></appsco-account-image>
                    </template>
                </div>

                <div class="resource-content account-info">
                    <div class="account-name">[[ account.name ]]</div>

                    <div class="account-email">[[ account.email ]]</div>

                    <div class="account-uuid">[[ account.uuid ]]</div>

                    <template is="dom-if" if="[[ account.company ]]">
                        <hr>
                        <div class="account-managed-by">
                            <p>Managed by: [[ account.company.name ]]</p>
                        </div>
                    </template>
                </div>

                <div class="resource-actions flex-horizontal">
                    <paper-button class="button secondary-button flex" on-tap="_onChangePassword" disabled\$="[[ !_canManage ]]">
                        Change password
                    </paper-button>
                </div>

            </div>

            <div content="" slot="content">

                <div class="content-container">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name" on-neon-animation-finish="_onPageAnimationFinish">

                        <appsco-manage-account-components-page id="appscoManageAccountComponentsPage" name="appsco-account-components-page" can-manage="[[ _canManage ]]" role="[[ role ]]" administrator="[[ administrator ]]" authorization-token="[[ authorizationToken ]]" notifications-api="[[ _notificationsApi ]]" log-api="[[ _logApi ]]" two-fa-api="[[ _twoFaApi ]]" groups-api="[[ _groupsApi ]]" devices-api="[[ _devicesApi ]]" on-account-settings="_onAccountSettings" on-all-notifications="_onAllNotifications" on-whole-log="_onWholeLog" on-manage-two-fa="_onManageTwoFA" on-manage-orgunits="_onManageOrgunits" on-manage-groups="_onManageGroups" on-manage-devices="_onManageDevices" on-manage-applications="_onManageApplications" on-manage-resource-admin-applications="_onManageResourceAdminApplications" on-log-loaded="_pageLoaded" on-log-empty="_pageLoaded">
                        </appsco-manage-account-components-page>

                        <appsco-account-settings-page name="appsco-account-settings-page" account="{{ account }}" authorization-token="[[ authorizationToken ]]" settings-api="[[ settingsApi ]]" on-settings-saved="_onSettingsSaved" on-back="_onResourceBack">
                        </appsco-account-settings-page>

                        <appsco-account-notifications-page name="appsco-account-notifications-page" authorization-token="[[ authorizationToken ]]" notifications-api="[[ _notificationsApi ]]" on-back="_onResourceBack">
                        </appsco-account-notifications-page>

                        <appsco-account-log-page id="appscoAccountLogPage" name="appsco-account-log-page" authorization-token="[[ authorizationToken ]]" log-api="[[ _logApi ]]" on-back="_onResourceBack">
                        </appsco-account-log-page>

                        <appsco-manage-account-twofa-page id="appscoManageAccountTwoFaPage" name="appsco-manage-account-twofa-page" role="[[ role ]]" on-reset-role-two-fa="_onResetRoleTwoFA" on-back="_onResourceBack">
                        </appsco-manage-account-twofa-page>

                        <appsco-account-orgunits-page name="appsco-account-orgunits-page" role="[[ role ]]" authorization-token="[[ authorizationToken ]]" on-add-to-orgunit="_onAddAccountToOrgunit" on-remove-from-orgunit="_onRemoveAccountFromOrgunit" on-back="_onResourceBack">
                        </appsco-account-orgunits-page>

                        <appsco-account-groups-page id="appscoAccountGroupsPage" name="appsco-account-groups-page" account="[[ role ]]" groups-api="[[ _groupsApi ]]" authorization-token="[[ authorizationToken ]]" on-remove-from-group="_onRemoveAccountFromGroup" on-back="_onResourceBack">
                        </appsco-account-groups-page>

                        <appsco-account-devices-page id="appscoAccountDevicesPage" name="appsco-account-devices-page" account="[[ role ]]" devices-api="[[ _devicesApi ]]" authorization-token="[[ authorizationToken ]]" on-approve-device="_onApproveDevice" on-disapprove-device="_onDisapproveDevice" on-back="_onResourceBack">
                        </appsco-account-devices-page>

                        <appsco-manage-account-change-password-page name="appsco-manage-account-change-password-page" authorization-token="[[ authorizationToken ]]" change-password-api="[[ _changePasswordApi ]]" on-password-changed="_onPasswordChanged" on-back="_onResourceBack">
                        </appsco-manage-account-change-password-page>

                        <appsco-directory-role-applications-page id="appscoDirectoryRoleApplicationsPage" name="appsco-directory-role-applications-page" role="[[ role ]]" authorization-token="[[ authorizationToken ]]" on-revoke-assignee="_onRevokeAssigneeAccess" on-change-assignee-claims="_onChangeAssigneeClaims" on-back="_onResourceBack">
                        </appsco-directory-role-applications-page>

                        <appsco-directory-role-resource-admin-applications-page id="appscoDirectoryRoleResourceAdminApplicationsPage" name="appsco-directory-role-resource-admin-applications-page" role="[[ role ]]" authorization-token="[[ authorizationToken ]]" on-add-resource-admin="_onAddResourceToResourceAdmin" on-revoke-resource-admin="_onRevokeResourceAdmin" on-back="_onResourceBack">
                        </appsco-directory-role-resource-admin-applications-page>

                    </neon-animated-pages>
                </div>

            </div>
        </appsco-content>

        <div id="changePasswordHero" class="change-password-hero"></div>

        <iron-ajax id="ironAjaxGetAccount" on-error="_onAccountError" on-response="_onAccountResponse" headers="[[ _headers ]]"></iron-ajax>

        <iron-ajax auto="" url="[[ _canBeManagedApi ]]" on-error="_onCanBeManagedError" on-response="_onCanBeManagedResponse" headers="[[ _headers ]]"></iron-ajax>

        <appsco-role-reset-two-fa id="appscoRoleResetTwoFA" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-role-two-fa-reset="_onRoleTwoFAReset">
        </appsco-role-reset-two-fa>

        <appsco-account-approve-device id="appscoAccountApproveDevice" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-device-approve-finished="_onDeviceApproveFinished">
        </appsco-account-approve-device>

        <appsco-account-disapprove-device id="appscoAccountDisapproveDevice" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-device-disapprove-finished="_onDeviceDisapproveFinished">
        </appsco-account-disapprove-device>

        <appsco-application-assignee-revoke id="appscoApplicationAssigneeRevoke" authorization-token="[[ authorizationToken ]]">
        </appsco-application-assignee-revoke>

        <appsco-application-assignee-claims id="appscoApplicationAssigneeClaims" application="[[ _companyApplication ]]" authorization-token="[[ authorizationToken ]]">
        </appsco-application-assignee-claims>

        <appsco-account-orgunit id="appscoAccountOrgunit" authorization-token="[[ authorizationToken ]]" company-orgunits-api="[[ companyOrgunitsApi ]]">
        </appsco-account-orgunit>

        <appsco-account-remove-orgunit id="appscoAccountRemoveOrgunit" authorization-token="[[ authorizationToken ]]" account="[[ _role ]]">
        </appsco-account-remove-orgunit>

        <appsco-account-remove-group id="appscoAccountRemoveGroup" authorization-token="[[ authorizationToken ]]">
        </appsco-account-remove-group>

        <appsco-add-resource-to-resource-admin id="appscoAddResourceToResourceAdmin" authorization-token="[[ authorizationToken ]]" get-resources-api="[[ companyApplicationsApi ]]" api-errors="[[ apiErrors ]]" on-resource-admin-assigned="_onResourceAdminAssigned">
        </appsco-add-resource-to-resource-admin>

        <appsco-resource-admin-revoke id="appscoResourceAdminRevoke" authorization-token="[[ authorizationToken ]]" on-access-revoked="_onResourceAdminRevoked">
        </appsco-resource-admin-revoke>
`;
    }

    static get is() { return 'appsco-manage-account-page'; }

    static get properties() {
        return {
            route: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            role: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onRoleChanged'
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            administrator: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            companyApi: {
                type: String,
                observer: '_onCompanyApiChanged'
            },

            _notificationsApi: {
                type: String,
                computed: '_computeNotificationsApi(role)'
            },

            _logApi: {
                type: String,
                computed: '_computeLogApi(role)'
            },

            _twoFaApi: {
                type: String,
                computed: '_computeTwoFaApi(role)'
            },

            _groupsApi: {
                type: String,
                computed: '_computeGroupsForRole(role)'
            },

            _devicesApi: {
                type: String,
                computed: '_computeDevicesForRole(role)'
            },

            settingsApi: {
                type: String,
                computed: '_computeSettingsApi(role)'
            },

            imageSettingsApi: {
                type: String
            },

            _changePasswordApi: {
                type: String,
                computed: '_computeChangePasswordApi(role)'
            },

            _canBeManagedApi: {
                type: String,
                computed: '_computeCanBeManagedApi(role)'
            },

            companyOrgunitsApi: {
                type: String
            },

            companyApplicationsApi: {
                type: String
            },

            apiErrors: {
                type: Object
            },

            _canManage: {
                type: Boolean,
                value: false
            },

            /**
             * Selected page.
             * It has value of component's 'name' attribute.
             */
            _selected: {
                type: String,
                value: 'appsco-account-components-page',
                notify: true
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

            mobileScreen: {
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
            this._getAccount();
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
        this.toolbar.addEventListener('advanced-settings', this._onShowAdvancedAction.bind(this));
    }

    _onCompanyApiChanged() {
        this._getAccount();
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

    _computeSettingsApi(role) {
        return role.self;
    }

    _computeNotificationsApi(role) {
        return role.self + '/notifications';
    }

    _computeLogApi(role) {
        return role.meta ? role.meta.log : null;
    }

    _computeTwoFaApi(role) {
        return role.self + '/2fa';
    }

    _computeGroupsForRole(role) {
        return role.meta ? role.meta.groups + '?extended=1' : null;
    }

    _computeDevicesForRole(role) {
        return role.meta ? role.meta.devices + '?extended=1' : null;
    }

    _computeChangePasswordApi(role) {
        return role.self + '/change-password';
    }

    _computeCanBeManagedApi(role) {
        return role.self ? role.self + '/can-be-managed' : null;
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _getAccount() {
        if (!this.role.self && this.companyApi && this._headers) {
            this.$.ironAjaxGetAccount.url = this.companyApi + '/directory/roles' + this.route.path;
            this.$.ironAjaxGetAccount.generateRequest();
        }
    }

    _onAccountResponse(event) {
        this.set('role', event.detail.response);
    }

    _onAccountError() {
        this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
    }

    _onRoleChanged(role) {
        if (role.self) {
            this.$.appscoManageAccountComponentsPage.load();
            this.$.appscoAccountGroupsPage.loadGroups();
            this.account = role.account;
        }
    }

    _onResourceBack() {
        this._showAccountComponentsPage();
    }

    refreshLog() {
        this.$.appscoManageAccountComponentsPage.loadLog();
        this.$.appscoAccountLogPage.loadLog();
    }

    reloadAccountLog () {
        this.$.appscoManageAccountComponentsPage.loadLog();
    }

    removeGroup(group) {
        this.$.appscoAccountGroupsPage.removeGroup(group);
    }

    reloadDevices() {
        this.$.appscoAccountDevicesPage.loadDevices();
    }

    _onSettingsSaved(event) {
        this._showAccountComponentsPage();
        this.refreshLog();
        this.set('role.account', event.detail.account);
    }

    _onPasswordChanged(event) {
        this._showAccountComponentsPage();
        this.refreshLog();

        event.stopPropagation();
        this.dispatchEvent(new CustomEvent(event.type, {
            bubbles: true,
            composed: true,
            detail: {
                account: this.account
            }
        }));
    }

    _showAccountComponentsPage() {
        this._selected = 'appsco-account-components-page';
    }

    resetPage() {
        this._showAccountComponentsPage();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    _onAccountSettings() {
        this._selected = 'appsco-account-settings-page';
    }

    _onAllNotifications() {
        this._selected = 'appsco-account-notifications-page';
    }

    _onWholeLog() {
        this._selected = 'appsco-account-log-page';
    }

    _onManageTwoFA(event) {
        this.$.appscoManageAccountTwoFaPage.setTwoFAEnabled(event.detail.twoFAEnabled);
        this._selected = 'appsco-manage-account-twofa-page';
    }

    _onManageOrgunits() {
        this._selected = 'appsco-account-orgunits-page';
    }

    _onManageGroups() {
        this._selected = 'appsco-account-groups-page';
    }

    _onManageDevices() {
        this._selected = 'appsco-account-devices-page';
    }

    _onManageApplications() {
        this._selected = 'appsco-directory-role-applications-page';
    }

    _onManageResourceAdminApplications() {
        this._selected = 'appsco-directory-role-resource-admin-applications-page';
    }

    _onChangePassword() {
        this.$.appscoManageAccountComponentsPage.sharedElements = {
            'hero': this.$.changePasswordHero
        };

        this._selected = 'appsco-manage-account-change-password-page';
    }

    _onPageAnimationFinish(event) {
        const fromPage = event.detail.fromPage,
            toPage = event.detail.toPage;

        switch(fromPage.getAttribute('name')) {
            case 'appsco-account-settings-page':
            case 'appsco-manage-account-change-password-page':
                fromPage.resetPage();
                break;
            default:
                break;
        }
        switch(toPage.getAttribute('name')) {
            case 'appsco-account-settings-page':
            case 'appsco-manage-account-change-password-page':
                toPage.setPage();
                break;
            default:
                break;
        }
    }

    _onCanBeManagedResponse(event) {
        this._canManage = (200 === event.detail.status);
    }

    _onCanBeManagedError(event) {
        this._canManage = false;
    }

    reloadApplications() {
        this.$.appscoManageAccountComponentsPage.reloadApplications();
        this.$.appscoDirectoryRoleApplicationsPage.reloadApplications();
    }

    reloadResourceAdmins() {
        this.$.appscoDirectoryRoleResourceAdminApplicationsPage.reloadResourceAdmins();
    }

    showAdvanced() {
        this.$.appscoManageAccountComponentsPage.showAdvanced();
    }

    hideAdvanced() {
        this.$.appscoManageAccountComponentsPage.hideAdvanced();
    }

    _onShowAdvancedAction(event) {
        if (event.detail.showAdvanced) {
            this.showAdvanced();
            return;
        }

        this.hideAdvanced();
    }

    _onResetRoleTwoFA(event) {
        const dialog = this.shadowRoot.getElementById('appscoRoleResetTwoFA');
        dialog.setRole(event.detail.role);
        dialog.open();
    }

    _onRoleTwoFAReset(event) {
        this.resetPage();
        this._notify('You have successfully reset two-factor authentication for ' + event.detail.role.account.name);
    }

    _onApproveDevice(event) {
        const dialog = this.shadowRoot.getElementById('appscoAccountApproveDevice');
        dialog.setDevice(event.detail.device);
        dialog.setAccount(event.detail.account);
        dialog.open();
    }

    _onDeviceApproveFinished(event) {
        const device = event.detail.device;
        this.reloadDevices();
        this._notify('Device ' + device.name + ' has been successfully approved.');
    }

    _onDisapproveDevice(event) {
        const dialog = this.shadowRoot.getElementById('appscoAccountDisapproveDevice');
        dialog.setDevice(event.detail.device);
        dialog.setAccount(event.detail.account);
        dialog.open();
    }

    _onDeviceDisapproveFinished(event) {
        const device = event.detail.device;
        this.reloadDevices();
        this._notify('Device ' + device.name + ' has been successfully disapproved.');
    }

    _onRevokeAssigneeAccess(event) {
        const dialog = this.shadowRoot.getElementById('appscoApplicationAssigneeRevoke');
        dialog.setAssignee(event.detail.assignee);
        dialog.toggle();
    }

    _onChangeAssigneeClaims(event) {
        const dialog = this.shadowRoot.getElementById('appscoApplicationAssigneeClaims');
        dialog.setApplication(event.detail.application);
        dialog.setAssignee(event.detail.assignee);
        dialog.toggle();
    }

    _onAddAccountToOrgunit(event) {
        const dialog = this.shadowRoot.getElementById('appscoAccountOrgunit');
        dialog.setAccounts([event.detail.role]);
        dialog.toggle();
    }

    _onRemoveAccountFromOrgunit(event) {
        const dialog = this.shadowRoot.getElementById('appscoAccountRemoveOrgunit');
        dialog.setOrgUnit(event.detail.orgunit);
        dialog.setAccount(event.detail.account);
        dialog.toggle();
    }

    _onRemoveAccountFromGroup(event) {
        const dialog = this.shadowRoot.getElementById('appscoAccountRemoveGroup');
        dialog.setGroup(event.detail.group);
        dialog.setAccount(event.detail.account);
        dialog.toggle();
    }

    _onAddResourceToResourceAdmin(event) {
        const dialog = this.shadowRoot.getElementById('appscoAddResourceToResourceAdmin');
        dialog.setRole(event.detail.role);
        dialog.toggle();
    }

    _onResourceAdminAssigned(event) {
        this.reloadResourceAdmins();
    }

    _onRevokeResourceAdmin(event) {
        const dialog = this.shadowRoot.getElementById('appscoResourceAdminRevoke');
        dialog.setAssignee(event.detail.assignee);
        dialog.setApplication(event.detail.application);
        dialog.toggle();
    }

    _onResourceAdminRevoked(event) {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('resource-admin-revoked', {
            bubbles: true,
            composed: true,
            detail: event.detail
        }));
    }
}
window.customElements.define(AppscoManageAccountPage.is, AppscoManageAccountPage);
