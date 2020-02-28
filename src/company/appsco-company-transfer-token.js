import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../components/components/appsco-copy.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyTransferToken extends mixinBehaviors([NeonAnimationRunnerBehavior, Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host p {
                line-height: 1.4;
                margin: 8px 0;
            }
            :host .action-button {
                @apply --primary-button;
                margin: 10px 0;
                min-width: 130px;
                display: inline-block;
            }
            :host .token {
                max-width: 500px;
                padding: 6px 30px 6px 6px;
                height: 18px;
                @apply --paper-font-common-nowrap;
                @apply --shadow-elevation-2dp;
                color: var(--secondary-text-color, #eeeeee);
                font-size: 14px;
                font-style: italic;
                border-radius: 2px;
                position: relative;
                display: none;
            }
            :host appsco-copy {
                position: absolute;
                top: 0;
                right: 0;

                --paper-icon-button: {
                     width: 32px;
                     height: 32px;
                 };
            }
            :host .partner-section {
                margin-top: 20px;
            }
        </style>

        <iron-ajax auto="" method="GET" url="[[ _partnersApiUrl ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onGetPartnersResponse">
        </iron-ajax>

        <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

        <p>
            Transfer token enables AppsCo partner to add your company as a customer.
            <br>
            Once you generate the code, it will be active for 24 hours.
            Once transfer token is used it will become inactive.
        </p>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <div class="token-section">
            <paper-button class="action-button" on-tap="_onGenerateTokenAction">
                <appsco-loader active="[[ _generateTokenLoader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>
                Generate token</paper-button>

            <div id="token" class="token">
                [[ _token ]]
                <appsco-copy value="[[ _token ]]"></appsco-copy>
            </div>
        </div>

        <div class="partner-section">
            <p>
                Choose a company you wish to send the transfer token to and add as a partner.
                <br>
                By doing this you agree that the partner will be able to manage your company on AppsCo.
                <br>
                Partner can provide you with consulting and services and will be able to add,
                share and remove users and resources on your AppsCo company.
            </p>

            <paper-dropdown-menu id="dropdownPartners" label="Partner" horizontal-align="left" disabled\$="[[ !_tokenGenerated ]]">
                <paper-listbox id="paperListboxPartners" class="dropdown-content filter" attr-for-selected="value" slot="dropdown-content">
                    <template is="dom-repeat" items="[[ _partnerList ]]">
                        <paper-item value="[[ item.self ]]">[[ item.name ]]</paper-item>
                    </template>
                </paper-listbox>
            </paper-dropdown-menu>

            <div>
                <paper-button class="action-button" disabled\$="[[ !_tokenGenerated ]]" on-tap="_onSendTokenAction">Send</paper-button>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-company-transfer-token'; }

  static get properties() {
      return {
          transferTokenApi: {
              type: String
          },

          sendTransferTokenApi: {
              type: String
          },

          partnersApiUrl: {
              type: String
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _partnersApiUrl: {
              type: String,
              computed: '_computePartnersApiUrl(partnersApiUrl)'
          },

          _token: {
              type: String,
              value: ''
          },

          _tokenGenerated: {
              type: Boolean,
              value: false
          },

          _partnerList: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _generateTokenLoader: {
              type: Boolean,
              value: false
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
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
              node: this.$.token,
              timing: {
                  duration: 300
              }
          },
          'exit': {
              name: 'fade-out-animation',
              node: this.$.token,
              timing: {
                  duration: 100
              }
          }
      };

      afterNextRender(this, function () {
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('neon-animation-finish', this._onNeonAnimationFinished);
  }

  reset() {
      this._hideToken();
      this._token = '';
      this._tokenGenerated = false;
      this.$.paperListboxPartners.selected = -1;
      this._hideError();
      this._hideGenerateTokenLoader();
      this._hideLoader();
  }

  _computePartnersApiUrl(partnersApiUrl) {
      return partnersApiUrl ? (partnersApiUrl + '?extended=1') : null;
  }

  _showGenerateTokenLoader() {
      this._generateTokenLoader = true;
  }

  _hideGenerateTokenLoader() {
      this._generateTokenLoader = false;
  }

  _showLoader() {
      this._loader = true;
  }

  _hideLoader() {
      this._loader = false;
  }

  _showError(message) {
      this._errorMessage = message;
  }

  _hideError() {
      this._errorMessage = '';
  }

  _hideToken() {
      this.$.token.style.display = 'none';
  }

  _transferTokenGenerateSuccess(token) {
      if (token) {
          this._token = token;

          if (!this._tokenGenerated) {
              this._tokenGenerated = true;

              setTimeout(function() {
                  this.$.token.style.display = 'block';
                  this.playAnimation('entry');
              }.bind(this), 200);
          }

          this.dispatchEvent(new CustomEvent('token-generated', { bubbles: true, composed: true }));
      }
      else {
          this._showError(this.apiErrors.getError(404));
      }
  }

  _transferTokenGenerateFailure() {
      this._token = '';
      this._tokenGenerated = false;
      this.playAnimation('exit');
  }

  _getTransferToken() {
      return new Promise(function(resolve, reject) {
          const request = document.createElement('iron-request'),
              options = {
                  url: this.transferTokenApi,
                  method: 'GET',
                  handleAs: 'json',
                  headers: this._headers
              };

          request.send(options).then(function() {
              if (request.response && request.response.transfer_token) {
                  resolve(request.response.transfer_token);
              }
          }, function() {
              reject(request.response.code);
          });
      }.bind(this));
  }

  _onGenerateTokenAction() {
      if (!this.transferTokenApi || !this._headers) {
          this._showError(this.apiErrors.getError(404));
          return false;
      }

      this._showGenerateTokenLoader();

      this._getTransferToken().then(function(token) {
          this._transferTokenGenerateSuccess(token);
          this._hideGenerateTokenLoader();
      }.bind(this), function(code) {
          this._showError(this.apiErrors.getError(code));
          this._transferTokenGenerateFailure();
          this._hideGenerateTokenLoader();
      }.bind(this));
  }

  _onGetPartnersResponse(event) {
      const response = event.detail.response;

      if (response && response.partners) {
          this.set('_partnerList', response.partners);
      }
  }

  _sendTokenToPartner() {
      const selectedPartner = this.$.dropdownPartners.selectedItem;

      if (!selectedPartner) {
          this._showError('Please select partner from the list of available partners.');
          this._hideLoader();
          return false;
      }

      const token = this._token,
          partner = selectedPartner.value,
          request = document.createElement('iron-request'),
          headers = this._headers,
          options = {
              url: this.sendTransferTokenApi,
              method: 'POST',
              handleAs: 'json',
              body: 'transfer_token[token]=' + encodeURIComponent(token) + '&transfer_token[partner]=' + encodeURIComponent(partner)
          };

      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers = headers;

      request.send(options).then(function() {
          if (200 === request.status) {
              this.dispatchEvent(new CustomEvent('transfer-token-sent', { bubbles: true, composed: true }));
              this._hideLoader();
          }
      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
          this._hideLoader();
      }.bind(this));
  }

  _onSendTokenAction() {
      this._hideError();
      this._showLoader();

      if (this._token) {
          this._sendTokenToPartner();
      }
  }

  _onNeonAnimationFinished() {
      if (!this._tokenGenerated) {
          this._hideToken();
      }
  }
}
window.customElements.define(AppscoCompanyTransferToken.is, AppscoCompanyTransferToken);
