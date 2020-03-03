import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../components/components/appsco-date-format.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyDomainItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                color: var(--primary-text-color);
                font-size: 14px;
            }
            :host .item-progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --item-progress-bar;
            }
            .item {
                width: 100%;
                height: 70px;
                padding: 0 10px;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
                background-color: var(--item-background-color, #ffffff);
                border-radius: 3px;
                @apply --shadow-elevation-2dp;
                @apply --layout-horizontal;
                @apply --layout-center;
                transition: all 0.1s ease-out;
                @apply --appsco-company-domain-item;
            }
            .item:hover {
                @apply --shadow-elevation-4dp;
            }
            .domain-title {
                display: block;
                height: 32px;
                line-height: 16px;
            @apply --paper-font-common-base;
                font-size: 14px;
                font-weight: 400;
                overflow: hidden;
            }
            .actions {
            @apply --layout-horizontal;
            @apply --layout-center;
                position: absolute;
                right: 4px;
                bottom: 4px;
            }
            paper-button {
            @apply --paper-font-common-base;
            @apply --paper-font-common-nowrap;

                padding: 4px;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.018em;
                line-height: 18px;
                text-transform: uppercase;
            }
            paper-button[disabled] {
                background: transparent;
            }

            appsco-date-format {
                padding-left: 3px;
            }

            .domain-info {
                @apply --layout-vertical;
                @apply --layout-start;
                padding: 0 10px;
            }
            .domain-basic-info {
                width: 220px;
                @apply --domain-basic-info;
            }
            .domain-status-info {
                border-left: 1px solid var(--divider-color);
                @apply --domain-status-info;
            }
            .domain-basic-info .info-label, .domain-basic-info .info-value {
                width: 220px;
                @apply --paper-font-common-nowrap;
                @apply --domain-basic-info-values;
            }
            .domain-status-info .info-label, .domain-status-info .info-value {
                width: 220px;
                @apply --paper-font-common-nowrap;
                @apply --domain-status-info-values;
            }
            .domain-status-info .info-label {
                color: var(--app-primary-color);
            }
            .domain-status-info .not-sent {
                color: var(--app-danger-color);
            }
            .info-label {
                font-size: 16px;
                height: auto;
                line-height: normal;
            }
            .info-label.preview {
                font-size: 14px;
            }
            .info-value {
                display: block;
                font-size: 12px;
            }
            :host([screen1000]) .actions {
                @apply --layout-vertical;
            }
            :host([screen1000]) .item {
                height: 90px;
            }
            :host([screen1000]) .domain-basic-info {
                width: 170px;
            }
            :host([screen1000]) .info-label, :host([screen1000]) .info-value {
                width: 100%;
            }
            :host([mobile-screen]) .actions {
                display: none;
            }
            :host([mobile-screen]) .item {
                height: 70px;
            }
            :host([mobile-screen]) .domain-info {
                width: 50%;
            }
        </style>

        <iron-ajax id="getDomainStatus" url="[[ _domainStatusApiUrl ]]" headers="[[ _headers ]]" on-error="_onDomainStatusError" on-response="_onDomainStatusResponse" debounce-duration="300"></iron-ajax>

        <iron-media-query query="(max-width: 768px)" query-matches="{{ mobileScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1000px)" query-matches="{{ screen1000 }}"></iron-media-query>

        <template is="dom-if" if="[[ preview ]]">
            <span class="info-label domain-title preview">[[ domain.domain ]]</span>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="item">

                <paper-progress class="item-progress-bar" indeterminate="" hidden\$="[[ !_progressBarDisplay ]]"></paper-progress>

                <div class="domain-info domain-basic-info">
                    <span class="info-label domain-title">[[ domain.domain ]]</span>
                </div>

                <div class="domain-info domain-status-info">
                    <template is="dom-if" if="[[ _verified ]]">
                        <span class="info-label">Verified</span>
                        <span class="info-value">
                            Verified at:
                            <appsco-date-format date="[[ domain.verified_at.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>
                        </span>
                    </template>

                    <template is="dom-if" if="[[ !_verified ]]">
                        <span class="info-label not-sent">Not verified</span>
                        <span class="info-value">
                            Created at:
                            <appsco-date-format date="[[ domain.created_at.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>
                        </span>
                    </template>
                </div>

                <div class="actions">
                    <template is="dom-if" if="[[ !_verified ]]">
                        <paper-button class="appsco-company-domain-item-get-token" on-tap="_onGetToken">Get token</paper-button>
                        <paper-button class="appsco-company-domain-item-verify-token" on-tap="_onVerify">Verify</paper-button>
                    </template>

                    <paper-button on-tap="_onRemove">Remove</paper-button>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-company-domain-item'; }

    static get properties() {
        return {
            domain: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_domainChanged'
            },

            domainsApi: {
                type: String
            },

            /**
             * Indicates if domain should be in preview mode rather then full detailed view.
             */
            preview: {
                type: Boolean,
                value: false
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            screen1000: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _verificationAction: {
                type: Boolean,
                value: false
            },

            _verified: {
                type: Boolean,
                value: false
            },

            _domainStatusApiUrl: {
                type: String,
                computed: '_computeDomainStatusApi(domain)'
            },

            _progressBarDisplay: {
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
            '_updateScreen(mobileScreen, screen1000)'
        ];
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 200
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

        beforeNextRender(this, function() {
            if (this.mobileScreen || this.screen1000) {
                this.style.display = 'inline-block';
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this.playAnimation('entry');
        });
    }

    _updateScreen() {
        this.updateStyles();
    }

    _notifyDomainStatus() {
        this.domain.verified = this._verified;

        if (this._verificationAction) {
            const eventType = this._verified ? 'domain-verified' : 'domain-not-verified';
            this.dispatchEvent(new CustomEvent(eventType, {
                bubbles: true,
                composed: true,
                detail: {
                    domain: this.domain
                }
            }));
        }
    }

    _domainChanged(domain) {
        this._verified = domain.verified;
    }

    _computeDomainStatusApi(domain) {
        return domain.self ? (domain.self + '/verify') : null;
    }

    _showProgressBar() {
        this._progressBarDisplay = true;
    }

    _hideProgressBar() {
        setTimeout(function() {
            this._progressBarDisplay = false;
        }.bind(this), 500);
    }

    _checkDomainStatus() {
        this._showProgressBar();
        this.$.getDomainStatus.generateRequest();
    }

    _onDomainStatusError(event) {
        if (422 === event.detail.request.status) {
            this._verified = false;
            this._notifyDomainStatus();
        }

        this._hideProgressBar();
    }

    _onDomainStatusResponse(event) {
        if (event.detail.response && 200 === event.detail.status) {
            this._verified = true;
            this._notifyDomainStatus();
        }

        this._hideProgressBar();
    }

    _onGetToken(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('get-token', {
            bubbles: true,
            composed: true,
            detail: {
                domain: this.domain
            }
        }));
    }

    _onVerify() {
        this._verificationAction = true;
        this._checkDomainStatus();
    }

    _onRemove(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('remove', {
            bubbles: true,
            composed: true,
            detail: {
                domain: this.domain
            }
        }));
    }
}
window.customElements.define(AppscoCompanyDomainItem.is, AppscoCompanyDomainItem);
