import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../components/appsco-copy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './appsco-application-details-unpw.js';
import './appsco-application-details-cc.js';
import './appsco-application-details-passport.js';
import './appsco-application-details-securenote.js';
import './appsco-application-details-softwarelicence.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationDetails extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --appsco-application-details;
                display: none;

                --paper-icon-button: {
                    height: 18px;
                    width: 18px;
                    padding: 0;
                    color: var(--appsco-application-icons-color);
                    @apply --application-details-icon-button;
                };
            }

            :host div[label] {
                color: var(--secondary-text-color);
            @apply --paper-font-body1;
            @apply --application-details-label;
            }

            :host div[content] {
                color: var(--primary-text-color);
            @apply --layout-horizontal;
            @apply --layout-center;
            @apply --paper-font-subhead;
            @apply --application-details-value;
            }

            :host .flex {
            @apply --layout-flex;
            @apply --paper-font-common-nowrap;
            }

            :host > div {
                margin: 6px 0;
            }
        </style>
        <div>
            <div label="">Title</div>
            <div content="">
                <div class="flex">
                    [[ application.title ]]
                </div>
            </div>
        </div>
        <template is="dom-if" if="[[ _shouldShowUrl ]]">
            <div>
                <div label="">Url</div>
                <div content="">
                    <div class="flex">
                        [[ application.url ]]
                    </div>
                    <div>
                        <a href="[[ application.url ]]" target="_blank" rel="noopener noreferrer">
                            <paper-icon-button icon="icons:open-in-new"></paper-icon-button>
                        </a>
                    </div>
                </div>
            </div>
        </template>

        <template is="dom-if" if="[[ _unPwAuth ]]" restamp="">
            <appsco-application-details-unpw company="[[ application.application.company ]]" claims="[[ application.claims ]]"></appsco-application-details-unpw>
        </template>
        <template is="dom-if" if="[[ _itemAuth ]]" restamp="">
            <appsco-application-details-unpw company="[[ application.application.company ]]" claims="[[ application.claims ]]"></appsco-application-details-unpw>
        </template>
        <template is="dom-if" if="[[ _creditCardAuth ]]" restamp="">
            <appsco-application-details-cc claims="[[ application.claims ]]"></appsco-application-details-cc>
        </template>
        <template is="dom-if" if="[[ _loginAuth ]]" restamp="">
            <appsco-application-details-unpw company="[[ application.application.company ]]" claims="[[ application.claims ]]"></appsco-application-details-unpw>
        </template>
        <template is="dom-if" if="[[ _passportAuth ]]" restamp="">
            <appsco-application-details-passport claims="[[ application.claims ]]"></appsco-application-details-passport>
        </template>
        <template is="dom-if" if="[[ _secureNoteAuth ]]" restamp="">
            <appsco-application-details-securenote claims="[[ application.claims ]]"></appsco-application-details-securenote>
        </template>
        <template is="dom-if" if="[[ _softwareLicenceAuth ]]" restamp="">
            <appsco-application-details-softwarelicence claims="[[ application.claims ]]"></appsco-application-details-softwarelicence>
        </template>
`;
    }

    static get is() { return 'appsco-application-details'; }

    static get properties() {
        return {
            /**
             * [Application](https://developers.appsco.com/api/dashboard/id/icons/id) that is to be rendered
             */
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            company: {
                type: Boolean,
                value: false
            },

            _shouldShowUrl: {
                type: Boolean,
                computed: '_computeShouldShowUrl(application)'
            },

            _unPwAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'unpw')"
            },
            _itemAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'item')"
            },
            _creditCardAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'cc')"
            },
            _loginAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'login')"
            },
            _passportAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'passport')"
            },
            _secureNoteAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'securenote')"
            },
            _softwareLicenceAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, 'softwarelicence')"
            },

            _supportedAuthTypes: {
                type: Array,
                value: function () {
                    return [
                        'icon_item', 'icon_unpw', 'icon_saml', 'icon_jwt', 'icon_cc', 'icon_login',
                        'icon_passport', 'icon_securenote', 'icon_softwarelicence', 'icon_none'
                    ]
                }
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

        afterNextRender(this, function () {
            this._showApplicationDetails();
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('application-changed', this._onApplicationChanged);
        this.addEventListener('copied', this._onCopied);
    }

    _computeShouldShowUrl(applicationIcon) {
        return ['unpw', 'item', 'login', 'none'].indexOf(applicationIcon.auth_type) !== -1;
    }

    _computeAuthType(applicationIcon, authType) {
        return applicationIcon.auth_type === authType;
    }

    _onApplicationChanged() {
        this._showApplicationDetails();
    }

    _showApplicationDetails() {
        this.style.display = 'block';
        this.playAnimation('entry');
    }

    _onCopied(event) {
        event.stopPropagation();

        if (event.detail.name) {
            this.dispatchEvent(new CustomEvent('copied-application-attribute', {
                bubbles: true,
                composed: true,
                detail: {
                    application: this.application,
                    attribute: event.detail.name
                }
            }));
        }
    }
}
window.customElements.define(AppscoApplicationDetails.is, AppscoApplicationDetails);
