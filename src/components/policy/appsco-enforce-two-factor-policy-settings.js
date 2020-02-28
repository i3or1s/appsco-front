import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-ajax/iron-request.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoEnforceTwoFactorPolicySettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                @apply --appsco-enforce-two-factor-policy-settings;
            }
            :host .info {
                @apply --info-message;
                margin-bottom: 0;
            }
            :host .save-action {
                @apply --primary-button;
                width: 60px;
                padding: 4px 8px;
                margin-top: 10px;
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <div class="form">
            <p class="info">
                Enter comma separated IP addresses you wish to whitelist.
            </p>

            <paper-input id="ipWhiteList" label="IP whitelist" name="policy[ips]" value="[[ _ipWhiteList ]]" on-keyup="_onKeyUp"></paper-input>

            <paper-button type="button" class="save-action" on-tap="_onSaveAction">Save</paper-button>
        </div>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
`;
  }

  static get is() { return 'appsco-enforce-two-factor-policy-settings'; }

  static get properties() {
      return {
          policy: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
          },

          _target: {
              type: Object
          },

          _ipWhiteList: {
              type: String,
              computed: '_computeIPWhiteList(policy)'
          },

          _ipWhiteListInput: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this._target = this;
      this._ipWhiteListInput = this.$.ipWhiteList;
  }

  _computeIPWhiteList(policy) {
      return policy.ips ? policy.ips.toString() : '';
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

  _onKeyUp(event) {
      if (13 !== event.keyCode) {
          this._hideError();
          event.target.invalid = false;
      }
  }

  _onEnterAction(event) {
      event.stopPropagation();
      this._onSaveAction();
  }

  _onSaveAction() {
      if (this._isValid()) {
          this._saveIPWhiteList();
      }
  }

  _setInvalidIPWhiteList() {
      this._ipWhiteListInput.invalid = true;
      this._showError('IP whitelist input is not valid. Please check IP addresses you have entered.');
  }

  _resetIPWhiteList() {
      this._ipWhiteListInput.invalid = false;
  }

  _isValid() {
      let valid,
          ipWhiteList = this._ipWhiteListInput.value;

      if (ipWhiteList) {
          ipWhiteList = ipWhiteList.split(',');

          const ipAddressRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              length = ipWhiteList.length - 1;

          for (let i = 0; i <= length; i++) {
              if (!ipAddressRegex.test(ipWhiteList[i].trim())) {
                  this._setInvalidIPWhiteList();
                  valid = false;
              }
              else if (i === length) {
                  valid = true;
              }
          }
      }
      else {
          valid = true;
      }

      return valid;
  }

  _saveIPWhiteList() {
      const ipWhiteListInputValue = this._ipWhiteListInput.value.split(','),
          policy = this.policy;

      const request = document.createElement('iron-request'),
          options = {
              url: policy.self,
              method: 'PUT',
              headers: this._headers,
              handleAs: 'json'
          };
      let body = 'policy[name]=' + policy.name + '&policy[description]=' + policy.description +'&';

      body += 'policy[ips]=' + encodeURIComponent(ipWhiteListInputValue.join(','));
      options.body = body;

      this._showLoader();

      request.send(options).then(function() {
          if (200 === request.status) {
              this.dispatchEvent(new CustomEvent('policy-updated', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      policy: request.response
                  }
              }));

              this._resetIPWhiteList();
              this._hideLoader();
          }
      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
          this._hideLoader();
      }.bind(this));
  }
}
window.customElements.define(AppscoEnforceTwoFactorPolicySettings.is, AppscoEnforceTwoFactorPolicySettings);
