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
import './company/appsco-company-home-page-actions.js';
import './components/folder/appsco-add-folder.js';
import './components/folder/appsco-folders-remove.js';
import './components/folder/appsco-folders-rename.js';
import './components/folder/appsco-folders-application-add.js';
import './components/application/appsco-application-revoke.js';
import './application/appsco-application-settings-dialog.js';
import './components/application/appsco-application-share.js';
import './components/application/company/appsco-company-resource-settings-dialog.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { AppscoDropHTMLElementBehavior } from './components/components/appsco-drop-html-element-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyHomePage extends mixinBehaviors([
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
            appsco-application-share {
                --appsco-application-share-button: {
                    border-radius: 0;
                    margin: 0;
                    padding: 6px 12px;
                    background-color: var(--app-secondary-color);
                    color: #ffffff;
                    font-size: 14px;
                    height: 34px;
                };
            }
            appsco-application-details {
                --appsco-application-icons-color: var(--primary-text-color);
            }
            :host .items-container {
                margin-bottom: 30px;
            }
            :host .items-container .subtitle {
                margin-top: 0;
                margin-bottom: 10px;
                font-weight: normal;
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

            :host div#backgroundContainer {
                width: 50%;
                left: 25%;
                height: 25%;
                top: 45%;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                position: fixed;
                filter: grayscale(100%) opacity(30%);
                -webkit-filter: grayscale(100%) opacity(30%);
            }

            :host div.info-content{
                background-color: #f5f8fa;
            }
        </style>

        <iron-ajax auto="" id="netscalerApiRequest" url="[[ netscalerApi ]]" on-error="_onError" on-response="_onResponseNetscaler" headers="{{ _headers }}" debounce-duration="300"></iron-ajax>

        <iron-media-query query="(max-width: 1366px)" query-matches="{{ laptopScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1280px)" query-matches="{{ tabletS1280Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1024px)" query-matches="{{ tabletS1024Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent">

            <div content="" slot="content">

                <div id="backgroundContainer" class="background-container"></div>

                <div class="content-container">
                    <div class="items-container folders-container" hidden\$="[[ _foldersEmpty ]]">
                        <h4 class="subtitle">Folders</h4>
                        <appsco-folders
                            id="appscoFolders"
                            size="100"
                            type="folder"
                            load-more=""
                            authorization-token="[[ authorizationToken ]]"
                            list-api="[[ companyFoldersApi ]]"
                            on-list-loaded="_onFoldersLoaded"
                            on-list-empty="_onFoldersEmptyLoaded"
                            on-open-rename-folder-dialog="_onOpenRenameFolderDialog"
                            on-open-remove-folder-dialog="_onOpenRemoveFolderDialog"
                            on-item="_onFolderAction">
                        </appsco-folders>
                    </div>

                    <div class="items-container resources-container">
                        <h4 class="subtitle" hidden\$="[[ _foldersEmpty ]]">Resources</h4>
                        <appsco-applications
                            id="appscoApplications"
                            size="100"
                            load-more=""
                            is-on-company=""
                            authorization-token="[[ authorizationToken ]]"
                            applications-api="[[ applicationsApi ]]"
                            account="[[ account ]]"
                            on-info="_onViewApplicationInfo"
                            on-edit="_onApplicationEdit"
                            on-application="_onApplication"
                            on-application-removed="_onApplicationRemoved"
                            on-open-move-to-folder-dialog="_onOpenMoveToFolderDialog"
                            on-edit-shared-application="_onEditSharedApplication"
                            on-loaded="_onApplicationsLoaded"
                            on-empty-load="_onApplicationsLoaded">
                        </appsco-applications>
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

        <appsco-add-folder id="appscoAddFolder" authorization-token="[[ authorizationToken ]]" folders-api="[[ foldersApi ]]" api-errors="[[ apiErrors ]]" company="[[ company ]]" on-folder-added="_onFolderAdded">
        </appsco-add-folder>

        <appsco-folders-rename id="appscoFoldersRename" authorization-token="[[ authorizationToken ]]" folders-api="[[ foldersApi ]]" api-errors="[[ apiErrors ]]" on-folder-renamed="_onFolderRenamed">
        </appsco-folders-rename>

        <appsco-folders-remove id="appscoFoldersRemove" authorization-token="[[ authorizationToken ]]" folders-api="[[ foldersApi ]]" api-errors="[[ apiErrors ]]" on-folder-removed="_onFolderRemoved">
        </appsco-folders-remove>

        <appsco-application-revoke id="appscoApplicationRevoke" authorization-token="[[ authorizationToken ]]" on-application-instance-removed="_onApplicationInstanceRevoked">
        </appsco-application-revoke>

        <appsco-application-settings-dialog id="appscoApplicationSettingsDialog" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" on-application-settings-saved="_onApplicationCredentialsChanged">
        </appsco-application-settings-dialog>

        <appsco-application-share id="appscoApplicationShare" authorization-token="[[ authorizationToken ]]" accounts-api="[[ accountsApi ]]">
        </appsco-application-share>

        <appsco-company-resource-settings-dialog id="appscoCompanyResourceSettingsDialog" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" domain="[[ domain ]]">
        </appsco-company-resource-settings-dialog>
`;
    }

    static get is() { return 'appsco-company-home-page'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            company: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true,
                observer: '_companyChanged'
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            foldersApi: {
                type: String
            },

            accountsApi: {
                type: String
            },

            companyFoldersApi: {
                type: String,
                observer: '_companyFoldersApiChanged'
            },

            pageConfig: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onPageConfigChanged'
            },

            domain: {
                type: String
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

            applicationsApi: {
                type: String,
                observer: '_applicationsApiChanged'
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

            _foldersEmpty: {
                type: Boolean,
                value: true
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
                computed: '_computePageLoaded(_applicationsLoaded, _foldersLoaded)',
                observer: '_pageLoadedChanged'
            },

            _applicationsLoaded: {
                type: Boolean,
                value: false
            },

            _foldersLoaded: {
                type: Boolean,
                value: false
            },

            apiErrors: {
                type: Object
            },

            toolbar: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, tabletS1024Screen, tabletS1280Screen, laptopScreen)'
        ];
    }

    ready() {
        super.ready();

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
        this.toolbar.addEventListener('search', this._onSearchApplications.bind(this));
        this.toolbar.addEventListener('add-new-folder', this._onAddNewFolderAction.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchApplicationsClear.bind(this));
    }

    _companyFoldersApiChanged() {
        this._foldersLoaded = false;
        this._hideFolders();
    }

    _applicationsApiChanged() {
        this._applicationsLoaded = false;
    }

    _companyChanged() {
        if (!this.company.dashboard_image) {
            this.$.backgroundContainer.style.display = 'none';
            this.$.backgroundContainer.style.backgroundImage = null;
            return;
        }

        this.$.backgroundContainer.style.display = 'block';
        this.$.backgroundContainer.style.backgroundImage =  "url('" + this.company.dashboard_image + "')";
    }

    _updateScreen(mobile, tablet, tabletS1024Screen, tabletS1280Screen, laptop) {
        this.updateStyles();
    }

    _computeApplicationShared(application) {
        return false;// application && !application.owner;
    }

    _computeEditClaims(application) {
        return application.permisions && application.permisions.edit_claims;
    }

    _onFoldersLoaded() {
        this._foldersLoaded = true;
        this._showFolders();
    }

    _onFoldersEmptyLoaded() {
        this._foldersLoaded = true;
    }

    _onApplicationsLoaded() {
        this._applicationsLoaded = true;
    }

    _computePageLoaded(applicationsLoaded, foldersLoaded) {
        return applicationsLoaded && foldersLoaded;
    }

    _pageLoadedChanged(pageLoaded) {
        if (pageLoaded) {
            this._initializeFoldersView();
            this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
            this._initializeResourcesDragBehavior();
        }
    }

    initializePage() {
        this.setDefaultApplication();
        this.$.appscoApplications.initialize();
    }

    resetPage() {
        this.$.appscoApplications.reset();
        this.$.appscoFolders.resetAllItems();
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
        this.set('application', event.detail.application);
        this.dispatchEvent(new CustomEvent('edit-application', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.application
            }
        }));
    }

    _onApplicationInfoEdit() {
        this.dispatchEvent(new CustomEvent('info-edit-application', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.application
            }
        }));
    }

    _onApplicationEditCredentials() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationSettingsDialog');
        dialog.setApplication(this.application);
        dialog.toggle();
    }

    _onApplication(event) {
        if(['rdp', 'unpw', 'item', 'none', 'saml', 'saml_dropbox', 'saml_office_365', 'open_id', 'aurora_files'].indexOf(event.detail.application.auth_type) > -1) {
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

    _onShareApplication() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationShare');
        dialog.setApplication(this.application);
        dialog.toggle();
    }

    _onPageConfigChanged(newValue) {
        newValue = newValue[this.getAttribute('name')];

        if (!newValue) {
            return false;
        }

        const appscoApplicationsComponent = this.$.appscoApplications;

        if (newValue.display_style) {
            appscoApplicationsComponent.setDisplayStyle(newValue.display_style);
        }

        if (newValue.sort_field && 'undefined' !== typeof newValue.sort_ascending) {
            appscoApplicationsComponent.setSort({
                orderBy: newValue.sort_field,
                ascending: newValue.sort_ascending
            });
        }
    }

    setApplication(application) {
        this.application = application;
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
        this._showFolders();
        this.$.appscoFolders.addItems([folder]);
    }

    removeFolder() {
        this.$.appscoFolders.reloadItems();

        if (this.$.appscoFolders.getCurrentCount() > 0) {
            this._showFolders();
        } else {
            this._hideFolders();
        }
    }

    renameFolder() {
        this._showFolders();
        this.$.appscoFolders.reloadItems();
    }

    _onResponseNetscaler(e) {
        if (!e.detail.response) {
            return false;
        }
        const icons = e.detail.response.icons;
        icons.forEach(function(el, index) {
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

    _initializeFoldersView() {
        if (this.$.appscoFolders.getCurrentCount() > 0) {
            this._showFolders();
        } else {
            this._hideFolders();
        }
    }

    _showFolders() {
        this._foldersEmpty = false;
    }

    _hideFolders() {
        this._foldersEmpty = true;
    }

    _onFolderAction(event) {
        this.dispatchEvent(new CustomEvent('folder-tapped', {
            bubbles: true,
            composed: true,
            detail: {
                folder: event.detail.item,
                personal: false
            }
        }));
    }

    _onSearchApplications(event) {
        this._showProgressBar();
        this.filterApplicationsByTerm(event.detail.term);
    }

    _onOpenMoveToFolderDialog(event) {
        const applicationIcon = event.detail.applicationIcon,
            currentFolder = event.detail.currentFolder;

        const dialog = this.shadowRoot.getElementById('appscoFoldersApplicationAdd');
        dialog.setApplicationIcon(applicationIcon);
        dialog.setCurrentFolder(currentFolder);
        dialog.setCompany(this.company);
        dialog.toggle();
    }

    _onOpenRenameFolderDialog(event) {
        const folderItem = event.detail.folderItem,
            dialog = this.shadowRoot.getElementById('appscoFoldersRename');

        dialog.setFolderItem(folderItem);
        dialog.setCompany(this.company);
        dialog.toggle();
    }

    _onOpenRemoveFolderDialog(event) {
        const folderItem = event.detail.folderItem,
            dialog = this.shadowRoot.getElementById('appscoFoldersRemove');
        dialog.setFolderItem(folderItem);
        dialog.setCompany(this.company);
        dialog.toggle();
    }

    _onFolderRenamed(event) {
        const folder = event.detail.folder;

        this.renameFolder(folder);
        this._notify('Dashboard folder ' + folder.title + ' has been renamed.');
        this._hideProgressBar();
    }

    _onFolderRemoved(event) {
        const folder = event.detail.folder;

        this.removeFolder(folder);
        this._notify('Dashboard folder ' + folder.title + ' has been removed.');
        this._hideProgressBar();
    }

    _onAddNewFolderAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoAddFolder');

        if (dialog.$) {
            dialog.open();
        }
    }

    _onFolderAdded(event) {
        const folder = event.detail.folder;

        this.addFolder(folder);
        this._notify('Dashboard folder ' + folder.title + ' has been successfully created.');
    }

    _onSearchApplicationsClear() {
        this.filterApplicationsByTerm('');
    }

    _onRevokeApplication() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationRevoke');
        dialog.applicationInstance = this.application;
        dialog.open();
    }

    _onApplicationInstanceRevoked(event) {
        this.removeApplications([event.detail.applicationInstance]);
        this.setDefaultApplication();
        this._notify('You have successfully revoked access to ' + event.detail.applicationInstance.application.title + '.');
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
window.customElements.define(AppscoCompanyHomePage.is, AppscoCompanyHomePage);
