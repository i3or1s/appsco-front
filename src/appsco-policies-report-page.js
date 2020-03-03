import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-styles/shadow.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/report/appsco-policy-report-roles.js';
import './components/report/appsco-policy-report-page-filters.js';
import './components/report/appsco-policy-report-page-actions.js';
import { AppscoBehaviourReportPage } from './components/components/appsco-behavior-report-page.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoPoliciesReportPage extends mixinBehaviors([
    NeonAnimatableBehavior,
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
            }
            :host div[resource] {
                height: 100%;
                overflow: auto;
            }
            :host div[resource] .resource-content {
                padding-top: 30px;
            }
            appsco-policy-report-roles {
                --list-container: {
                    padding-top: 0;
                    min-height: 60px;
                };

                --appsco-list-item: {
                    cursor: default;
                };
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">
            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-content">
                    <appsco-policy-report-page-filters id="policyReportPageFilters" policies-api="[[ policiesApi ]]" authorization-token="[[ authorizationToken ]]" on-filter-policies-report="_onFilterReportAction">
                    </appsco-policy-report-page-filters>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-policy-report-roles id="appscoPolicyReportRoles" type="policy-report" size="100" load-more="" authorization-token="[[ authorizationToken ]]" list-api="[[ _rolesApi ]]" policies-report-api="[[ policiesReportApi ]]" api-errors="[[ _apiErrors ]]" on-list-loaded="_onListLoaded" on-list-empty="_onPageLoaded" on-filter-done="_onPageLoaded"></appsco-policy-report-roles>
                </div>
            </div>

        </appsco-content>
`;
    }

    static get is() { return 'appsco-policies-report-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String,
                value: ''
            },

            policiesApi: {
                type: String
            },

            rolesApi: {
                type: String
            },

            policiesReportApi: {
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

            _rolesApi: {
                type: String,
                computed: '_computeRolesApi(rolesApi)'
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
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
    }

    hideResource() {
        this.$.appscoContent.hideSection('resource');
    }

    showResource() {
        this.$.appscoContent.showSection('resource');
    }

    resetPage() {
        this._reloadLists();
        this._resetFilters();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    getFilters() {
        var filters = this.$.policyReportPageFilters.getFilters(),
            roles = this.$.appscoPolicyReportRoles.getAllItems(),
            data = {
                limit: 1000
            };

        if(filters.policy.policy) {
            data.policy = filters.policy.policy;
        }
        if(filters.dateFrom) {
            data.from = filters.dateFrom;
        }
        if(filters.dateTo) {
            data.to = filters.dateTo;
        }

        if (0 < roles.length) {
            data.accounts = [];
            roles.forEach(function(role, i) {
                data.accounts.push(role.account.self);
            });
        }
        return data;
    }

    getFileName() {
        return 'Policy Report.xlsx';
    }

    getOnSuccessEvent() {
        return 'export-policies-report-finished';
    }

    getOnFailEvent() {
        return 'export-policies-report-failed';
    }

    getFailMessage() {
        return 'Export of Policies Report failed. Please contact AppsCo support.';
    }

    _computeRolesApi(rolesApi) {
        return rolesApi ? (rolesApi + '?filter=managed') : null;
    }

    _updateScreen() {
        this.updateStyles();
    }

    _toggleFilters(mobile) {
        if (mobile) {
            this.hideResource();
        } else {
            this.showResource();
        }
    }

    _reloadLists() {
        this.$.appscoPolicyReportRoles.reloadItems();
    }

    _resetFilters() {
        this.$.policyReportPageFilters.reset();
    }

    _onListLoaded() {
        this.$.appscoPolicyReportRoles.filterRoles({
            policy: {}
        });
        this._onPageLoaded();
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _onFilterReportAction(event) {
        this.$.appscoPolicyReportRoles.filterRoles(event.detail.filters);
        this._showProgressBar();
    }
}
window.customElements.define(AppscoPoliciesReportPage.is, AppscoPoliciesReportPage);
