/**
`appsco-orgunit-modify`
Shows dialog screen for adding/editing organization unit.

    <appsco-orgunit-modify>
    </appsco-orgunit-modify>

### Styling

`<appsco-orgunit-modify>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-orgunit-modify` | Mixin for the root element | `{}`

@demo demo/appsco-orgunit-modify.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoOrgUnitModify extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
            @apply --appsco-orgunit-modify;
            }
            paper-dialog {
                width: 670px;

            --paper-dialog-title: {
                 margin-top: 24px;
             };
            }
            :host paper-dialog-scrollable > * {
            @apply --paper-dialog-scrollable-child;
            }
            :host .buttons paper-button {
            @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-confirm] {
            @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
            @apply --paper-dialog-dismiss-button;
            }
        </style>
        <paper-dialog id="modifyDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <template is="dom-if" if="[[ _isModify(orgUnit) ]]">
                <h2 class="title">Modify organization unit [[ orgUnit.name ]]</h2>
            </template>

            <template is="dom-if" if="[[ !_isModify(orgUnit) ]]">
                <h2 class="title">Add new organization unit</h2>
            </template>

            <paper-dialog-scrollable>

                <div class="remove-container">

                    <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is removing organization unit" multi-color=""></appsco-loader>

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <paper-input id="name" label="name" value="[[ orgUnit.name ]]" name="org_unit[name]" error-message="Please enter organization unit name." on-keyup="_onKeyup"></paper-input>
                    <paper-textarea id="description" label="description" value="[[ orgUnit.description ]]" name="org_unit[description]"></paper-textarea>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <template is="dom-if" if="[[ _isModify(orgUnit) ]]">
                    <paper-button autofocus="" on-tap="_modify">Modify</paper-button>
                </template>
                <template is="dom-if" if="[[ !_isModify(orgUnit) ]]">
                    <paper-button autofocus="" on-tap="_add">Add</paper-button>
                </template>
            </div>
        </paper-dialog>

        <iron-a11y-keys keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
  }

  static get is() { return 'appsco-orgunit-modify'; }

  static get properties() {
      return {
          /**
           * [OrgUnit]() if this property is present then component will be used for edit functionality
           */
          orgUnit: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          },

          /**
           * [OrgUnit]() it is used only when adding new org unit. This is parent of the new org unit
           */
          parent: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
          }
      };
  }

  _onKeyup(event) {
      if (event.code !== 'Enter') {
          event.target.invalid = false;
      }
  }

  /**
   * Submits form on ENTER key using iron-a11y-keys component.
   *
   * @private
   */
  _onEnter() {
      this._isModify(this.orgUnit) ? this._modify() : this._add();
  }

  /**
   * Is orgunit to be modified or added
   *
   * @private
   */
  _isModify(orgUnit) {
      return Object.keys(orgUnit).length > 0;
  }

  open () {
      this.$.modifyDialog.open();
  }

  _close () {
      this.$.modifyDialog.close();
  }

  _onDialogOpened() {
      this.$.name.value = this.orgUnit.name;
      this.$.description.value = this.orgUnit.description;
      this.$.name.focus();
  }

  _onDialogClosed() {
      this.$.name.value = '';
      this.$.description.value = '';
      this.$.name.invalid = false;
      this._errorMessage = '';
  }

  _validate() {
      const nameInput = this.$.name,
          name = nameInput.value ? nameInput.value : '';

      if (name.trim().length === 0) {
          nameInput.invalid = true;
          nameInput.focus();
          return false;
      }

      return true;
  }

  /**
   * Preform add operation
   *
   * @private
   */
  _add() {
      if (this._validate()) {
          const appRequest = document.createElement('iron-request');

          this._loader = true;

          appRequest.send({
              url: this.parent.self,
              method: 'POST',
              handleAs: 'json',
              body: this._prepBody(),
              headers: this._headers
          }).then(function(request) {
              this._loader = false;

              this.dispatchEvent(new CustomEvent('orgunit-added', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      orgUnit: request.response.orgunit
                  }
              }));

              this.$.modifyDialog.close();
          }.bind(this), function(e) {
              this._loader = false;
              this._errorMessage = 'We couldn\'t save your changes. Please try again in a minute.';
          }.bind(this));
      }
  }

  /**
   * Preform update operation
   *
   * @private
   */
  _modify() {
      if (this._validate()) {
          const appRequest = document.createElement('iron-request');

          this._loader = true;

          appRequest.send({
              url: this.orgUnit.self,
              method: 'PATCH',
              handleAs: 'json',
              body: this._prepBody(),
              headers: this._headers
          }).then(function(request) {
              this._loader = false;

              this.dispatchEvent(new CustomEvent('orgunit-modified', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      orgUnit: request.response.orgunit
                  }
              }));

              this.$.modifyDialog.close();
          }.bind(this), function(e) {
              this._loader = false;
              this._errorMessage = 'We couldn\'t save your changes. Please try again in a minute.';
          }.bind(this));
      }
  }

  /**
   * Prepare all fields for operations
   *
   * @private
   */
  _prepBody() {
      let nameInput = this.$.name,
          name = nameInput.value ? nameInput.value : '',
          descriptionInput = this.$.description,
          description = descriptionInput.value ? descriptionInput.value : '',
          body = '';

      body = encodeURIComponent(nameInput.name) + '=' + encodeURIComponent(name);
      body += '&';
      body += encodeURIComponent(descriptionInput.name) + '=' + encodeURIComponent(description);

      return body;
  }
}
window.customElements.define(AppscoOrgUnitModify.is, AppscoOrgUnitModify);
