/**
`appsco-company-application-remove`
Shows dialog screen with confirmation for resource removal.

    <appsco-company-application-remove applications="[]">
    </appsco-company-application-remove>

### Styling

`<appsco-company-application-remove>` provides the following custom properties and mixins for styling:

@demo demo/company/appsco-company-application-remove.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import './appsco-application-assignees.js';
import '../../components/appsco-loader.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyApplicationRemove extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
            @apply --appsco-application-remove;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
            @apply --appsco-paper-dialog;
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
            :host appsco-application-assignees[hidden] {
                display: none;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <div class="header">
                <h2 hidden\$="[[ _singleApplication ]]">Remove resources</h2>
                <h2 hidden\$="[[ !_singleApplication ]]">Remove resource [[ _application.title ]]</h2>
            </div>

            <paper-dialog-scrollable>
                <div class="remove-container">

                    <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is removing application" multi-color=""></appsco-loader>

                    <p hidden\$="[[ _singleApplication ]]">By removing selected resources you will also remove all its assignees.</p>
                    <p hidden\$="[[ !_singleApplication ]]">By removing selected resource you will also remove all its assignees.</p>

                    <appsco-application-assignees class="appsco-application-assignees" application="[[ _application ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" size="10" preview="" auto-load="" hidden\$="[[ !_singleApplication ]]"></appsco-application-assignees>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="_removeApplications">Remove</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-company-application-remove'; }

  static get properties() {
      return {
          /**
           * Applications to delete.
           */
          applications: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _application: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _singleApplication: {
              type: Boolean,
              computed: '_computeSingleApplication(applications)'
          },

          companyApi: {
              type: String
          },

          _loader: {
              type: Boolean,
              value: false
          }
      };
  }

  toggle() {
      this.$.dialog.open();
  }

  setApplications(applications) {
      this.applications = applications;
  }

  _computeSingleApplication(applications) {
      if (applications && applications.length === 1) {
          this._application = applications[0];
          return true;
      }

      return false;
  }

  _removeApplications() {
      let applications = this.applications,
          length = applications.length - 1,
          appRequest = document.createElement('iron-request'),
          options = {
              url: this.companyApi + '/applications',
              method: 'DELETE',
              handleAs: 'json',
              headers: this._headers
          },
          body = '';

      this._loader = true;

      for (let i = 0; i <= length; i++) {
          let next = (i === length) ? '' : '&';
          body += 'applications[]=' + encodeURIComponent(applications[i].self) + next;
      }

      options.body = body;

      appRequest.send(options).then(function(request) {
          this.$.dialog.close();

          if (200 === request.response.response.code) {
              this.dispatchEvent(new CustomEvent('applications-removed', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      applications: this.applications
                  }
              }));
          }
          else {
              this.dispatchEvent(new CustomEvent('applications-remove-failed', { bubbles: true, composed: true }));
          }

          this.set('applications', []);
          this._loader = false;
      }.bind(this));
  }
}
window.customElements.define(AppscoCompanyApplicationRemove.is, AppscoCompanyApplicationRemove);
