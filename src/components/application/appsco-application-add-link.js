/**
`appsco-application-add-link`
Is used to present application as link settings.

Example:
    <body>
        <appsco-application-add-link>
        </appsco-application-add-link>


### Styling

`<appsco-application-add-link>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-application-add-link` | Mixin for the root element | `{}`

@demo demo/appsco-application-add.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationAddLink extends mixinBehaviors([NeonSharedElementAnimatableBehavior, Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is saving application" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <iron-form id="addLinkForm" hidden="" headers="[[ _headers ]]" on-iron-form-response="_onFormResponse">
            <form method="post" action="[[ _computedAction ]]">
                <paper-input type="text" name="application[resource]" value="[[ link.self ]]"></paper-input>
            </form>
        </iron-form>

        <iron-form id="saveLinkForm">
            <form>
                <paper-input id="title" label="title" name="configure_application[title]" required="" auto-validate="" error-message="Please enter link title."></paper-input>

                <paper-input id="url" label="url" name="configure_application[url]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" error-message="Url is invalid." required="" auto-validate=""></paper-input>
            </form>
        </iron-form>
`;
  }

  static get is() { return 'appsco-application-add-link'; }

  static get properties() {
      return {
          link: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          dashboardApi: {
              type: String
          },

          /**
           * Computed action to call in order to save application as icon.
           */
          _computedAction: {
              type: String,
              computed: "_computeAction(dashboardApi)"
          },

          /**
           * Indicates if appsco loader should be displayed.
           */
          _loader: {
              type: Boolean,
              value: false
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

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': [{
              name: 'hero-animation',
              id: 'hero',
              toPage: this
          }, {
              name: 'fade-in-animation',
              node: this,
              timing: {
                  duration: 600
              }
          }],
          'exit': {
              name: 'fade-out-animation',
              node: this
          }
      };

      this.sharedElements = {
          'hero': this.shadowRoot.getElementById('saveLinkForm')
      };
  }

  /**
   * Computes action for saving application as icon.
   *
   * @param {String} dashboardApi
   * @returns {string}
   * @private
   */
  _computeAction(dashboardApi) {
      return dashboardApi + '/icons';
  }

  _showLoader() {
      this._loader = true;
  }

  _hideLoader() {
      this._loader = false;
  }

  /**
   * Configures application with given title and url.
   *
   * @returns {*}
   * @private
   */
  _saveLink(icon) {
      return new Promise(function(resolve, reject){
          const body = encodeURIComponent(this.$.title.name) + '=' + encodeURIComponent(this.$.title.value) +
              '&' +
              encodeURIComponent(this.$.url.name) + '=' + encodeURIComponent(this.$.url.value);

          const options = {
              url: icon.self + '/application',
              method: 'PATCH',
              body: body,
              handleAs: 'json',
              headers: this._headers
          };

          const request = document.createElement('iron-request');
          request.send(options).then(function() {

              if (request.succeeded) {
                  resolve(request.response.icon);
              }

          });
      }.bind(this));
  }

  /**
   * Called on form error when trying to add new application as icon.
   *
   * @param {Object} event
   * @private
   */
  _onFormError(event) {
      this._errorMessage = event.detail.error.message;
      this._hideLoader();
  }

  /**
   * Called after application is added as icon.
   * It calls application configure method.
   *
   * @param {Object} event
   * @private
   */
  _onFormResponse(event) {
      this._saveLink(event.detail.response.icon).then(function(application) {
          this.dispatchEvent(new CustomEvent('link-added', {
              bubbles: true,
              composed: true,
              detail: {
                  application: application
              }
          }));

          this._hideLoader();

      }.bind(this));
  }

  addLink() {
      if (this.$.saveLinkForm.validate()) {
          this._showLoader();
          this.$.addLinkForm.submit();
      }
  }

  setup() {
      this.$.title.focus();
  }

  reset() {
      this.$.saveLinkForm.reset();
      this._hideLoader();
  }
}
window.customElements.define(AppscoApplicationAddLink.is, AppscoApplicationAddLink);
