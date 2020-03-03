import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-styles/shadow.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/report/appsco-compliance-report-accounts.js';
import './components/report/appsco-compliance-report-page-filters.js';
import './components/report/appsco-compliance-report-page-actions.js';
import { AppscoBehaviourReportPage } from './components/components/appsco-behavior-report-page.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoComplianceReportPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    NeonAnimationRunnerBehavior,
    AppscoBehaviourReportPage,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --content-background-color: #ffffff;
                --item-background-color: var(--body-background-color);
                --report-account-initials-background-color: var(--body-background-color-darker);
                --appsco-compliance-report-list-item: {
                    cursor: default;
                };
                --appsco-compliance-report-list-item-activated: {
                    @apply --shadow-elevation-2dp;
                };
            }
            :host div[resource] .resource-content {
                padding-top: 30px;
            }
            appsco-compliance-report-accounts {
                --list-container: {
                    min-height: 60px;
                };
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">
            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-content">
                    <appsco-compliance-report-page-filters id="complianceReportPageFilters" groups-api="[[ groupsApi ]]" authorization-token="[[ authorizationToken ]]" on-filter-compliance-report-by-account-term="_filterByTermAction" on-filter-compliance-report-by-assignee-type="_filterByAssigneeTypeAction" on-filter-compliance-report-by-group="_filterByGroupAction"></appsco-compliance-report-page-filters>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-compliance-report-accounts id="appscoComplianceReportRoles" type="account" size="100" load-more="" authorization-token="[[ authorizationToken ]]" list-api="[[ rolesApi ]]" api-errors="[[ _apiErrors ]]" number-of-resources-to-display="15" hidden\$="[[ !_rolesVisible ]]" on-list-loaded="_onAccountsLoadFinished" on-list-empty="_onAccountsLoadFinished"></appsco-compliance-report-accounts>

                    <appsco-compliance-report-accounts id="appscoComplianceReportContacts" type="contact" size="100" load-more="" authorization-token="[[ authorizationToken ]]" list-api="[[ contactsApi ]]" api-errors="[[ _apiErrors ]]" number-of-resources-to-display="15" hidden\$="[[ !_contactsVisible ]]" on-list-loaded="_onContactsLoadFinished" on-list-empty="_onContactsLoadFinished"></appsco-compliance-report-accounts>
                </div>
            </div>

        </appsco-content>
`;
    }

    static get is() { return 'appsco-compliance-report-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String,
                value: ''
            },

            groupsApi: {
                type: String
            },

            rolesApi: {
                type: String
            },

            contactsApi: {
                type: String
            },

            exportAccessReportApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
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

            pageLoaded: {
                type: Boolean,
                value: false
            },

            _rolesLoaded: {
                type: Boolean,
                value: false
            },

            _rolesVisible: {
                type: Boolean,
                value: true
            },

            _contactsLoaded: {
                type: Boolean,
                value: false
            },

            _contactsVisible: {
                type: Boolean,
                value: false
            },

            _pageReady: {
                type: Boolean,
                computed: '_computePageReadyState(_rolesLoaded, _contactsLoaded)',
                observer: '_onPageReadyChanged'
            },

            animationConfig: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, screen992)',
            '_toggleFilters(mobileScreen)'
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
            if (this.mobileScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish.bind(this));
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
    }

    _toggleFilters(mobile) {
        if (mobile) {
            this.hideResource();
        } else {
            this.showResource();
        }
    }

    hideResource() {
        this.$.appscoContent.hideSection('resource');
    }

    showResource() {
        this.$.appscoContent.showSection('resource');
    }

    resetPage() {
        this._reloadLists();
        this._hideContacts();
        this._showRoles();
        this._resetFilters();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    getFilters() {
        const filters = this.$.complianceReportPageFilters.getFilters(),
            data = {};
        switch (filters.type) {
            case 'users':
                data.assignee_type = 'user';
                break;

            case 'contacts':
                data.assignee_type = 'contact';
                break;
        }
        if (filters.group && filters.group.alias && filters.group.alias !== 'all') {
            data.groups = [filters.group.alias];
        }
        if (filters.term) {
            data.term = filters.term;
        }

        return data;
    }

    getFileName() {
        return 'Compliance Report.xlsx';
    }

    getOnSuccessEvent() {
        return 'export-compliance-report-finished';
    }

    getOnFailEvent() {
        return 'export-compliance-report-failed';
    }

    getFailMessage() {
        return 'Export of Compliance Report failed. Please contact AppsCo support.';
    }

    _updateScreen() {
        this.updateStyles();
    }

    _computePageReadyState(accounts, contacts) {
        return accounts && contacts;
    }

    _reloadLists() {
        this.$.appscoComplianceReportRoles.reloadItems();
        this.$.appscoComplianceReportContacts.reloadItems();
    }

    _resetFilters() {
        this.$.complianceReportPageFilters.reset();
    }

    _showRoles() {
        this._rolesVisible = true;
        this.animationConfig.entry.node = this.$.appscoComplianceReportRoles;
        this.playAnimation('entry');
    }

    _hideRoles() {
        this.animationConfig.exit.node = this.$.appscoComplianceReportRoles;
        this.playAnimation('exit', {
            activeList: 'roles'
        });
    }

    _showContacts() {
        this._contactsVisible = true;
        this.animationConfig.entry.node = this.$.appscoComplianceReportContacts;
        this.playAnimation('entry');
    }

    _hideContacts() {
        this.animationConfig.exit.node = this.$.appscoComplianceReportContacts;
        this.playAnimation('exit', {
            activeList: 'contacts'
        });
    }

    _onPageReadyChanged(pageReady) {
        if (pageReady) {
            this._onPageLoaded();
        }
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _onNeonAnimationFinish(event) {
        switch (event.detail.activeList) {
            case 'roles':
                this._rolesVisible = false;
                this._showContacts();
                break;
            case 'contacts':
                this._contactsVisible = false;
                this._showRoles();
                break;
            default:
                return false;

        }
    }

    _onAccountsLoadFinished() {
        this._rolesLoaded = true;
    }

    _onContactsLoadFinished() {
        this._contactsLoaded = true;
    }

    _filterByTermAction(event) {
        var term = event.detail.term;

        this.$.appscoComplianceReportRoles.filterByTerm(term);
        this.$.appscoComplianceReportContacts.filterByTerm(term);
    }

    _filterByAssigneeTypeAction(event) {
        switch (event.detail.type) {
            case 'users':
                this._hideContacts();
                break;
            case 'contacts':
                this._hideRoles();
                break;
            case 'all':
                this._showRoles();
                this._showContacts();
                break;
            default:
                return false;
        }
    }

    _filterByGroupAction(event) {
        var group = event.detail.group;

        this.$.appscoComplianceReportRoles.filterByGroup(group);
        this.$.appscoComplianceReportContacts.filterByGroup(group);
    }
}
window.customElements.define(AppscoComplianceReportPage.is, AppscoComplianceReportPage);
