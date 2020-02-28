import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '../components/account/appsco-account-2fa-enable.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccount2faManage extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
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
            :host .danger {
                color: var(--app-danger-color);
            }
            :host ul li {
                float: left;
                margin-right:20px;
                width: 70px;
            }
        </style>

        <paper-card heading="Two-factor authentication" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onBackAction"></paper-icon-button>

            <div class="card-content layout vertical">
                <p>
                    <iron-icon icon="icons:check"></iron-icon>Two-factor authentication is currently enabled.
                    <paper-button class="danger" on-tap="_onDisableAction">Disable</paper-button>
                </p>

                <h2>Recovery codes</h2>
                <p>
                    Recovery codes can be used to access your account in the event you lose access to your device and cannot
                    receive two-factor authentication codes.
                    Appsco Support cannot restore access to your accounts with
                    two-factor authentication enabled for security reasons.
                    Saving your recovery codes in a safe place can keep you from being locked out of your account.
                </p>

                <paper-button on-tap="_toggleRecoveryCodes">VIEW RECOVERY CODES</paper-button>

                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                <div hidden="[[ recoveryCodes ]]">
                    <ul>
                        <template is="dom-repeat" items="{{ _codes }}">
                            <li>[[ item ]]</li>
                        </template>
                    </ul>
                </div>
            </div>
        </paper-card>
`;
  }

  static get is() { return 'appsco-account-2fa-manage'; }

  static get properties() {
      return {
          account: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          },

          twoFaApi: {
              type: String,
              notify: true
          },

          twoFaQrApi: {
              type: String,
              notify: true
          },

          twoFaCodesApi: {
              type: String,
              notify: true
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          recoveryCodes: {
              type: Boolean,
              value: true
          },

          _codes: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _errorMessage: {
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

  _showError(message) {
      this._errorMessage = message;
  }

  _hideError() {
      this._errorMessage = '';
  }

  _onBackAction() {
      this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  _toggleRecoveryCodes() {

      if (this._codes.length > 0) {
          this.recoveryCodes = !this.recoveryCodes;
          return false;
      }

      var request = document.createElement('iron-request'),
          options = {
              url: this.twoFaCodesApi,
              method: 'GET',
              handleAs: 'json',
              headers: this._headers
          };

      request.send(options).then(function() {

          if (200 === request.status) {
              this.set('_codes', request.response);
              this.recoveryCodes = !this.recoveryCodes;
          }
      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
      });

  }

  _onDisableAction() {
      this.dispatchEvent(new CustomEvent('disable-twofa', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoAccount2faManage.is, AppscoAccount2faManage);
