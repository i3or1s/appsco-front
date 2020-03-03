import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationAnalyticsSecurity extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            @apply --appsco-application-analytics-security;
            }
            .security-score {
            @apply --paper-font-code1;
            @apply --layout;
            @apply --layout-center;
            @apply --layout-center-justified;
                width: 40px;
                height: 40px;
                box-sizing: border-box;
                border-radius: 50%;
                color: #ffffff;
            @apply --security-score;
            }
            :host([_strong]) .security-score {
                background-color: var(--strong-color, #0f9d58);
            }
            :host([_medium]) .security-score {
                background-color: var(--medium-color, #4285f4);
            }
            :host([_weak]) .security-score {
                background-color: var(--weak-color, #db4437);
            }
            .policies {
                margin-top: 10px;
            }
            .policy {
                margin-top: 5px;
                margin-bottom: 5px;
            }
        </style>

        <template is="dom-if" if="[[ !_message ]]">
            <div class="security-score">
                [[ _score ]]%
            </div>

            <template is="dom-if" if="[[ info ]]">
                <div class="policies">
                    <div class="policy">
                        Configured instances: [[ _security.info.configured ]]
                    </div>
                    <div class="policy">
                        Unconfigured instances: [[ _security.info.not_configured ]]
                    </div>
                    <div class="policy" hidden\$="[[ !_security.info.configured ]]">
                        Lowest score: [[ _security.info.lowest_score ]]%
                    </div>
                </div>
            </template>
        </template>

        <template is="dom-if" if="[[ _message ]]">
            <template is="dom-if" if="[[ info ]]">
                <p>[[ _message ]]</p>
            </template>
        </template>
`;
    }

    static get is() { return 'appsco-application-analytics-security'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onApplicationChanged'
            },

            _security: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onSecurityChanged'
            },

            _haveAssignees: {
                type: Boolean,
                computed: '_computeAssigness(application)'
            },

            /**
             * Indicates if info should be displayed beside security score.
             */
            info: {
                type: Boolean,
                value: false
            },

            _score: {
                type: Number,
                value: 0
            },

            _strong: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _medium: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _weak: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _message: {
                type: String
            }
        };
    }

    _computeAssigness(application) {
        return (application && application.security && (application.security.info.not_configured + application.security.info.configured) != 0);
    }

    _onApplicationChanged(application) {
        this.set('_security', application ? application.security : {});
    }

    _onSecurityChanged(security) {
        if (security && !this._haveAssignees) {
            this._message = 'You haven\'t shared this resource to anyone yet. Go and share it to your employees.';
            return false;
        }

        this._message = '';

        this._weak = false;
        this._medium = false;
        this._strong = false;

        if (security && security.score != 0) {
            const score = Math.round(security.score);

            this._score = score;

            if (score > 80) {
                this._strong = true;
                return false;
            }

            if (score > 60) {
                this._medium = true;
                return false;
            }

            this._weak = true;
        }
        else {
            this._score = 0;
            this._weak = true;
        }
    }
}
window.customElements.define(AppscoApplicationAnalyticsSecurity.is, AppscoApplicationAnalyticsSecurity);
