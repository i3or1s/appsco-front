import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/folder/appsco-folders.js';
import './components/application/appsco-applications.js';
import './components/application/appsco-application-item.js';
import './components/application/appsco-application-info.js';
import './components/application/appsco-application-security.js';
import './components/application/appsco-application-subscribers.js';
import './components/application/appsco-application-details.js';
import './components/application/appsco-application-log.js';
import { AppscoDropHTMLElementBehavior } from './components/components/appsco-drop-html-element-behavior.js';
import './components/folder/appsco-folders-application-add.js';
import './components/folder/appsco-dashboard-folder-page-actions.js';
import './components/application/appsco-application-share.js';
import './application/appsco-application-settings-dialog.js';
import './components/application/appsco-application-revoke.js';
import './components/application/company/appsco-company-resource-settings-dialog.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDashboardFolderPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoDropHTMLElementBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --paper-tabs-selection-bar-color: var(--app-primary-color);

                --appsco-application-item: {
                    color: var(--primary-text-color);
                };

                --appsco-list-item-message: {
                    font-size: 14px;
                };
                --application-log-item: {
                    padding-bottom: 6px;
                };

                --application-details-label: {
                    font-size: 12px;
                };
                --application-details-value: {
                    font-size: 14px;
                };

                --applications-container: {
                    margin-right: -30px;
                };
            }
            :host .citrix-item {
                margin: 0 10px 10px 0;
                @apply --appsco-applications-item;
            }
            appsco-application-security {
                --security-score: {
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                };
            }
            :host appsco-application-subscribers {
                height: 50px;
            }
            :host paper-tabs {
                height: 38px;
                color: var(--primary-text-color);
            }
            :host div[info] .info-details-section {
                margin-top: 6px;
                height: calc(100% - 48px - 35px - 6px);
            }
            .tab-content {
                margin-right: -10px;
                padding-right: 10px;
                overflow: auto;
            }
            :host .info-actions > .view-button {
                margin-right: 1px;
            }
            appsco-application-details {
                --appsco-application-icons-color: var(--primary-text-color);
            }
            :host .breadcrumbs {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin-bottom: 10px;
            }
            :host .breadcrumbs > * {
                margin-top: 0;
                margin-bottom: 0;
                color: var(--primary-text-color);
                font-weight: normal;
            }
            :host .breadcrumb {
                padding-left: 10px;
                padding-right: 10px;
                border-radius: 3px;
                transition: all 0.2s linear;
            }
            :host .breadcrumb[data-page]:hover {
                color: var(--secondary-text-color);
                cursor: pointer;
            }
            :host .breadcrumb.dropover {
                background: var(--primary-text-color);
                color: var(--secondary-text-color);
            }
            :host([laptop-screen]) {
                --appsco-application-item: {
                    width: 131px;
                };

                --info-width: 290px;
            }
            :host([tablet-s1280-screen]) {
                --appsco-application-item: {
                    width: 141px;
                };

                --info-width: 318px;
            }
            :host([tablet-s1024-screen]) {
                --appsco-application-item: {
                    width: 127px;
                };

                --info-width: 290px;
            }
            :host([tablet-screen]) {
                --appsco-application-item: {
                    width: 140px;
                };
            }
            :host([mobile-screen]) {
                --applications-container: {
                    margin-right: -25px;
                    display: block;
                    @apply --layout-horizontal;
                    @apply --layout-around-justified;
                };
            }
            :host .info-shared-by {
                margin-top: 20px;
                color: var(--primary-text-color);
            }
        </style>

        <iron-ajax id="ironAjaxGetFolder" on-error="_onGetFolderError" on-response="_onGetFolderResponse" headers="[[ _headers ]]"></iron-ajax>

        <iron-ajax auto="" id="netscalerApiRequest" url="[[ netscalerApi ]]" on-error="_onError" on-response="_onResponseNetscaler" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <iron-media-query query="(max-width: 1366px)" query-matches="{{ laptopScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1280px)" query-matches="{{ tabletS1280Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1024px)" query-matches="{{ tabletS1024Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent">

            <div content="" slot="content">
                <div class="content-container">
                    <div class="breadcrumbs">
                        <h3 class="breadcrumb" on-tap="_onBreadcrumbAction" data-page="company-home" data-drop-to-zone="">Dashboard</h3>
                        <h3>/</h3>
                        <h3 class="breadcrumb">[[ folder.title ]]</h3>
                    </div>

                    <div class="items-container resources-container">
                        <appsco-applications id="appscoApplications" size="100" load-more="" is-on-company="" authorization-token="[[ authorizationToken ]]" applications-api="[[ _applicationsApi ]]" account="[[ account ]]" current-folder="[[ folder ]]" on-info="_onViewApplicationInfo" on-edit="_onApplicationEdit" on-edit-shared-application="_onEditSharedApplication" on-application="_onApplication" on-application-removed="_onApplicationRemoved" on-open-move-to-folder-dialog="_onOpenMoveToFolderDialog" on-loaded="_pageLoaded" on-empty-load="_pageLoaded"></appsco-applications>
                    </div>

                    <template is="dom-repeat" items="{{ _applications }}">

                        <appsco-application-item id="appscoApplicationItem_[[ index ]]" class="application-item citrix-item" application="{{ item }}" on-application="_onCitrixResourceAction" on-info="_onViewApplicationInfo"></appsco-application-item>

                    </template>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">

                <div class="info-header flex-horizontal">
                    <appsco-application-info class="flex" application="[[ application ]]">
                    </appsco-application-info>

                    <template is="dom-if" if="[[ application.claims.password ]]">
                        <appsco-application-security application="[[ application ]]"></appsco-application-security>
                    </template>
                </div>

                <div class="info-content flex-vertical">
                    <template is="dom-if" if="[[ !_shared ]]">
                        <appsco-application-subscribers application="[[ application ]]" authorization-token="[[ authorizationToken ]]" preview="">
                        </appsco-application-subscribers>
                    </template>

                    <template is="dom-if" if="[[ _shared ]]">
                        <template is="dom-if" if="[[ isOnPersonal ]]">
                            <div class="info-shared-by">
                                <template is="dom-if" if="[[ !application.application.company ]]">
                                    Shared by [[ application.application.added_by.display_name ]]
                                </template>
                                <template is="dom-if" if="[[ application.application.company ]]">
                                    Shared by [[ application.application.company.name ]]
                                </template>
                            </div>
                        </template>
                    </template>

                    <template is="dom-if" if="[[ !_shared ]]">
                        <paper-tabs id="paperTabs" selected="{{ _selectedTab }}">
                            <paper-tab name="details">Details</paper-tab>
                            <paper-tab name="log">Log</paper-tab>
                        </paper-tabs>

                        <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="info-details-section">

                            <div name="details" class="tab-content details">
                                <appsco-application-details application="[[ application ]]">
                                </appsco-application-details>
                            </div>

                            <div name="log" class="tab-content log">
                                <appsco-application-log application="[[ application ]]" authorization-token="[[ authorizationToken ]]">
                                </appsco-application-log>
                            </div>

                        </neon-animated-pages>
                    </template>

                    <template is="dom-if" if="[[ _shared ]]">
                        <div name="details">
                            <appsco-application-details application="[[ application ]]">
                            </appsco-application-details>
                        </div>
                    </template>
                </div>

                <template is="dom-if" if="[[ !_shared ]]">
                    <div class="info-actions flex-horizontal">
                        <paper-button class="button view-button flex" on-tap="_onApplicationInfoEdit">
                            Edit
                        </paper-button>

                        <paper-button class="button secondary-button flex" on-tap="_onShareApplication">
                            Share
                        </paper-button>
                    </div>
                </template>

                <template is="dom-if" if="[[ _editClaims ]]">
                    <div class="info-actions flex-horizontal">
                        <paper-button class="button view-button flex" on-tap="_onApplicationEditCredentials">
                            Edit Credentials
                        </paper-button>
                    </div>
                </template>

                <template is="dom-if" if="[[ application.permisions.revoke ]]">
                    <div class="info-actions flex-horizontal">
                        <paper-button class="button danger-button flex" on-tap="_onRevokeApplication">
                            Revoke
                        </paper-button>
                    </div>
                </template>

            </div>

        </appsco-content>

        <appsco-folders-application-add id="appscoFoldersApplicationAdd" authorization-token="[[ authorizationToken ]]" folders-api="[[ foldersApi ]]" api-errors="[[ apiErrors ]]">
        </appsco-folders-application-add>

        <appsco-application-share id="appscoApplicationShare" authorization-token="[[ authorizationToken ]]" accounts-api="[[ accountsApi ]]">
        </appsco-application-share>

        <appsco-application-settings-dialog id="appscoApplicationSettingsDialog" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" on-application-settings-saved="_onApplicationCredentialsChanged">
        </appsco-application-settings-dialog>

        <appsco-application-revoke id="appscoApplicationRevoke" authorization-token="[[ authorizationToken ]]">
        </appsco-application-revoke>

        <appsco-company-resource-settings-dialog id="appscoCompanyResourceSettingsDialog" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" domain="[[ domain ]]">
        </appsco-company-resource-settings-dialog>
`;
    }

    static get is() { return 'appsco-dashboard-folder-page'; }

    static get properties() {
        return {
            folder: {
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
                notify: true
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            isOnPersonal: {
                type: Boolean,
                value: false
            },

            domain: {
                type: String
            },

            foldersApi: {
                type: String,
                observer: '_onFoldersApiChanged'
            },

            companyFoldersApi: {
                type: String
            },

            accountsApi: {
                type: String
            },

            pageConfig: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _breadcrumbsDataPage: {
                type: String,
                computed: '_computeBreadcrumbsDataPage(isOnPersonal)'
            },

            _shared: {
                type: Boolean,
                computed: '_computeApplicationShared(application)',
                notify: true
            },

            _editClaims: {
                type: Boolean,
                computed: '_computeEditClaims(application)',
                notify: true
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _selectedTab: {
                type: Number
            },

            /**
             * Get applications from dashboard link.
             */
            _applicationsApi: {
                type: String,
                computed: '_computeApplicationsApi(folder)',
                observer: '_onApplicationsApiChanged'
            },

            netscalerApi: {
                type: String
            },

            _applications: {
                type: Array,
                value: function () {
                    return [];
                }
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

            tabletS1024Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletS1280Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            laptopScreen: {
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
            },

            toolbar: {
                type: Object
            },

            apiErrors: {
                type: Object
            },

            company: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, tabletS1024Screen, tabletS1280Screen, laptopScreen)',
            '_onPageConfigChanged(pageConfig, _breadcrumbsDataPage)'
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
            if (this.mobileScreen || this.tabletScreen || this.tabletS1024Screen || this.tabletS1280Screen || this.laptopScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('item-dropped', this._onItemDropped.bind(this));
        this.toolbar.addEventListener('search', this._onSearchApplications.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchApplicationsClear.bind(this));
    }

    _updateScreen() {
        this.updateStyles();
    }

    _computeApplicationsApi(folder) {
        return folder.meta ? folder.meta.applications : null;
    }

    _onApplicationsApiChanged(applicationsApi) {
        if (applicationsApi) {
            this.pageLoaded = false;
        }
    }

    _computeApplicationShared(application) {
        return application && !application.owner;
    }

    _computeEditClaims(application) {
        return application.permisions && application.permisions.edit_claims;
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
        this._initializeResourcesDragBehavior();
        this.initializeDropBehavior();
    }

    _onPageConfigChanged(newValue, breadcrumbsDataPage) {
        newValue = newValue[breadcrumbsDataPage];

        if (!newValue) {
            return false;
        }

        const appscoApplicationsComponent = this.$.appscoApplications;

        if (newValue.display_style) {
            appscoApplicationsComponent.setDisplayStyle(newValue.display_style);
        }

        if (newValue.sort_field && newValue.sort_ascending) {
            appscoApplicationsComponent.setSort({
                orderBy: newValue.sort_field,
                ascending: newValue.sort_ascending
            });
        }
    }

    _onFoldersApiChanged() {
        this._getFolder();
    }

    _getFolder() {
        if (!this.folder.self && this.foldersApi && this._headers) {
            const folderApi = this.foldersApi + this.route.path,
                getFolderRequest = this.$.ironAjaxGetFolder;

            if (getFolderRequest.lastRequest) {
                getFolderRequest.lastRequest.abort();
            }

            getFolderRequest.url = folderApi;
            getFolderRequest.generateRequest();
        }
    }

    _onGetFolderResponse(event) {
        if (200 === event.detail.status && event.detail.response) {
            this.setFolder(event.detail.response.dashboardGroup);
        }
    }

    _onGetFolderError(event) {
        if (!event.detail.request.aborted) {
            this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
        }
    }

    setFolder(folder) {
        this.set('folder', folder);
    }

    getFolder() {
        return this.folder;
    }

    initializePage() {
        this.setDefaultApplication();
        this.$.appscoApplications.initialize();
    }

    resetPage() {
        this.$.appscoApplications.reset();
        this._hideInfo();
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
        this._infoShown = true;
        this._selectedTab = 0;
    }

    _hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    toggleInfo() {
        this.$.appscoContent.toggleSection('info');
        this._infoShown = !this._infoShown;

        if (this._infoShown) {
            this._selectedTab = 0;
        }
    }

    _onViewApplicationInfo(event) {
        this.set('application', event.detail.application);

        if (!this._infoShown) {
            this._showInfo();
        }
    }

    _onApplicationEdit(event) {
        var application = event.detail.application;

        this.set('application', application);
        this.isOnPersonal ?
            this.dispatchEvent(new CustomEvent('edit-application', {
                bubbles: true,
                composed: true,
                detail: {
                    application: application
                }
            })) :
            this.dispatchEvent(new CustomEvent('edit-resource', {
                bubbles: true,
                composed: true,
                detail: {
                    resource: application
                }
            }));
    }

    _onApplicationInfoEdit() {
        this.isOnPersonal ?
            this.dispatchEvent(new CustomEvent('info-edit-application', {
                bubbles: true,
                composed: true,
                detail: {
                    application: this.application
                }
            })) :
            this.dispatchEvent(new CustomEvent('info-edit-resource', {
                bubbles: true,
                composed: true,
                detail: {
                    resource: this.application
                }
            }));
    }

    _onApplicationEditCredentials() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationSettingsDialog');
        dialog.setApplication(this.application);
        dialog.toggle();
    }

    _onApplication(event) {
        if(['unpw', 'item', 'none', 'saml', 'saml_dropbox', 'saml_office_365'].indexOf(event.detail.application.auth_type) > -1) {
            window.open(event.detail.application.meta.plugin_go, "_blank");
        } else {
            this._onViewApplicationInfo(event);
        }
    }

    _onCitrixResourceAction(event) {
        const application = event.detail.application;
        const a = document.createElement('a');
        const blob = new Blob([application.icocontent], {'type': 'application/octet-stream'});
        a.href = window.URL.createObjectURL(blob);
        a.download = application.title+'.ica';
        a.click();
    }

    _onShareApplication(event) {
        if (this.isOnPersonal) {
            const dialog = this.shadowRoot.getElementById('appscoApplicationShare');
            dialog.setApplication(this.application);
            dialog.toggle();
        }
    }

    _onRevokeApplication() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationRevoke');
        dialog.applicationInstance = this.application;
        dialog.open();
    }

    setApplication(application) {
        this.set('application', {});
        this.set('application', application);
        this.$.appscoApplications.modifyApplications([application]);
        this._initializeResourcesDragBehavior();
    }

    reloadApplications() {
        this.$.appscoApplications.reloadApplications();
    }

    addApplications(applications) {
        this.$.appscoApplications.addApplications(applications);
        this._initializeResourcesDragBehavior();
    }

    removeApplications(applications) {
        this.$.appscoApplications.removeApplications(applications);
        this._initializeResourcesDragBehavior();
    }

    _onApplicationRemoved() {
        this.setDefaultApplication();
    }

    setDefaultApplication() {
        this.set('application', this.$.appscoApplications.getFirstApplication());
    }

    filterApplicationsByTerm(term) {
        this.$.appscoApplications.filterByTerm(term);
    }

    addFolder(folder) {
        this.$.appscoFolders.addItems([folder]);
    }

    _onResponseNetscaler(e) {
        if (!e.detail.response) {
            return false;
        }

        const icons = e.detail.response.icons;

        icons.forEach(function(el) {
            const item = {
                application_url: el.imgsrc,
                icon_url: el.imgsrc,
                launchurl: el.launchurl,
                icocontent: el.icocontent,
                title: el.name
            };

            this.push('_applications', item);
        }.bind(this));
    }

    _initializeResourcesDragBehavior() {
        this.$.appscoApplications.initializeResourcesDragBehavior();
    }

    _onFolderAction(event) {
        this.dispatchEvent(new CustomEvent('folder-tapped', {
            bubbles: true,
            composed: true,
            detail: {
                folder: event.detail.item
            }
        }));
    }

    _onItemDropped(event) {
        const item = event.detail.item;
        this._removeResourceFromFolder(item);
    }

    _getRemoveResourceFromFolderApi(resource) {
        return (this.folder.self && resource.alias) ? (this.folder.self + '/resource/' + resource.alias) : null;
    }

    _removeResourceFromFolder(item) {
        const request = document.createElement('iron-request'),
            options = {
                url: this._getRemoveResourceFromFolderApi(item),
                method: 'DELETE',
                handleAs: 'json',
                headers: this._headers
            };

        if (!options.url) {
            return false;
        }

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('resource-removed-from-folder', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        resource: request.response,
                        folder: this.folder
                    }
                }));
            }
        }.bind(this), function() {
            this.dispatchEvent(new CustomEvent('resource-remove-from-folder-failed', {
                bubbles: true,
                composed: true,
                detail: {
                    resource: request.response,
                    folder: this.folder
                }
            }));
        }.bind(this));
    }

    _onBreadcrumbAction() {
        this.dispatchEvent(new CustomEvent('show-page', {
            bubbles: true,
            composed: true,
            detail: {
                page: this._breadcrumbsDataPage
            }
        }));
    }

    _computeBreadcrumbsDataPage(isOnPersonal) {
        return isOnPersonal ? 'home' : 'company-home';
    }

    _onOpenMoveToFolderDialog(event) {
        const applicationIcon = event.detail.applicationIcon,
            currentFolder = event.detail.currentFolder;

        const dialog = this.shadowRoot.getElementById('appscoFoldersApplicationAdd');
        dialog.setApplicationIcon(applicationIcon);
        dialog.setCurrentFolder(currentFolder);
        dialog.setCompany(this.company.company);
        dialog.toggle();
    }

    _computeFoldersApi(company) {
        return company && company.company ?
            this.companyFoldersApi :
            this.foldersApi;
    }

    _onSearchApplications(event) {
        this._showProgressBar();
        this.filterApplicationsByTerm(event.detail.term);
    }

    _onSearchApplicationsClear() {
        this.filterApplicationsByTerm('');
    }

    _onApplicationCredentialsChanged(event) {
        const application = event.detail.application,
            message = 'You successfully changed ' + application.title + ' credentials.';

        this._notify(message);
    }

    _onEditSharedApplication(event) {
        const dialog = this.shadowRoot.getElementById('appscoCompanyResourceSettingsDialog');
        dialog.setApplication(event.detail.application);
        dialog.toggle();
    }
}
window.customElements.define(AppscoDashboardFolderPage.is, AppscoDashboardFolderPage);
