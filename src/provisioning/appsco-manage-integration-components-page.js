import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/integration/appsco-integration-settings-card.js';
import '../components/integration/appsco-integration-rules-card.js';
import '../components/integration/appsco-integration-webhooks-card.js';
import '../components/page/appsco-layout-with-cards-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoManageIntegrationComponentsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-layout-with-cards-styles"></style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="cols-layout two-cols-layout">
            <div class="col">
                <paper-card heading="Settings" class="card appsco-integration-settings-card">
                    <div class="card-content">
                        <appsco-integration-settings-card>
                        </appsco-integration-settings-card>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageIntegrationSettings">Manage</paper-button>
                    </div>
                </paper-card>

                <template is="dom-if" if="[[ _isRA ]]">
                    <paper-card heading="Webhooks" class="card appsco-integration-webhooks-card">
                        <div class="card-content">
                            <appsco-integration-webhooks-card id="appscoIntegrationWebhooksCard" authorization-token="[[ authorizationToken ]]" webhook-api="[[ webhookApi ]]" on-web-hooks-loaded="_onWebHooksLoaded">
                            </appsco-integration-webhooks-card>
                        </div>
                        <template is="dom-if" if="[[ _showManageWebHooks ]]">
                            <div class="card-actions">
                                <paper-button on-tap="_onManageWebhooks">Manage</paper-button>
                            </div>
                        </template>
                    </paper-card>
                </template>
            </div>

            <div class="col">
                <paper-card heading="Rules" class="card appsco-integration-rules-card">
                    <div class="card-content">
                        <appsco-integration-rules-card>
                        </appsco-integration-rules-card>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageIntegrationRules">Manage</paper-button>
                    </div>
                </paper-card>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-manage-integration-components-page'; }

  static get properties() {
      return {
          integration: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          webhookApi: {
              type: String
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          _isRA: {
              type: Boolean,
              computed: '_computeIsRA(integration)'
          },

          _showManageWebHooks: {
              type: Boolean,
              value: false
          },

          mediumScreen: {
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
          }
      };
  }

  ready() {
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

  _setSharedElement(target) {

      if (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
          target = target.parentNode;
      }

      this.sharedElements = {
          'hero': target
      };
  }

  _onManageIntegrationSettings(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-integration-settings', { bubbles: true, composed: true }));
  }

  _onManageIntegrationRules(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-integration-rules', { bubbles: true, composed: true }));
  }

  _onManageWebhooks(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-integration-webhooks', { bubbles: true, composed: true }));
  }

  _onWebHooksLoaded(event) {
      (event.detail.web_hooks.length > 0) ? this._showManageWebHooks = true : this._showManageWebHooks = false;
  }

  _computeIsRA(integration) {
      return integration.kind === 'ra';
  }
}
window.customElements.define(AppscoManageIntegrationComponentsPage.is, AppscoManageIntegrationComponentsPage);
