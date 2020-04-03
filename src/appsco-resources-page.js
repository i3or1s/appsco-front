import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-request.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/application/appsco-application-info.js';
import './components/application/appsco-application-analytics-security.js';
import './components/application/appsco-application-analytics-info.js';
import './components/application/appsco-application-log.js';
import './components/orgunit/appsco-orgunit-tree.js';
import './components/application/company/appsco-application-assignees.js';
import './components/components/appsco-search.js';
import './components/group/appsco-company-groups.js';
import './components/application/company/appsco-company-resources.js';
import { AppscoPageBehavior } from './components/components/appsco-page-behavior.js';
import { AppscoListObserverBehavior } from './components/components/appsco-list-observer-behavior.js';
import './applications/appsco-resources-page-actions.js';
import './components/application/company/appsco-company-application-add.js';
import './components/application/company/appsco-company-sso-application-add.js';
import './components/application/company/appsco-company-application-remove.js';
import './components/resource/appsco-share-resource.js';
import './components/application/appsco-import-resources.js';
import './applications/appsco-dialog-application-company-add.js';
import './components/application/company/appsco-company-resource-settings-dialog.js';
import './lib/mixins/appsco-page-mixin.js';
import './lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoResourcesPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoPageBehavior,
    AppscoListObserverBehavior,
    Appsco.PageMixin,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };
                --item-basic-info: {
                    padding: 0 10px;
                };
                --application-log-item: {
                     padding-bottom: 6px;
                     font-size: 14px;
                };
                --application-details-label: {
                    font-size: 12px;
                };
                --application-details-value: {
                    font-size: 14px;
                };
            }
            appsco-company-groups {
                margin-top: 20px;

                --appsco-company-group-item: {
                    padding: 4px;
                    margin-bottom: 5px;
                };
            }
            .resource-content {
                margin-top: 20px;
            }
            appsco-application-analytics-security {
                --security-score: {
                     width: 32px;
                     height: 32px;
                     font-size: 14px;
                 };
            }
            :host div[info] .details-log {
                height: calc(100% - 50px - 70px - 34px);
            }
            :host .details-log paper-tabs {
                height: 32px;
                @apply --layout-flex-none;
                color: var(--primary-text-color);
            }
            :host div[info] .info-details-section {
                margin-top: 10px;
                height: 100%;
            }
            .tab-content {
                margin-top: 20px;
                @apply --paper-tabs-content-style;
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
            :host *[content-top] {
                border-bottom: 1px solid var(--divider-color);
            }
            :host .content-top-content p:last-child {
                margin-bottom: 0;
            }
            :host([mobile-screen]) {
                --resource-width: 100%;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <template is="dom-if" if="[[ !resourceAdmin ]]">
                <div class="flex-vertical" resource="" slot="resource">
                    <div class="resource-header">
                        Groups
                    </div>

                    <div class="resource-content">
                        <appsco-search id="appscoSearch" label="Search groups" on-search="_onSearchGroups" on-search-clear="_onSearchGroupsClear"></appsco-search>

                        <appsco-company-groups id="appscoCompanyGroups" list-api="[[ groupsApi ]]" authorization-token="[[ authorizationToken ]]" size="100" type="group" preview="" on-item="_onGroupSelected"></appsco-company-groups>
                    </div>
                </div>
            </template>

            <div content-top="" slot="content-top">
                <div class="content-top-header">
                    Additional options
                </div>

                <template is="dom-if" if="[[ _hasSamlIdp ]]">
                    <div class="content-top-content">
                        <p>
                            Your company has set an Identity Provider.
                            You can add different related applications to your company's resources
                            and share them with your employees.
                            When they log in to AppsCo using their identities,
                            they will be automatically logged in to all related apps as well.
                        </p>
                        <p>
                            This page enables you to select and add the applications
                            based on the integrations your company has.
                        </p>
                    </div>
                    <div class="content-top-actions flex-horizontal flex-end">
                        <paper-button class="action" on-tap="_onEditAdditionalOptionsAction">
                            Edit
                        </paper-button>
                    </div>
                </template>

                <template is="dom-if" if="[[ !_hasSamlIdp ]]">
                    <div class="content-top-content">
                        <p>
                            There are no additional options available at this time.
                        </p>
                    </div>
                </template>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-company-resources id="appscoResources" type="resource" size="100" min-search-term-length="2" load-more="" selectable="" authorization-token="[[ authorizationToken ]]" list-api="[[ companyResourcesApi ]]" api-errors="[[ apiErrors ]]" resource-admin="[[ resourceAdmin ]]" on-item="_onResourceAction" on-select-item="_onResourceSelectAction" on-resource-settings="_onEditSharedApplication" on-edit-item="_onResourceEditAction" on-items-removed="_onResourcesRemoved" on-list-loaded="_pageLoaded" on-list-empty="_onResourcesEmptyLoad" on-observable-list-empty="_onObservableItemListChange" on-observable-list-filled="_onObservableItemListChange"></appsco-company-resources>
                </div>
            </div>

            <template is="dom-if" if="[[ !resourceAdmin ]]" restamp="">
                <div class="flex-vertical" info="" slot="info">
                    <div class="info-header flex-horizontal">
                        <appsco-application-info class="flex" application="[[ resource ]]" company="">
                        </appsco-application-info>

                        <appsco-application-analytics-security application="[[ resource ]]"></appsco-application-analytics-security>
                    </div>

                    <div class="info-content">
                        <appsco-application-assignees id="appscoApplicationAssignees" application="[[ resource ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" size="5" preview="" auto-load=""></appsco-application-assignees>

                        <div class="details-log flex-vertical">
                            <paper-tabs id="paperTabs" selected="{{ _selectedTab }}">
                                <paper-tab name="info">Info</paper-tab>
                                <paper-tab name="log">Log</paper-tab>
                            </paper-tabs>

                            <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="info-details-section">

                                <div name="info" class="tab-content details">
                                    <appsco-application-analytics-info application="[[ resource ]]"></appsco-application-analytics-info>
                                </div>

                                <div name="log" class="tab-content log">
                                    <appsco-application-log application="[[ resource ]]" authorization-token="[[ authorizationToken ]]" company="">
                                    </appsco-application-log>
                                </div>
                            </neon-animated-pages>
                        </div>
                    </div>

                    <div class="info-actions flex-horizontal">
                        <paper-button class="button view-button flex" on-tap="_onResourceInfoEdit">
                            Edit
                        </paper-button>

                        <paper-button class="button secondary-button flex" on-tap="_onShareResource">
                            Share
                        </paper-button>
                    </div>

                </div>
            </template>

        </appsco-content>

        <appsco-company-application-remove id="appscoCompanyApplicationsRemove" applications="[[ _selectedApplications ]]" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]" api-errors="[[ apiErrors ]]" on-applications-remove-failed="_onApplicationsRemoveFailed">
        </appsco-company-application-remove>

        <appsco-company-application-add id="appscoCompanyApplicationsAdd" authorization-token="[[ authorizationToken ]]" applications-template-api="[[ applicationsTemplateApi ]]" add-application-api="[[ companyApplicationsApi ]]" link="[[ link ]]" item="[[ item ]]" on-application-added="_onCompanyApplicationAdded" on-application-claims-updated="_onCompanyApplicationClaimsUpdated">
        </appsco-company-application-add>

        <appsco-company-sso-application-add id="appscoCompanySSOApplicationsAdd" authorization-token="[[ authorizationToken ]]" applications-template-api="[[ applicationsTemplateApi ]]" add-application-api="[[ companyApplicationsApi ]]" link="[[ link ]]" item="[[ item ]]" on-application-added="_onCompanyApplicationAdded" on-application-claims-updated="_onCompanyApplicationClaimsUpdated">
        </appsco-company-sso-application-add>

        <appsco-share-resource 
            id="appscoShareResource"
            authorization-token="[[ authorizationToken ]]"
            get-roles-api="[[ companyRolesApi ]]"
            get-contacts-api="[[ companyContactsApi ]]"
            get-groups-api="[[ groupsApi ]]"
            api-errors="[[ apiErrors ]]">
        </appsco-share-resource>

        <appsco-import-resources id="appscoImportResources" authorization-token="[[ authorizationToken ]]" import-api="[[ companyImportResourcesApi ]]" on-import-finished="_onImportCompanyResourcesFinished">
        </appsco-import-resources>

        <appsco-dialog-application-company-add id="appscoDialogApplicationCompanyAdd" authorization-token="[[ authorizationToken ]]" add-application-api="[[ companyApplicationsApi ]]" on-application-added="_onCompanyApplicationAdded" on-application-claims-updated="_onCompanyApplicationClaimsUpdated">
        </appsco-dialog-application-company-add>

        <appsco-company-resource-settings-dialog id="appscoCompanyResourceSettingsDialog" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" domain="[[ domain ]]">
        </appsco-company-resource-settings-dialog>
`;
    }

    static get is() { return 'appsco-resources-page'; }

    static get properties() {
        return {
            resource: {
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

            item: {
                type: Object
            },

            link: {
                type: Object
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

            _orgUnits: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _bulkActions: {
                type: Boolean,
                value: false,
                notify: true
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _selectedTab: {
                type: Number
            },

            companyResourcesApi: {
                type: String
            },

            companyApi: {
                type: String
            },

            getCompanyIdpConfigListApi: {
                type: String
            },

            applicationsTemplateApi: {
                type: String
            },

            companyApplicationsApi: {
                type: String
            },

            companyRolesApi: {
                type: String
            },

            companyContactsApi: {
                type: String
            },

            companyImportResourcesApi: {
                type: String
            },

            domain: {
                type: String
            },

            _hasSamlIdp: {
                type: Boolean,
                value: false
            },

            _resourceSelectAction: {
                type: Number,
                value: 0
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
            },

            groupsApi: {
                type: String
            },

            _selectedFilter: {
                type: Number,
                value: 0,
                observer: '_onSelectedFilterChanged'
            },

            pageConfig: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onPageConfigChanged'
            }
        };
    }

    static get observers() {
        return [
            '_getHasSamlIdpRequest(getCompanyIdpConfigListApi, authorizationToken)',
            '_updateScreen(mobileScreen, tabletScreen)',
            '_hideFilters(mobileScreen)'
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
            if (this.mobileScreen || this.tabletScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this.set('_itemsComponent', this.$.appscoResources);
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('search', this._onSearchCompanyApplications.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchCompanyApplicationsClear.bind(this));
        this.toolbar.addEventListener('select-all-resources', this.selectAllItems.bind(this));
        this.toolbar.addEventListener('remove', this._onRemoveApplications.bind(this));
        this.toolbar.addEventListener('add-item-action', this._onAddCompanyItemAction.bind(this));
        this.toolbar.addEventListener('import-resources', this._onImportResourcesAction.bind(this));
        this.toolbar.addEventListener('share', this._onShareResources.bind(this));
    }

    _updateScreen(mobile, tablet) {
        this.updateStyles();
    }

    _hideFilters(mobile) {
        if (mobile) {
            this.hideResource();
        }
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    initializePage() {
        this.setDefaultResource();
        this._getHasSamlIdpRequest(this.getCompanyIdpConfigListApi, this.authorizationToken);
    }

    pageSelected () {
        this.reloadResources();
    }

    resetPage() {
        this._deselectAllItems();
        this.$.appscoResources.reset();
        this._resetFilters();
        this._resetPageActions();
        this.hideInfo();
    }

    removeResourceAssignee(resource, assignee) {
        if (resource.alias === this.resource.alias) {
            this.shadowRoot.getElementById('appscoApplicationAssignees').removeAssignee(assignee);
        }
    }

    _onObservableItemListChange(event, data) {
        if(data.type === 'resources') {
            this.setObservableType('resources-page');
            this.populateItems(data.items);
        }
        event.stopPropagation();
    }

    _onResourcesEmptyLoad() {
        this.hideInfo();
        this._pageLoaded();
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
        this._infoShown = true;
        this._selectedTab = 0;
    }

    hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
        this.$.appscoResources.deactivateItem(this.resource);
    }

    toggleInfo() {
        if (this.$.appscoResources.getAllItems().length > 0) {
            this.$.appscoContent.toggleSection('info');
            this._infoShown = !this._infoShown;

            if (this._infoShown) {
                this._selectedTab = 0;
            }
            else {
                this.$.appscoResources.deactivateItem(this.resource);
                this.setDefaultResource();
            }
        }

    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    hideResource() {
        this.$.appscoContent.hideSection('resource');
    }

    toggleAdditionalOptions() {
        this.$.appscoContent.toggleSection('content-top');
    }

    _onPageConfigChanged(newValue) {
        newValue = newValue[this.getAttribute('name')];

        if (!newValue) {
            return;
        }

        const appscoResourcesComponent = this.$.appscoResources;

        if (newValue.hide_resource_section) {
            this.$.appscoContent.hideSection('resource')
        } else {
            this.$.appscoContent.showSection('resource')
        }

        if (newValue.display_style) {
            appscoResourcesComponent.setDisplayStyle(newValue.display_style);
        }

        if (newValue.sort_field && 'undefined' !== typeof newValue.sort_ascending) {
            appscoResourcesComponent.setSort({
                orderBy: newValue.sort_field,
                ascending: newValue.sort_ascending
            });
        }
    }

    addGroup(group) {
        this.shadowRoot.getElementById('appscoCompanyGroups').addItems([group]);
    }

    removeGroup(group) {
        this.shadowRoot.getElementById('appscoCompanyGroups').removeItems([group]);
    }

    _handleResourceInfo(resource) {
        this.set('resource', resource);

        if (!this._infoShown) {
            this._showInfo();
        }
    }

    _onViewResourceInfo(event) {
        this._handleResourceInfo(event.detail.item);
    }

    _onResourceEditAction(event) {
        this.set('resource', event.detail.item);
        this.dispatchEvent(new CustomEvent('edit-resource', {
            bubbles: true,
            composed: true,
            detail: {
                resource: event.detail.item
            }
        }));
    }

    _onResourceInfoEdit() {
        this.dispatchEvent(new CustomEvent('info-edit-resource', {
            bubbles: true,
            composed: true,
            detail: {
                resource: this.resource
            }
        }));
    }

    _onResourceAction(event) {
        if (!this.resourceAdmin) {
            if (event.detail.item.activated) {
                this._onViewResourceInfo(event);
            }
            else {
                this.hideInfo();
                this.setDefaultResource();
            }
        }
    }

    _onResourceSelectAction(event) {
        const resource = event.detail.item;

        clearTimeout(this._resourceSelectAction);

        this._resourceSelectAction = setTimeout(function() {
            if (resource.selected) {
                this._showBulkActions();
            }
            else {
                const selectedResource = this.$.appscoResources.getFirstSelectedItem();
                for (const key in selectedResource) {
                    return false;
                }
                this._hideBulkActions();
            }
        }.bind(this), 10);

        this._handleItemsSelectedState();
    }

    _onShareResource() {
        const dialog = this.shadowRoot.getElementById('appscoShareResource');
        dialog.setResources([this.resource]);
        dialog.toggle();
        this._hideProgressBar();
    }

    reloadResources() {
        this.$.appscoResources.reloadItems();
    }

    addResources(resources) {
        this.$.appscoResources.addItems(resources);

        if (!this.resource) {
            this.set('resource', resources[resources.length - 1]);
        }
    }

    modifyResources(resources) {
        this.$.appscoResources.modifyItems(resources);
    }

    removeResources(resources) {
        this.$.appscoResources.removeItems(resources);
        this.setDefaultResource();
    }

    getSelectedResources() {
        return this.$.appscoResources.getSelectedItems();
    }

    _onResourcesRemoved() {
        this._hideBulkActions();
        this.setDefaultResource();
    }

    setDefaultResource() {
        this.set('resource', this.$.appscoResources.getFirstItem());
    }

    filterResourcesByTerm(term) {
        this.$.appscoResources.filterByTerm(term);
    }

    resetListFilters() {
        this._resetFilters();
        this.shadowRoot.getElementById('appscoSearch').reset();
        this._resetPageActions();
    }

    _onSelectedFilterChanged() {
        if (this.pageLoaded) {
            this.resetPage();
        }
    }

    _resetFilters() {
        if (this.shadowRoot.getElementById('appscoCompanyGroups')) {
            this.shadowRoot.getElementById('appscoCompanyGroups').reset();
        }
    }

    _searchGroups(term) {
        this.shadowRoot.getElementById('appscoCompanyGroups').filterByTerm(term);
    }

    _onSearchGroups(event) {
        this._searchGroups(event.detail.term);
    }

    _onSearchGroupsClear() {
        this.shadowRoot.getElementById('appscoSearch').reset();
        this._searchGroups('');
    }

    _loadResourcesForGroup(group) {
        this.$.appscoResources.filterByGroup(group);
    }

    _onGroupSelected(event) {
        this._loadResourcesForGroup(event.detail.item);
    }

    _onEditAdditionalOptionsAction() {
        this.dispatchEvent(new CustomEvent('edit-additional-options', { bubbles: true, composed: true }));
    }

    _getHasSamlIdpRequest(api, token) {
        if (!api || !token) {
            this._hasSamlIdp = false;
            return false;
        }

        const request = document.createElement('iron-request'),
            options = {
                url: api,
                method: 'GET',
                handleAs: 'json',
                headers: {
                    'Authorization': 'token ' + token
                }
            };

        request.send(options).then(function() {
            this._hasSamlIdp = (200 == request.status && (0 < request.response.meta.total));
        }.bind(this), function() {
            this._hasSamlIdp = false;
        }.bind(this));
    }

    _filterCompanyApplicationsByTerm(term) {
        this._showProgressBar();
        this.filterResourcesByTerm(term);
    }

    _onSearchCompanyApplications(event) {
        this._filterCompanyApplicationsByTerm(event.detail.term);
    }

    _onSearchCompanyApplicationsClear() {
        this._filterCompanyApplicationsByTerm('');
    }

    _onRemoveApplications() {
        const selectedApplications = this.getSelectedResources();

        if (selectedApplications.length > 0) {
            this.set('_selectedApplications', selectedApplications);
            this.shadowRoot.getElementById('appscoCompanyApplicationsRemove').toggle();
        }
    }

    _onApplicationsRemoveFailed() {
        this.set('_selectedApplications', []);
        this._notify('An error occurred. Selected resources were not removed from the company. Please try again.');
    }

    _onAddCompanyItemAction(event) {
        const action = event.detail.action,
            applicationTemplate = event.detail.applicationTemplate;

        switch (action) {
            case 'sso-application':
                const ssoDialog = this.shadowRoot.getElementById('appscoCompanySSOApplicationsAdd');
                ssoDialog.setAction(action);
                ssoDialog.toggle();
                break;
            case 'catalogue-application':
                const catalogDialog = this.shadowRoot.getElementById('appscoCompanyApplicationsAdd')
                catalogDialog.setAction(action);
                catalogDialog.toggle();
                break;
            default:
                const request = document.createElement('iron-request'),
                    options = {
                        url: this.domain + applicationTemplate,
                        method: 'GET',
                        handleAs: 'json',
                        headers: this._headers
                    };

                request.send(options).then(function() {
                    if (200 === request.status) {
                        const dialog = this.shadowRoot.getElementById('appscoDialogApplicationCompanyAdd');
                        dialog.setApplicationTemplate(request.response.application);
                        dialog.setAction(action);
                        dialog.toggle();
                    }

                }.bind(this));
                break;
        }
    }

    _onCompanyApplicationAdded(event) {
        const application = event.detail.application,
            message = application.title + ' was successfully saved.';
        if ('none' === application.auth_type) {
            this.addResources([application]);
        }
        this._notify(message);
    }

    _onCompanyApplicationClaimsUpdated (event) {
        const application = event.detail.application,
            applications = [application];
        this.addResources(applications);
    }

    _onShareResources() {
        const selectedApplications = this.getSelectedResources();

        if (selectedApplications.length > 0) {
            const dialog = this.shadowRoot.getElementById('appscoShareResource');
            dialog.setResources(selectedApplications);
            dialog.toggle();
            this._hideProgressBar();
        }
    }

    _onImportResourcesAction() {
        this.shadowRoot.getElementById('appscoImportResources').toggle();
    }

    _onImportCompanyResourcesFinished(event) {
        const response = event.detail.response;
        let message = response.numberOfCustomApplications + response.numberOfSecureNotes + ' resources imported out of '
            + response.total + ', '
            + response.numberOfCustomApplications + ' custom applications created, '
            + response.numberOfSecureNotes + ' secure notes created, '
            + 'number of failed imports ' + response.numberOfFailed + '.';

        if (0 < response.numberOfCustomApplications || 0 < response.numberOfSecureNotes) {
            this.reloadResources();
        }

        this._notify(message, true);
    }

    _onEditSharedApplication(event) {
        const dialog = this.shadowRoot.getElementById('appscoCompanyResourceSettingsDialog');
        dialog.setApplication(event.detail.application);
        dialog.toggle();
    }
}
window.customElements.define(AppscoResourcesPage.is, AppscoResourcesPage);
