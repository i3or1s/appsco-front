import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoManageAccountTwofaPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
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

                --paper-card-header: {
                    @apply --full-page-paper-card-header-text;
                    border-bottom: 1px solid var(--divider-color);
                }
            }
            .page-close-action {
                @apply --page-close-action;
            }
            .info {
                @apply --info-message;
            }
            .reset-action {
                @apply --primary-button;
                display: inline-block;
                min-width: 100px;
            }
        </style>

            <paper-card heading="Two-Factor Authentication" id="card">
                <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction"></paper-icon-button>

                    <div class="card-content layout vertical">
                        <template is="dom-if" if="[[ _twoFaEnabled ]]">
                            <p class="info">
                                Resetting two-factor authentication will remove the user’s existing two-factor configuration
                                and force the user to set it up again on the next login to AppsCo.
                            </p>

                            <paper-button class="reset-action" on-tap="_onResetTwoFA">Reset</paper-button>
                        </template>

                        <template is="dom-if" if="[[ !_twoFaEnabled ]]">
                            <p class="info">  Two factor authentication for this user is disabled. </p>
                        </template>
                    </div>
            </paper-card>
`;
  }

  static get is() { return 'appsco-manage-account-twofa-page'; }

  static get properties() {
      return {
          role: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _twoFaEnabled: {
              type: Boolean,
              value: false
          },

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

  setTwoFAEnabled(twoFAEnabled) {
      this._twoFaEnabled = twoFAEnabled;
  }

  _onClosePageAction() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  _onResetTwoFA() {
      this.dispatchEvent(new CustomEvent('reset-role-two-fa', {
          bubbles: true,
          composed: true,
          detail: {
              role: this.role
          }
      }));
  }
}
window.customElements.define(AppscoManageAccountTwofaPage.is, AppscoManageAccountTwofaPage);
