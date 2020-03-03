import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/application/appsco-application-settings-card.js';
import '../components/application/appsco-application-subscribers.js';
import '../components/application/appsco-application-security.js';
import '../components/application/appsco-application-autologin.js';
import '../components/application/appsco-application-log.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationComponentsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                overflow-y: auto;
                @apply --layout-horizontal;
                @apply --layout-wrap;
                @apply --layout-justified;
                font-size: 14px;
                color: var(--primary-text-color);

                --paper-card: {
                     min-height: 150px;
                     box-sizing: border-box;
                 };
                --paper-card-content: {
                     min-height: 70px;
                     box-sizing: border-box;
                 };
                --paper-card-actions: {
                     padding: 0;
                     border-color: var(--divider-color);
                 };
                --paper-card-header-text: {
                     padding: 8px 16px;
                     font-size: 18px;
                     color: var(--primary-text-color);
                     border-bottom: 1px solid var(--divider-color);
                };

                --paper-button: {
                     padding: 6px 0;
                     margin: 0;
                     border-radius: 0;
                     width: 100%;
                     color: var(--primary-text-color);
                 };

                --application-details-value: {
                        font-size: 14px;
                 };
            }
            :host([col2]) {
                @apply --layout-start-justified;
            }
            :host > * {
                width: calc(100% / 3 - 10px);
                margin-bottom: 10px;
                @apply --layout-self-start;
            }
            :host([col2]) > * {
                width: calc(100% / 2 - 10px);
            }
            :host .details-subscribers, :host .security-autologin {
                @apply --layout-vertical;
            }
            appsco-application-settings-card {
                --appsco-application-icons-color: var(--app-secondary-color);

                --application-details-label: {
                     font-size: 12px;
                     line-height: 16px;
                 };
                --application-details-value: {
                     font-size: 14px;
                     line-height: 22px;
                 };
            }
            .appsco-application-log {
                --paper-card-content: {
                     min-height: 70px;
                     padding-top: 0;
                     padding-bottom: 0;
                 };
            }
            appsco-application-log {
                --application-log-progress: {
                     top: 4px;
                 };
                --application-log-item: {
                     padding: 16px 6px 6px 6px;
                 };
                --application-log-item-first: {
                     border-top: none;
                 };
                --appsco-list-item-date: {
                     top: 2px;
                 };
            }
            :host .details-subscribers, :host .security-autologin {
                margin-right: 10px;
            }
            :host .appsco-application-settings-card, :host .appsco-application-subscribers, :host .appsco-application-security {
                margin-bottom: 10px;
            }
            :host([medium-screen]) > * {
                width: calc(100% / 2 - 10px);
            }
            :host([medium-screen]) > .appsco-application-log {
                width: 100%;
            }
            :host([col2][medium-screen]) > .appsco-application-log {
                width: calc(100% / 2 - 10px);
            }
            :host([medium-screen]) .security-autologin {
                margin-right: 0;
            }
            :host([mobile-screen]) > * {
                width: 100%;
            }
            :host([mobile-screen]) .details-subscribers {
                margin-right: 0;
            }
            .message {
                @apply --info-message;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <div class="details-subscribers">
            <paper-card heading="Settings" class="appsco-application-settings-card">
                <div class="card-content">
                    <appsco-application-settings-card application="{{ application }}">
                    </appsco-application-settings-card>
                </div>

                <div class="card-actions">
                    <paper-button on-tap="_onManageApplicationSettings">Manage</paper-button>
                </div>
            </paper-card>

            <paper-card heading="Subscribers" class="appsco-application-subscribers">
                <div class="card-content">
                    <appsco-application-subscribers id="appscoApplicationSubscribers" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" preview="">
                    </appsco-application-subscribers>
                </div>

                <div class="card-actions">
                    <paper-button on-tap="_onAllSubscribers">ALL</paper-button>
                </div>
            </paper-card>
        </div>

        <template is="dom-if" if="[[ _isUnPwAuthType ]]">
            <div class="security-autologin">
                <paper-card heading="Security" class="appsco-application-security">
                    <div class="card-content">
                        <template is="dom-if" if="[[ application.claims ]]">
                            <appsco-application-security application="[[ application ]]" info=""></appsco-application-security>
                        </template>

                        <template is="dom-if" if="[[ !application.claims ]]">
                            <p class="message">
                                This resource doesn't have username and password.
                            </p>
                        </template>
                    </div>
                </paper-card>

                <paper-card heading="Autologin" class="appsco-application-autologin">
                    <div class="card-content">
                        <appsco-application-autologin application="[[ application ]]" authorization-token="[[ authorizationToken ]]" on-autologin-unavailable="_onAutologinUnavailable" on-autologin-changed="_onAutologinChanged"></appsco-application-autologin>

                        <template is="dom-if" if="[[ _autologinUnavailable ]]">
                            <p>Auto Login sign on method for this resource is unavailable.</p>
                        </template>

                        <template is="dom-if" if="[[ !_autologinUnavailable ]]">

                            <template is="dom-if" if="[[ _autologinItem ]]">
                                <p>Turn on Auto Login to automate sign-in process.</p>
                            </template>

                            <template is="dom-if" if="[[ !_autologinItem ]]">
                                <p>Turn off Auto Login if you prefer to choose login account manually after resource opens in browser.</p>
                            </template>

                        </template>
                    </div>
                </paper-card>
            </div>
        </template>

        <paper-card heading="Resource Log" class="appsco-application-log">
            <div class="card-content">
                <appsco-application-log id="appscoApplicationLog" size="5" application="[[ application ]]" authorization-token="[[ authorizationToken ]]"></appsco-application-log>
            </div>

            <div class="card-actions">
                <paper-button on-tap="_onAllLog">ALL</paper-button>
            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-application-components-page'; }

    static get properties() {
        return {
            col2: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * Indicates if it is medium screen size.
             * It uses iron-media-query.
             */
            mediumScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            /**
             * Selected application from search list.
             */
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true,
                observer: '_onApplicationChanged'
            },

            _isUnPwAuthType: {
                type: Boolean,
                computed: '_computeIsUnPwAuthType(application)'
            },

            _autologinUnavailable: {
                type: Boolean,
                value: false
            },

            _autologinItem: {
                type: Boolean,
                value: false
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready(){
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: dom(this.root).querySelectorAll('paper-card'),
                nodeDelay: 50,
                timing: {
                    delay: 200,
                    duration: 100
                }
            },
            'exit': [{
                name: 'hero-animation',
                id: 'hero',
                fromPage: this
            }, {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 500
                }
            }]
        };
    }

    _computeIsUnPwAuthType(application) {
        var isUnpw =
            application.auth_type &&
            (application.auth_type === 'unpw' || application.auth_type === 'item')
        ;
        this.col2 = !isUnpw;
        return isUnpw;
    }

    _setSharedElement(target) {

        while (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
            target = target.parentNode;
        }

        /**
         * Set hero animation element that is to be shared between pages.
         *
         * @type {{hero: *}}
         */
        this.sharedElements = {
            'hero': target
        };
    }

    _onApplicationChanged() {
        this._autologinUnavailable = false;
        this._autologinItem = this.application.auth_type == 'item';
    }

    _onManageApplicationSettings(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('application-settings', { bubbles: true, composed: true }));
    }

    _onAllSubscribers(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('all-subscribers', { bubbles: true, composed: true }));
    }

    _onAllLog(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('all-log', { bubbles: true, composed: true }));
    }

    _onAutologinUnavailable() {
        this._autologinUnavailable = true;
    }

    _onAutologinChanged() {
        this._autologinItem = !this._autologinItem;

        this.$.appscoApplicationLog.load();
    }
}
window.customElements.define(AppscoApplicationComponentsPage.is, AppscoApplicationComponentsPage);
