import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../components/account/appsco-account-2fa-enable.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccount2faPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
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
                    @apply --full-page-paper-card-header-text;
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
            :host([mobile-screen]) {
                --account-2fa-enable-setup-icon: {
                     width: 32px;
                     height: 32px;
                     margin: 8px;
                 };
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <paper-card heading="Two-factor authentication" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction"></paper-icon-button>

            <div class="card-content layout vertical">

                <appsco-account-2fa-enable id="appscoAccount2FA" authorization-token="[[ authorizationToken ]]" two-fa-api="[[ twoFaApi ]]" two-fa-qr-api="[[ twoFaQrApi ]]" api-errors="[[ apiErrors ]]"></appsco-account-2fa-enable>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-account-2fa-page'; }

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

          twoFaApi: {
              type: String,
              notify: true
          },

          twoFaQrApi: {
              type: String,
              notify: true
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

          sharedElements: {
              type: Object
          },

          mobileScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
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

  resetPage() {
      this.$.appscoAccount2FA.reset();
  }

  _onClosePageAction() {
      this.resetPage();
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoAccount2faPage.is, AppscoAccount2faPage);
