import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-progress/paper-progress.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoIntegrationWebhooksCard extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --appsco-integration-webhooks-card;
            }
            .message {
                @apply --info-message;
            }
            .progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-list-progress-bar;
            }
            .info {
                @apply --info-message;
            }
        </style>

        <div>
            <iron-ajax id="getIntegrationWebhooksApiRequest" url="[[ webhookApi ]]" headers="[[ _headers ]]" debounce-duration="300" on-error="_onError" on-response="_onResponse"></iron-ajax>

            <paper-progress id="paperProgress" class="progress-bar" indeterminate=""></paper-progress>

            <p class="info">
                Webhooks are system events. They are triggered by some event, such as "user added" or "user removed".
                In this section, you can setup AppsCo to listen to these events and run one of the pre-defined rules.
            </p>
            <p class="info">
                Once event occurred in the integrating system, AppsCo will be notified by the system and run the rule that is defined for the specific event.
            </p>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

        </div>
`;
  }

  static get is() { return 'appsco-integration-webhooks-card'; }

  static get properties() {
      return {
          webhookApi: {
              type: String,
              observer: '_onWebhookApiChanged'
          },

          _message: {
              type: String,
              value: ''
          },

          _webhooks: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _loaders: {
              type: Array,
              value: function () {
                  return [];
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

      afterNextRender(this, function() {
          this._showWebhookDetails();
      });
  }

  _onWebhookApiChanged(url) {
      if (url && url.length > 0) {
          this._loadWebhooks();
      } else {
          this._onError();
      }
  }

  _showWebhookDetails() {
      this.style.display = 'block';
      this.playAnimation('entry');
  }

  _handleEmptyLoad() {
      this._hideProgressBar();
      this.dispatchEvent(new CustomEvent('empty-load', { bubbles: true, composed: true }));
  }

  loadWebhooks() {
      this._loadWebhooks();
  }

  _loadWebhooks() {
      this._showProgressBar();
      this._clearWebhooks();
      this.$.getIntegrationWebhooksApiRequest.generateRequest();
  }

  _onError() {
      this._message = 'We couldn\'t load webhooks at the moment. Please try again in a minute.';
      this._hideProgressBar();
      this.dispatchEvent(new CustomEvent('webhooks-load-error', { bubbles: true, composed: true }));
  }

  _clearWebhooks() {
      this._clearLoaders();
      this.set('_webhooks', []);
      this.set('_message', '');
  }

  _clearLoaders() {
      for (const idx in this._loaders) {
          clearTimeout(this._loaders[idx]);
      }
      this.set('_loaders', []);
  }

  _onResponse(event) {
      const response = event.detail.response;
      if (response && response.web_hooks) {
          const webhooks = response.web_hooks,
              meta = response.meta,
              webhooksCount = webhooks.length - 1;

          if (meta.total === 0) {
              this._message = 'There are no webhooks for this integration.';
              this._handleEmptyLoad();
              this._fireWebHooksLoadedEvent(webhooks);
              return false;
          }

          this._clearWebhooks();

          this._message = "";
          webhooks.forEach(function(el, index) {
              this._loaders.push(setTimeout(function() {
                  this.push('_webhooks', el);

                  if (index === webhooksCount) {
                      this._hideProgressBar();
                      this.dispatchEvent(new CustomEvent('loaded', {
                          bubbles: true,
                          composed: true,
                          detail: {
                              webhooks: webhooks
                          }
                      }));
                  }
              }.bind(this), (index + 1) * 30));
          }.bind(this));
          this._fireWebHooksLoadedEvent(webhooks);
      }
  }

  _fireWebHooksLoadedEvent(webHooks) {
      this.dispatchEvent(new CustomEvent('web-hooks-loaded', {
          bubbles: true,
          composed: true,
          detail: {
              web_hooks: webHooks
          }
      }));
  }

  _showProgressBar() {
      this.shadowRoot.getElementById('paperProgress').hidden = false;
  }

  _hideProgressBar() {
      setTimeout(function() {
          this.shadowRoot.getElementById('paperProgress').hidden = true;
      }.bind(this), 300);
  }
}
window.customElements.define(AppscoIntegrationWebhooksCard.is, AppscoIntegrationWebhooksCard);
