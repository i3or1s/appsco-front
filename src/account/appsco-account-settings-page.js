import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../components/account/appsco-account-settings.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountSettingsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };

                --paper-card-header-text: {
                    @apply --full-page-paper-card-header-text;
                };
            }
            :host paper-card {
                @apply --full-page-paper-card;
            }
            .page-close-action {
                @apply --page-close-action;
            }
        </style>

        <paper-card heading="Settings" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_back"></paper-icon-button>

            <div class="card-content">
                <appsco-account-settings id="appscoAccountSettings" account="{{ account }}" authorization-token="[[ authorizationToken ]]" account-settings-api="[[ settingsApi ]]"></appsco-account-settings>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-account-settings-page'; }

  static get properties() {
      return {
          account: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          },

          authorizationToken: {
              type: String
          },

          /**
           * Save account settings link.
           */
          settingsApi: {
              type: String
          },

          animationConfig: {
              type: Object
          },

          sharedElements: {
              type: Object
          }
      };
  }

  ready(){
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

  _back() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  setPage() {
      this.$.appscoAccountSettings.setUp();
  }

  resetPage() {
      this.$.appscoAccountSettings.reset();
  }
}
window.customElements.define(AppscoAccountSettingsPage.is, AppscoAccountSettingsPage);
