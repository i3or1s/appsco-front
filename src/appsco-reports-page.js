import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/report/appsco-report-details.js';
import './components/report/appsco-reports-list.js';
import { AppscoPageBehavior } from './components/components/appsco-page-behavior.js';
import { AppscoListObserverBehavior } from './components/components/appsco-list-observer-behavior.js';
import './components/report/appsco-reports-page-actions.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoReportsPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoPageBehavior,
    AppscoListObserverBehavior,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host .info-actions > .open-button {
                margin-right: 1px;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent">
            <div content="" slot="content">
                <div class="content-container">
                    <appsco-reports-list id="reportsList" type="reports" on-item="_onReportAction" on-component-ready="_onPageLoaded" on-list-loaded="_onPageLoaded" on-observable-list-empty="_onObservableItemListChange" on-observable-list-filled="_onObservableItemListChange">

                    </appsco-reports-list>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">
                <div class="info-header flex-horizontal">
                    <iron-icon icon="icons:description" class="info-icon"></iron-icon>
                    <span class="info-title flex">[[ report.title ]]</span>
                </div>

                <div class="info-content flex-vertical">
                    <appsco-report-details
                        id="appscoReportDetails"
                        report-api="[[ getAccessReportApi ]]"
                        authorization-token="[[ authorizationToken ]]"
                        api-errors="[[ apiErrors ]]"
                        show-auth-types="[[ _showAuthTypes ]]"
                        report="[[ report ]]"
                        on-loaded="_onPageLoaded">
                    </appsco-report-details>
                </div>

                <div class="info-actions flex-horizontal">
                    <paper-button class="button open-button flex" on-tap="_onOpenReportAction">
                        Open
                    </paper-button>

                    <paper-button class="button secondary-button flex" on-tap="_onExportReportAction">
                        Export
                    </paper-button>
                </div>
            </div>

        </appsco-content>
`;
    }

    static get is() { return 'appsco-reports-page'; }

    static get properties() {
        return {
            report: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            getAccessReportApi: {
                type: String
            },

            getPoliciesApi: {
                type: String
            },

            authorizationToken: {
                type: String,
                value: ''
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

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            _showAuthTypes: {
                type: Boolean,
                value: true
            },

            _infoVisible: {
                type: Boolean,
                value: false
            },

            items: {
                type: Array,
                value: function () {
                    return [
                        {
                            type: 'access-report',
                            icon: 'icons:description',
                            title: 'Access report',
                            description: 'This report shows which users and contacts have access to which resources.',
                            activated: false,
                            openEvent: 'open-access-report',
                            exportEvent: 'export-access-report',
                            self: 'access-report'
                        },
                        {
                            type: 'compliance-report',
                            icon: 'icons:description',
                            title: 'Compliance report',
                            description: 'This report shows which fields with personal data are used in each shared resource.',
                            activated: false,
                            openEvent: 'open-compliance-report',
                            exportEvent: 'export-compliance-report',
                            self: 'compliance-report'
                        },
                        {
                            type: 'policies-report',
                            icon: 'icons:description',
                            title: 'Policies report',
                            description: 'This report shows which policies are breached or broken.',
                            activated: false,
                            openEvent: 'open-policies-report',
                            exportEvent: 'export-policies-report',
                            self: 'policies-report'
                        }
                    ]
                }
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen)'
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
            this.initializePage();
        });
    }

    toggleInfo() {
        this.$.appscoContent.toggleSection('info');
        this._infoVisible = !this._infoVisible;

        if (this._infoVisible) {
            var report = JSON.parse(JSON.stringify(this.report));

            report.activated = true;
            this.set('report', {});
            this.set('report', report);
            this._setReportApi();
        }
        else {
            this.$.reportsList.deactivateItem(this.report);
            this._setDefaultReport();
        }
    }

    hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoVisible = false;
        this.$.reportsList.deactivateItem(this.report);
    }

    initializePage() {
        this._setDefaultReport();
        this.$.reportsList.addItems(this.items);
        this._setReportApi();
        this._reloadReportDetails();
    }

    resetPage() {
        this._resetPageActions();
        this.hideInfo();
    }

    _setReportApi() {
        const reportDetailsComponent = this.$.appscoReportDetails;

        if (this.report.type === 'policies-report') {
            reportDetailsComponent.setReportApi(this.getPoliciesApi + '?page=1&extended=1&limit=1000');
        } else {
            reportDetailsComponent.setReportApi(this.getAccessReportApi);
        }
    }

    _resetPageActions() {
        this.toolbar.resetPageActions();
    }

    _updateScreen() {
        this.updateStyles();
    }

    _reloadReportDetails() {
        this.$.appscoReportDetails.reload();
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _setDefaultReport() {
        this.set('report', JSON.parse(JSON.stringify(this.items[0])));
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
        this._infoVisible = true;
    }

    _handleInfo(report) {
        this.set('report', report);
        this._setReportApi();
        this.set('_showAuthTypes', 'access-report' === report.type);

        if (!this._infoVisible) {
            this._showInfo();
        }
    }

    _onViewInfo(event) {
        this._handleInfo(event.detail.item);
    }

    _onReportAction(event) {
        if (event.detail.item.activated) {
            this._onViewInfo(event);
        }
        else {
            this.hideInfo();
            this._setDefaultReport();
        }
    }

    _onOpenReportAction() {
        this.dispatchEvent(new CustomEvent(this.report.openEvent, { bubbles: true, composed: true }));
    }

    _onExportReportAction() {
        this.dispatchEvent(new CustomEvent(this.report.exportEvent, { bubbles: true, composed: true }));
    }

    _onObservableItemListChange(event, data) {
        if(data.type === 'reports') {
            this.setObservableType('reports-page');
            this.populateItems(data.items);
        }
        event.stopPropagation();
    }
}
window.customElements.define(AppscoReportsPage.is, AppscoReportsPage);
