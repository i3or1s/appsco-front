import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../components/application/company/appsco-company-resource-settings.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyResourceSettingsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };
            }
            :host paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    padding-bottom: 16px;
                    padding-top: 16px;
                    padding-left: 16px;
                    padding-right: 16px;
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
        </style>

        <paper-card heading="Settings" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction"></paper-icon-button>

            <div class="card-content layout vertical">
                <appsco-company-resource-settings id="appscoResourceSettings" resource="{{ resource }}" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" domain="[[ domain ]]"></appsco-company-resource-settings>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-company-resource-settings-page'; }

  static get properties() {
      return {
          resource: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          domain: {
              type: String
          },

          /**
           * Animation config with hero animation.
           */
          animationConfig: {
              type: Object
          },

          sharedElements: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': [{
              name: 'hero-animation',
              id: 'hero',
              toPage: this,
              timing: {
                  duration: 300
              }
          }, {
              name: 'fade-in-animation',
              node: this,
              timing: {
                  duration: 500
              }
          }],
          'exit': {
              name: 'slide-right-animation',
              node: this,
              timing: {
                  duration: 200
              }
          }
      };

      this.sharedElements = {
          'hero': this.$.card
      };
  }

  _onClosePageAction() {
      this.resetPage();
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  setPage() {
      this.$.appscoResourceSettings.setup();
  }

  resetPage() {
      this.$.appscoResourceSettings.reset();
  }
}
window.customElements.define(AppscoCompanyResourceSettingsPage.is, AppscoCompanyResourceSettingsPage);
