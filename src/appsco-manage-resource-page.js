import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './components/application/company/appsco-application-assignees.js';
import './application/appsco-application-log-page.js';
import './applications/appsco-company-resource-settings-page.js';
import './applications/appsco-manage-application-components-page.js';
import './applications/appsco-application-assignees-page.js';
import './applications/appsco-application-groups-page.js';
import './applications/appsco-application-compliance-page.js';
import './applications/appsco-resource-admins-page.js';
import './components/account/appsco-account-image.js';
import './application/appsco-resource-image-settings.js';
import './applications/appsco-manage-resource-page-actions.js';
import './components/application/company/appsco-company-application-remove.js';
import './components/resource/appsco-share-resource.js';
import './components/application/appsco-application-remove-group.js';
import './components/resource/appsco-add-resource-admin.js';
import './components/application/company/appsco-resource-admin-revoke.js';
import './components/application/company/appsco-application-assignee-claims.js';
import './components/application/company/appsco-application-assignee-revoke.js';
import './lib/mixins/appsco-page-mixin.js';
import './lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageResourcePage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-manage-page-styles">
            :host {
                --account-initials-background-color: var(--body-background-color-darker);

                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };
            }
            :host div[resource] {
                height: calc(100% - 32px - 20px);
            }
            :host div[resource] > .resource-content {
                padding-top: 30px;
            }
            :host .resource-header .action-share {
                color: var(--app-secondary-color);
                position: absolute;
                top: 0;
                right: 0;
            }
            appsco-account-image {
                position: absolute;
                bottom: -22px;
                left: 10px;
                box-sizing: border-box;

                --account-initials-background-color: var(--body-background-color-darker);
                --account-image: {
                    width: 42px;
                    height: 42px;
                    border: 4px solid var(--body-background-color);
                };
            }
            :host .application-title {
                margin-top: 30px;
                margin-bottom: 0;
                word-wrap: break-word;
            }
            .appsco-application-assignees {
                margin-top: 10px;
                min-height: 65px;
                box-sizing: border-box;
            }
            :host .info {
                @apply --paper-font-body1;
                margin-top: 10px;
            }
            :host div.help-title {
                padding-top: 4px;
                font-size: 18px;
                color: var(--primary-text-color);
                margin-top: 10px;
            }
            :host div.tutorial.info a,
            :host div.tutorial.info a:hover {
                color: var(--primary-text-color);
                text-decoration: none;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    <template is="dom-if" if="[[ !resourceAdmin ]]" restamp="">
                        <paper-icon-button class="action-share" icon="social:share" title="Share" on-tap="_onShareApplication"></paper-icon-button>
                    </template>

                    <appsco-resource-image-settings id="appscoAccountImageSettings" resource="{{ application }}" authorization-token="[[ authorizationToken ]]" image-settings-api="[[ _resourceImageSettingApi ]]" preview-only\$="[[ resourceAdmin ]]">
                    </appsco-resource-image-settings>

                    <appsco-account-image account="[[ account ]]"></appsco-account-image>
                </div>

                <div class="resource-content">
                    <p class="application-title">[[ application.title ]]</p>

                    <template is="dom-if" if="[[ !resourceAdmin ]]" restamp="">
                        <appsco-application-assignees id="appscoApplicationAssignees" class="appsco-application-assignees" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" size="5" preview="" auto-load=""></appsco-application-assignees>
                    </template>

                    <div class="info">
                            Created by: [[ application.added_by.display_name ]]
                    </div>

                    <template is="dom-if" if="[[ application.identifier ]]">
                        <div class="info">
                                Client ID: [[ application.identifier ]] <appsco-copy value="[[ application.identifier ]]" name="clientID"></appsco-copy>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ application.discovery ]]">
                        <div class="info">
                                Discovery url: [[ application.discovery ]] <appsco-copy value="[[ application.discovery ]]" name="discoveryUrl"></appsco-copy>
                        </div>
                    </template>

                    <div class="info">
                        Last modified: [[ _lastEditedDate ]] by [[ application.last_modified.account ]].
                    </div>

                    <div class="info">
                        [[ _setByInfo ]]
                    </div>

                    <template is="dom-if" if="[[ application.tutorial.length ]]">
                        <div class="info tutorial">
                            <div class="help-title">Need help?</div>
                            <template is="dom-repeat" items="[[ application.tutorial ]]" as="tutorial">
                                <a href="[[ tutorial.url ]]" target="_blank" rel="noopener noreferrer">[[ tutorial.content ]]</a>
                            </template>
                        </div>
                    </template>
                </div>

                <template is="dom-if" if="[[ !resourceAdmin ]]" restamp="">
                    <div class="resource-actions flex-horizontal">
                        <paper-button class="button danger-button flex" on-tap="_onRemoveApplication">
                            Remove
                        </paper-button>
                    </div>
                </template>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name" on-neon-animation-finish="_onPageAnimationFinish">
                        <appsco-manage-application-components-page
                            id="appscoManageApplicationComponentsPage"
                            name="appsco-application-components-page"
                            application="{{ application }}"
                            company-idp-saml-metadata-api="[[ companyIdpSamlMetadataApi ]]"
                            groups-api="[[ _groupsApi ]]"
                            authorization-token="[[ authorizationToken ]]"
                            api-errors="[[ apiErrors ]]"
                            resource-admin="[[ resourceAdmin ]]"
                            on-application-settings="_onResourceSettings"
                            on-all-assignees="_onAllAssignees"
                            on-all-log="_onAllLog"
                            on-manage-groups="_onManageGroups"
                            on-manage-compliance="_onManageCompliance"
                            on-manage-resource-admins="_onManageResourceAdmins"
                            on-log-empty="_pageLoaded"
                            on-log-loaded="_pageLoaded">
                        </appsco-manage-application-components-page>

                        <appsco-company-resource-settings-page
                            name="appsco-resource-settings-page"
                            resource="{{ application }}"
                            authorization-token="[[ authorizationToken ]]"
                            api-errors="[[ apiErrors ]]"
                            on-application-settings-saved="_onResourceSettingsSaved"
                            on-back="_onResourceSettingsBack"
                            on-application-settings-no-changes="_onApplicationSettingsNoChanges"
                            domain="[[ domain ]]">
                        </appsco-company-resource-settings-page>

                        <template is="dom-if" if="[[ !resourceAdmin ]]" restamp="">
                            <appsco-application-groups-page
                                id="appscoApplicationGroupsPage"
                                name="appsco-application-groups-page"
                                application="[[ application ]]"
                                groups-api="[[ _groupsApi ]]"
                                authorization-token="[[ authorizationToken ]]"
                                on-remove-from-group="_onRemoveApplicationFromGroup"
                                on-back="_onResourceBack">
                            </appsco-application-groups-page>

                            <appsco-application-compliance-page
                                id="appscoApplicationCompliancePage"
                                name="appsco-application-compliance-page"
                                application="[[ application ]]"
                                authorization-token="[[ authorizationToken ]]"
                                api-errors="[[ apiErrors ]]"
                                on-back="_onResourceBack"
                                on-compliance-info-updated="_onComplianceInfoUpdated">
                            </appsco-application-compliance-page>

                            <appsco-resource-admins-page
                                id="appscoResourceAdminsPage"
                                name="appsco-resource-admins-page"
                                application="[[ application ]]"
                                authorization-token="[[ authorizationToken ]]"
                                api-errors="[[ apiErrors ]]"
                                on-add-resource-admin="_onAddResourceAdmin"
                                on-revoke-resource-admin="_onRevokeResourceAdmin"
                                on-enable-assignees-search-action="_onEnableAssigneesSearchAction"
                                on-disable-assignees-search-action="_onDisableAssigneesSearchAction"
                                on-back="_onResourceBack">
                            </appsco-resource-admins-page>

                            <appsco-application-assignees-page
                                id="appscoApplicationAssigneesPage"
                                name="appsco-application-assignees-page"
                                application="{{ application }}"
                                authorization-token="[[ authorizationToken ]]"
                                api-errors="[[ apiErrors ]]"
                                on-back="_onResourceBack"
                                account="[[ account ]]"
                                on-revoke-assignee="_onRevokeAssigneeAccess"
                                on-assignee-claims="_onChangeAssigneeClaims"
                                on-enable-assignees-search-action="_onEnableAssigneesSearchAction"
                                on-disable-assignees-search-action="_onDisableAssigneesSearchAction"
                                on-assignees-empty="_pageLoaded"
                                on-assignees-loaded="_pageLoaded">
                            </appsco-application-assignees-page>

                            <appsco-application-log-page company=""
                                name="appsco-application-log-page"
                                application="[[ application ]]"
                                authorization-token="[[ authorizationToken ]]"
                                on-back="_onResourceBack">
                            </appsco-application-log-page>
                        </template>
                    </neon-animated-pages>
                </div>
            </div>
        </appsco-content>

        <iron-ajax id="ironAjaxGetApplication" on-error="_onApplicationError" on-response="_onApplicationResponse" headers="[[ _headers ]]">
        </iron-ajax>

        <appsco-company-application-remove
            id="appscoCompanyApplicationsRemove"
            authorization-token="[[ authorizationToken ]]"
            company-api="[[ companyApi ]]"
            api-errors="[[ apiErrors ]]"
            on-applications-remove-failed="_onApplicationsRemoveFailed">
        </appsco-company-application-remove>

        <appsco-share-resource
            id="appscoShareResource"
            authorization-token="[[ authorizationToken ]]"
            get-roles-api="[[ companyRolesApi ]]"
            get-contacts-api="[[ companyContactsApi ]]"
            get-groups-api="[[ companyGroupsApi ]]"
            api-errors="[[ apiErrors ]]"
            items-loaded="{{ shareResourceDialogAccountsLoaded }}">
        </appsco-share-resource>

        <appsco-application-assignee-revoke
            id="appscoApplicationAssigneeRevoke"
            authorization-token="[[ authorizationToken ]]">
        </appsco-application-assignee-revoke>

        <appsco-application-remove-group
            id="appscoApplicationRemoveGroup"
            authorization-token="[[ authorizationToken ]]">
        </appsco-application-remove-group>

        <appsco-add-resource-admin
            id="appscoAddResourceAdmin"
            authorization-token="[[ authorizationToken ]]"
            get-roles-api="[[ companyRolesApi ]]"
            get-contacts-api="[[ companyContactsApi ]]"
            api-errors="[[ apiErrors ]]"
            on-resources-shared="_onResourceAdminAdded"
            on-accounts-loaded="_hideProgressBar">
        </appsco-add-resource-admin>

        <appsco-resource-admin-revoke
            id="appscoResourceAdminRevoke"
            authorization-token="[[ authorizationToken ]]"
            on-access-revoked="_onResourceAdminRevoked">
        </appsco-resource-admin-revoke>
        
        <appsco-application-assignee-claims
            id="appscoApplicationAssigneeClaims"
            application="[[ application ]]"
            authorization-token="[[ authorizationToken ]]">
        </appsco-application-assignee-claims>
`;
    }

    static get is() { return 'appsco-manage-resource-page'; }

    static get properties() {
        return {
            route: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            application: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onApplicationChanged'
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            domain: {
                type: String
            },

            resourceAdmin: {
                type: Boolean,
                value: false,
                observer: '_onResourceAdminChanged'
            },

            _lastEditedDate: {
                type: String,
                computed: '_computeLastEditedDate(application)'
            },

            _setByInfo: {
                type: String,
                computed: '_computeSetByInfo(application)'
            },

            /**
             * Selected page.
             * It has value of component's 'name' attribute.
             */
            _selected: {
                type: String,
                value: 'appsco-application-components-page',
                notify: true,
                observer: '_selectedPageChanged'
            },

            companyIdpSamlMetadataApi: {
                type: String
            },

            accountsApi: {
                type: String
            },

            companyApi: {
                type: String,
                observer: '_onCompanyApiChanged'
            },

            companyContactsApi: {
                type: String
            },

            companyRolesApi: {
                type: String
            },

            companyGroupsApi: {
                type: String
            },

            _groupsApi: {
                type: String,
                computed: '_computeGroupsForApplication(application)'
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _subscribers: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _resourceImageSettingApi: {
                type: String,
                computed: '_computeResourceImageSettingsApi(application)'
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
        });

        afterNextRender(this, function() {
            this._getApplication();
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
        this.toolbar.addEventListener('search-assignees', this._onSearchAssignees.bind(this));
        this.toolbar.addEventListener('search-assignees-clear', this._onSearchAssigneesClear.bind(this));
        this.toolbar.addEventListener('advanced-settings', this._showAdvancedManageResourcePageOptions.bind(this));
    }

    _onCompanyApiChanged() {
        this._getApplication();
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

    _selectedPageChanged(selected) {
        if (undefined === selected) {
            return;
        }
        'appsco-application-components-page' === selected ?
            this.toolbar.showAdvancedSettings() :
            this.toolbar.hideAdvancedSettings()
        ;
    }

    _computeGroupsForApplication(application) {
        return application.meta ? application.meta.groups + '?extended=1' : null;
    }

    _computeResourceImageSettingsApi(application) {
        return application.meta ? application.meta.change_application_image : null;
    }

    _computeLastEditedDate(application) {
        return (application && application.last_modified) ? this._dateFormat(application.last_modified.date.date) : '';
    }

    _computeSetByInfo(application) {
        return (application.claim_type && application.claim_type === 'individual') ?
            'Resource is set to be configured individually by subscribers.' :
            'Resource is set to be configured by admin for all subscribers.';
    }

    /**
     * Formats date and returns formatted date as string.
     *
     * @param {String} value
     * @returns {string}
     * @private
     */
    _dateFormat(value) {
        if (value) {
            const options = {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric'
            };
            return (new Date(value)).toLocaleDateString('en', options);
        }
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _getApplication() {
        if (!this.application.self && this.companyApi && this._headers) {
            this.$.ironAjaxGetApplication.url = this.companyApi + '/applications' + this.route.path;
            this.$.ironAjaxGetApplication.generateRequest();
        }

    }

    _onApplicationResponse(event) {
        this.application = event.detail.response;
    }

    _onApplicationChanged(application) {
        if (application.self) {
            if (this.shadowRoot.getElementById('appscoManageApplicationComponentsPage') && this.shadowRoot.getElementById('appscoManageApplicationComponentsPage').$) {
                this.shadowRoot.getElementById('appscoManageApplicationComponentsPage').load();
            }

            if (this.shadowRoot.getElementById('appscoApplicationGroupsPage') && this.shadowRoot.getElementById('appscoApplicationGroupsPage').$) {
                this.shadowRoot.getElementById('appscoApplicationGroupsPage').loadGroups();
            }
        }
    }

    _onResourceAdminChanged(value) {
        if (value) {
            this._pageLoaded();
        }
    }

    _onApplicationError() {
        this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
    }

    _onResourceSettings() {
        this._selected = 'appsco-resource-settings-page';
    }

    _onAllAssignees() {
        this._selected = 'appsco-application-assignees-page';
    }

    _onAllLog() {
        this._selected = 'appsco-application-log-page';
    }

    _onManageGroups() {
        this._selected = 'appsco-application-groups-page';
    }

    _onManageCompliance() {
        this._selected = 'appsco-application-compliance-page';
    }

    _onManageResourceAdmins() {
        this._selected = 'appsco-resource-admins-page';
    }

    _onResourceSettingsSaved(event) {
        this.application = event.detail.application;
        this._showApplicationComponentsPage();
    }

    _onComplianceInfoUpdated() {
        this._showApplicationComponentsPage();
        this._notify('Compliance information successfully modified.');
    }

    _onResourceSettingsBack() {
        this._showApplicationComponentsPage();
    }

    _onResourceBack() {
        this._showApplicationComponentsPage();
    }

    removeGroup(group) {
        this.shadowRoot.getElementById('appscoApplicationGroupsPage').removeGroup(group);
    }

    _showApplicationComponentsPage() {
        this._selected = 'appsco-application-components-page';
    }

    _onShareApplication() {
        const dialog = this.shadowRoot.getElementById('appscoShareResource');
        dialog.setResources([this.application]);
        dialog.toggle();
        this._hideProgressBar();
    }

    reloadAssignees() {
        this.shadowRoot.getElementById('appscoApplicationAssignees').reload();
        this.$.appscoManageApplicationComponentsPage.reloadAssignees();
        this.shadowRoot.getElementById('appscoApplicationAssigneesPage').reloadAssignees();
    }

    searchAssignees(term) {
        this.shadowRoot.getElementById('appscoApplicationAssigneesPage').searchAssignees(term);
    }

    reloadResourceAdmins() {
        this.shadowRoot.getElementById('appscoResourceAdminsPage').reload();
    }

    removeApplicationAssignee(application, assignee) {
        if (application.alias === this.application.alias) {
            this._removeAssignee(assignee);
        }
    }

    _removeAssignee(assignee) {
        this.shadowRoot.getElementById('appscoApplicationAssignees').removeAssignee(assignee);
        this.$.appscoManageApplicationComponentsPage.removeAssignee(assignee);
        this.shadowRoot.getElementById('appscoApplicationAssigneesPage').removeAssignee(assignee);
    }

    _onRemoveApplication() {
        const dialog = this.shadowRoot.getElementById('appscoCompanyApplicationsRemove');
        dialog.setApplications([this.application]);
        dialog.toggle();
    }

    resetPage() {
        this._showApplicationComponentsPage();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    _onPageAnimationFinish(event) {
        const fromPage = event.detail.fromPage,
            toPage = event.detail.toPage;

        if('appsco-application-assignees-page' === fromPage.getAttribute('name')) {
            fromPage.resetPage();
        }
        switch(toPage.getAttribute('name')) {
            case 'appsco-application-settings-page':
                toPage.setPage();
                break;
            case 'appsco-application-assignees-page':
                toPage.setupPage();
                break;
            default:
                break;
        }
    }

    reload() {
        this.$.appscoManageApplicationComponentsPage.load();
    }

    showAdvanced() {
        this.$.appscoManageApplicationComponentsPage.showAdvanced();
    }

    hideAdvanced() {
        this.$.appscoManageApplicationComponentsPage.hideAdvanced();
    }

    _searchAssignees(term) {
        this._showProgressBar();
        this.searchAssignees(term);
    }

    _onSearchAssignees(event) {
        this._searchAssignees(event.detail.term);
    }

    _onSearchAssigneesClear() {
        this._searchAssignees('');
    }

    _showAdvancedManageResourcePageOptions(event) {
        if (event.detail.showAdvanced) {
            this.showAdvanced();
            return;
        }

        this.hideAdvanced();
    }

    _onApplicationsRemoveFailed() {
        this._notify('An error occurred. Selected resources were not removed from company. Please try again.');
    }

    _onRevokeAssigneeAccess(event) {
        const dialog = this.shadowRoot.getElementById('appscoApplicationAssigneeRevoke');

        dialog.setAssignee(event.detail.assignee);
        dialog.toggle();
    }

    _onRemoveApplicationFromGroup(event) {
        const dialog = this.shadowRoot.getElementById('appscoApplicationRemoveGroup');
        dialog.setGroup(event.detail.group);
        dialog.setApplication(event.detail.application);
        dialog.toggle();
    }

    _onAddResourceAdmin(event) {
        const dialog = this.shadowRoot.getElementById('appscoAddResourceAdmin');
        dialog.setResources([event.detail.resource]);
        dialog.toggle();
    }

    _onResourceAdminAdded(event) {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('resource-admin-added', { bubbles: true, composed: true }));
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

    _onApplicationSettingsNoChanges() {
        this._notify('No changes have been made to ' + this.application.title + '.');
    }

    _onEnableAssigneesSearchAction() {
        this.toolbar.enableAssigneesSearchAction();
    }

    _onDisableAssigneesSearchAction() {
        this.toolbar.disableAssigneesSearchAction();
    }

    _onChangeAssigneeClaims(event) {
        const dialog = this.shadowRoot.getElementById('appscoApplicationAssigneeClaims');
        dialog.setApplication(this.application);
        dialog.setAssignee(event.detail.assignee);
        dialog.toggle();
    }
}
window.customElements.define(AppscoManageResourcePage.is, AppscoManageResourcePage);
