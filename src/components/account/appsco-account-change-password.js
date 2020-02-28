/**
`appsco-account-change-password`
Form for account password change.

Example:
    <body>
        <appsco-account-change-password authorization-token=""
                                        account-change-password-api="">
        </appsco-account-change-password>

### Styling

`<appsco-account-change-password>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-account-change-password` | Mixin for the root element | `{}`

@demo demo/appsco-account-change-password.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountChangePassword extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
            @apply --appsco-account-change-password;
            }
            :host .submit-button {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <iron-form id="accountChangePasswordForm" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
            <form method="POST" action="[[ accountChangePasswordApi ]]">

                <paper-input id="oldPassword" name="change_password[oldPassword]" label="Old password" type="password" required="" auto-validate="" error-message="Please type in old password." on-keyup="_validateForm"></paper-input>

                <paper-input id="newPassword" name="change_password[newPassword][plainPassword][first]" label="New password" type="password" required="" error-message="Please type in new password." on-keyup="_validateForm"></paper-input>

                <paper-input id="newPasswordRepeat" name="change_password[newPassword][plainPassword][second]" label="Repeat new password" type="password" required="" error-message="Please repeat new password." on-keyup="_validateForm"></paper-input>
            </form>
        </iron-form>

        <paper-button id="submit" class="submit-button" on-tap="_submitForm">Save</paper-button>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
  }

  static get is() { return 'appsco-account-change-password'; }

  static get properties() {
      return {
          accountChangePasswordApi: {
              type: String
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
          },

          _validForm: {
              type: Boolean,
              value: true
          },

          _target: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this._target = this.$.accountChangePasswordForm;
  }

  _onEnter() {
      this._submitForm();
  }

  _submitForm() {
      this._validForm = (!this.$.newPassword.invalid && !this.$.newPasswordRepeat.invalid);

      if (this._validForm) {
          this.$.accountChangePasswordForm.submit();
      }
  }

  _validateForm() {
      const newPasswordField = this.$.newPassword,
          newPassword = newPasswordField.value.trim() === '' ? null : newPasswordField.value,
          repeatPasswordField = this.$.newPasswordRepeat,
          repeatPassword = repeatPasswordField.value.trim() === '' ? null : repeatPasswordField.value;

      if (newPassword) {
          if (newPassword.length < 8) {
              newPasswordField.errorMessage = 'Password must be at least 8 characters long.';
              newPasswordField.invalid = true;
          }
          else if (!newPassword.match(new RegExp("[A-Z]"))) {
              newPasswordField.errorMessage = 'Password must have at least one capital letter.';
              newPasswordField.invalid = true;
          }
          else if (!newPassword.match(new RegExp("[0-9]"))) {
              newPasswordField.errorMessage = 'Password must have at least one digital letter.';
              newPasswordField.invalid = true;
          }
          else if (newPassword === this.$.oldPassword.value) {
              newPasswordField.errorMessage = 'New password must be different from old one.';
              newPasswordField.invalid = true;
          }
          else {
              newPasswordField.invalid = false;
          }
      }

      if (newPassword && repeatPassword && (newPassword !== repeatPassword)) {
          repeatPasswordField.errorMessage = 'This has to be equal to new password.';
          repeatPasswordField.invalid = true;
      }
      else if (newPassword === repeatPassword) {
          repeatPasswordField.invalid = false;
      }
  }

  _onFormPresubmit(event) {
      if (this._validForm) {
          this._loader = true;
      }
  }

  _onFormError(event) {
      this._errorMessage = event.detail.error.message;
      this._loader = false;
  }

  _onFormResponse() {
      this.$.accountChangePasswordForm.reset();

      this.dispatchEvent(new CustomEvent('password-changed', { bubbles: true, composed: true }));

      this._loader = false;
  }

  setUp() {
      this.$.oldPassword.focus();
  }

  reset() {
      this.$.accountChangePasswordForm.reset();
      this._errorMessage = '';
  }
}
window.customElements.define(AppscoAccountChangePassword.is, AppscoAccountChangePassword);
