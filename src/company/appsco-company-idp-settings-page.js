import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/slide-down-animation.js';
import '@polymer/neon-animation/animations/slide-from-bottom-animation.js';
import './appsco-company-idp-settings.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyIdpSettingsPage extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };
            }
            paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    color: var(--primary-text-color);
                    @apply --full-page-paper-card-header-text;
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
        </style>

        <paper-card heading="IdP settings" id="card" class="company-idp-settings-card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction"></paper-icon-button>

            <div class="card-content">
                <appsco-company-idp-settings id="appscoCompanyIdPSettings" company="[[ company ]]" authorization-token="[[ authorizationToken ]]" id-p-integrations-api="[[ idPIntegrationsApi ]]" api-errors="[[ apiErrors ]]" on-idp-settings-saved="_onIdPSettingsSaved"></appsco-company-idp-settings>
            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-company-idp-settings-page'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            authorizationToken: {
                type: String
            },

            idPIntegrationsApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
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
                name: 'slide-from-bottom-animation',
                node: this,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'slide-down-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };
    }

    setDomain(domain) {
        this.$.appscoCompanyIdPSettings.setDomain(domain);
    }

    setupPage() {
        this.$.appscoCompanyIdPSettings.setup();
    }

    resetPage() {
        this.$.appscoCompanyIdPSettings.reset();
    }

    _onClosePageAction() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    _onIdPSettingsSaved() {
        this._onClosePageAction();
    }
}
window.customElements.define(AppscoCompanyIdpSettingsPage.is, AppscoCompanyIdpSettingsPage);
