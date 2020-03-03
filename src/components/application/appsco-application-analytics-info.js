import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationAnalyticsInfo extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
                color: var(--primary-text-color);
            @apply --appsco-application-analytics-info;
            }
            .info {
            @apply --paper-font-body1;
            @apply --layout-horizontal;
                margin-top: 10px;
            @apply --analytics-info;
            }
            .info-content {
            @apply --layout-flex;
            }
            .info-icon {
                width: 16px;
                height: 18px;
                margin-right: 10px;
            }
            .info-lead {
                margin-bottom: 4px;
                font-size: 14px;
                font-weight: 500;
                line-height: 18px;
                text-transform: uppercase;
            }
            .info p {
                margin: 0;
                font-size: 12px;
                opacity: 0.8;
            }
            .message {
            @apply --paper-font-body1;
                margin-top: 20px;
                font-weight: 500;
            @apply --info-message;
            }
        </style>

        <template is="dom-if" if="{{ !_message }}">
            <div class="info">
                <iron-icon icon="icons:build" class="info-icon"></iron-icon>
                <div class="info-content">
                    <div class="info-lead">Configured instances:</div>
                    <p>[[ application.security.info.configured ]] out of [[ _totalInstances ]]</p>
                </div>
            </div>
        </template>

        <div class="info">
            <iron-icon icon="icons:create" class="info-icon"></iron-icon>
            <div class="info-content">
                <div class="info-lead">Modified:</div>
                <p>[[ _lastEditedDate ]] by [[ application.last_modified.account ]]</p>
            </div>
        </div>

        <div class="info">
            <iron-icon icon="social:person" class="info-icon"></iron-icon>
            <div class="info-content">
                <div class="info-lead">Last used by:</div>
                <p>[[ application.last_login ]]</p>
            </div>
        </div>

        <template is="dom-if" if="{{ !_message }}">
            <div class="info">
                <iron-icon icon="editor:pie-chart" class="info-icon"></iron-icon>
                <div class="info-content">
                    <div class="info-lead">Daily usage:</div>
                    <p>[[ _dailyUsage ]]</p>
                </div>
            </div>
        </template>

        <div class="info set-by-info">
            <iron-icon icon="icons:info-outline" class="info-icon"></iron-icon>
            <div class="info-content">
                <p>[[ _setByInfo ]]</p>
            </div>
        </div>


        <template is="dom-if" if="{{ _message }}">
            <p class="message">
                [[ _message ]]
            </p>
        </template>
`;
    }

    static get is() { return 'appsco-application-analytics-info'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onApplicationChanged'
            },

            _totalInstances: {
                type: Number,
                computed: '_computeTotalInstances(application)'
            },

            _setByInfo: {
                type: String,
                value: 'Resource is set to be configured by admin for all users.'
            },

            _lastEditedDate: {
                type: String,
                computed: '_computeLastEditedDate(application)'
            },

            _dailyUsage: {
                type: String,
                computed: '_computeDailyUsage(application)'
            },

            _message: {
                type: String
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

    _onApplicationChanged(application) {
        this._message = null;

        if (application) {
            if (application.security && (0 == this._totalInstances)) {
                this._message = 'Resource is not assigned to anyone yet.';
            }

            if ('individual' === application.claim_type) {
                this._setByInfo = 'Resource is set to be configured by users.';
            }
            else {
                this._setByInfo = 'Resource is set to be configured by admin for all users.';
            }

            if (application.self) {
                this._showAnalytics();
            }
        }
    }

    _computeTotalInstances(application) {
        return (application && application.security) ? application.security.info.configured + application.security.info.not_configured : 0;
    }

    _computeLastEditedDate(application) {
        return (application && application.last_modified) ? this._dateFormat(application.last_modified.date.date) : '';
    }

    _computeDailyUsage(application) {
        if (application && application.security) {
            const usage = Math.round(application.daily_usage / this._totalInstances * 100);

            return (0 === usage) ? 'There is no activity today' : usage + '%';
        }

        return '';
    }

    _showAnalytics() {
        this.style.display = 'block';
        this.playAnimation('entry');
    }

    _dateFormat(value) {
        if (value) {
            const options = {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric'
            };

            return (new Date(value)).toLocaleDateString('en', options);
        }
    }
}
window.customElements.define(AppscoApplicationAnalyticsInfo.is, AppscoApplicationAnalyticsInfo);
