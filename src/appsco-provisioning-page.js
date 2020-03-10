import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './provisioning/appsco-active-integrations.js';
import './provisioning/appsco-provisioning-page-actions.js';
import './provisioning/appsco-add-integration.js';
import './components/integration/appsco-run-integration-force-sync.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoProvisioningPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --appsco-active-integration-item: {
                    cursor: default;
                };
                --appsco-active-integration-item-activated: {
                    @apply --shadow-elevation-2dp;
                };
                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };               
                --item-basic-info: {
                    padding: 0 10px;
                }
            }
            :host .item-info {
                padding: 0 10px;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent">

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-active-integrations id="appscoActiveIntegrations" type="integration" size="100" load-more="" authorization-token="[[ authorizationToken ]]" list-api="[[ activeIntegrationsApi ]]" api-errors="[[ apiErrors ]]" on-edit-item="_onIntegrationEditAction" on-list-loaded="_onIntegrationsLoadFinished" on-force-sync="_onIntegrationForceSync" on-list-empty="_onIntegrationsLoadFinished"></appsco-active-integrations>
                </div>
            </div>

        </appsco-content>

        <appsco-add-integration id="appscoAddIntegration" authorization-token="[[ authorizationToken ]]" available-integrations-api="[[ availableIntegrationsApi ]]" api-errors="[[ apiErrors ]]" on-integration-requested="_onIntegrationRequested">
        </appsco-add-integration>

        <appsco-run-integration-force-sync id="appscoRunIntegrationForceSync" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-integration-force-sync-done="_onForceSyncRun">
        </appsco-run-integration-force-sync>
`;
    }

    static get is() { return 'appsco-provisioning-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String
            },

            activeIntegrationsApi: {
                type: String
            },

            availableIntegrationsApi: {
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
            },

            pageLoaded: {
                type: Boolean,
                value: false
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

        this.pageLoaded = false;

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('add-integration', this._onAddIntegrationAction.bind(this));
    }

    reloadIntegrations() {
        this.$.appscoActiveIntegrations.reloadIntegrations();
    }

    setIntegration(integration) {
        this.$.appscoActiveIntegrations.modifyItems([integration]);
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _onIntegrationsLoadFinished() {
        this._pageLoaded();
    }

    _onIntegrationEditAction(event) {
        this.dispatchEvent(new CustomEvent('edit-integration', {
            bubbles: true,
            composed: true,
            detail: {
                integration: event.detail.item
            }
        }));
    }

    _onAddIntegrationAction() {
        this.shadowRoot.getElementById('appscoAddIntegration').open();
    }

    _onIntegrationRequested(event) {
        if (event.detail.authorizationUrl) {
            window.location.href = event.detail.authorizationUrl;
        }
    }

    _onIntegrationForceSync(event) {
        const dialog = this.shadowRoot.getElementById('appscoRunIntegrationForceSync');
        dialog.setIntegration(event.detail.integration);
        dialog.open();
    }

    _onForceSyncRun(event) {
        this._notify('Resync for ' + event.detail.integration.name + ' has been finished.');
    }
}
window.customElements.define(AppscoProvisioningPage.is, AppscoProvisioningPage);
