import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoReportDetails extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
                @apply --layout-vertical;
            }
            :host .details-info {
                margin: 2px 0;
                @apply --layout-horizontal;
                @apply --details-container;
            }
            :host .details-label, :host .details-value, :host appsco-resource-auth-type {
                font-size: 13px;
                color: var(--primary-text-color);
            }
            :host .details-label, :host appsco-resource-auth-type {
                @apply --details-label;
            }
            :host .details-value {
                @apply --details-value;
            }
            :host .auth-types {
                margin-top: 20px;
            }
            :host .subtitle {
                font-size: 14px;
                color: var(--primary-text-color);
            }
        </style>

        <iron-ajax id="getReportApiRequest" url="[[ reportApi ]]" headers="[[ _headers ]]" debounce-duration="300" on-error="_onGetReportError" on-response="_onGetReportResponse"></iron-ajax>

        <template is="dom-if" if="[[ _accessOrComplianceReport ]]">

            <div class="details-info">
                <div class="details-label">Users:&nbsp;</div>
                <div class="details-value">[[ _report.users ]]</div>
            </div>

            <div class="details-info">
                <div class="details-label">Contacts:&nbsp;</div>
                <div class="details-value">[[ _report.contacts ]]</div>
            </div>

            <div class="details-info">
                <div class="details-label">Shared resources:&nbsp;</div>
                <div class="details-value">[[ _report.shared ]]</div>
            </div>

            <div class="details-info">
                <div class="details-label">Unshared resources:&nbsp;</div>
                <div class="details-value">[[ _report.unshared ]]</div>
            </div>

            <template is="dom-if" if="[[ showAuthTypes ]]">
                <div class="auth-types">
                    <div class="subtitle">Authentication Types</div>

                    <template is="dom-repeat" items="[[ _report.authTypes ]]">
                        <div class="details-info">
                            <div class="details-label">
                                [[ item.type ]]:&nbsp;
                            </div>
                            <div class="details-value">[[ item.value ]]</div>
                        </div>
                    </template>

                    <div class="details-info">
                        <div class="details-label">Individual:&nbsp;</div>
                        <div class="details-value">[[ _report.individual ]]</div>
                    </div>
                </div>
            </template>
        </template>

        <template is="dom-if" if="[[ _policiesReport ]]">
            <div class="details-info">
                <div class="details-label">Number of enabled policies:&nbsp;</div>
                <div class="details-value">[[ _report.numberOfEnabled ]]</div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-report-details'; }

    static get properties() {
        return {
            report: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            reportApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            showAuthTypes: {
                type: Boolean,
                value: function () {
                    return {};
                }
            },

            _accessOrComplianceReport: {
                type: Boolean,
                computed: '_computeAccessOrComplianceReport(report)'
            },

            _policiesReport: {
                type: Boolean,
                computed: '_computePoliciesReport(report)'
            },

            _report: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _message: {
                type: String,
                value: ''
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 500
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 100
                }
            }
        };
    }

    static get observers() {
        return [
            '_onApiReadyForLoad(reportApi, _headers)'
        ];
    }

    reload() {
        this._generateNewRequest();
    }

    setReportApi(api) {
        this.set('reportApi', api);
    }

    _computeAccessOrComplianceReport(report) {
        return (-1 !== ['access-report', 'compliance-report'].indexOf(report.type));
    }

    _computePoliciesReport(report) {
        return (report.type === 'policies-report');
    }

    _showMessage(message) {
        this._message = message;
    }

    _hideMessage() {
        this._message = '';
    }

    _abortPreviousRequest() {
        const getReportApiRequest = this.$.getReportApiRequest;

        if (getReportApiRequest.lastRequest) {
            getReportApiRequest.lastRequest.abort();
        }
    }

    _generateNewRequest() {
        this.set('_report', {});
        this._abortPreviousRequest();
        this.$.getReportApiRequest.generateRequest();
    }

    _onApiReadyForLoad(api, headers) {
        if (api && headers) {
            this._generateNewRequest();
        }
    }

    _showDetails() {
        this.style.display = 'block';
        this.playAnimation('entry');
    }

    _fireAfterLoadEvent() {
        this.dispatchEvent(new CustomEvent('loaded', { bubbles: true, composed: true }));
    }

    _onGetReportError(event) {
        if (!event.detail.request.aborted) {
            this._showMessage(this.apiErrors.getError(event.detail.request.response.code));
        }

        this._fireAfterLoadEvent();
    }

    _onGetReportResponse(event) {
        const response = event.detail.response;

        if (response) {
            if (this._accessOrComplianceReport) {
                const authenticationTypes = response.auth_types;

                response.authTypes = [
                    {
                        type: 'SAML',
                        value: authenticationTypes['SAML']
                    },
                    {
                        type: 'Dropbox SAML',
                        value: authenticationTypes['Dropbox SAML']
                    },
                    {
                        type: 'Office365 SAML',
                        value: authenticationTypes['Office 365 SAML']
                    },
                    {
                        type: 'JWT',
                        value: authenticationTypes['JWT']
                    },
                    {
                        type: 'Auto Login',
                        value: authenticationTypes['Auto Login']
                    },
                    {
                        type: 'Form Fill',
                        value: authenticationTypes['Form Fill']
                    },
                    {
                        type: 'No Credentials',
                        value: authenticationTypes['No Credentials']
                    }
                ];

                this.set('_report', response);
            } else if (this._policiesReport) {
                const report = {
                    numberOfEnabled: 0
                };

                response.policies.forEach(function(policy) {
                    if ('active' === policy.status) {
                        report.numberOfEnabled++;
                    }
                });

                this.set('_report', report);
            }

            this._showDetails();
            this._fireAfterLoadEvent();
        }
    }
}
window.customElements.define(AppscoReportDetails.is, AppscoReportDetails);
