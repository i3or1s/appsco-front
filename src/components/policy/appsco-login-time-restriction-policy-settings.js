import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../appsco-time-picker/appsco-time-picker.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoLoginTimeRestrictionPolicySettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                @apply --appsco-login-time-restriction-policy-settings;
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

        <iron-ajax auto="" url="[[ _timeZoneListUrl ]]" handle-as="json" on-response="_onTimezoneListResponse">
        </iron-ajax>

        <div>
            <paper-dropdown-menu id="restrictionTimezone" name="restrictionTimezone" label="Timezone" horizontal-align="left">
                <paper-listbox id="paperListboxTimezone" class="dropdown-content filter" attr-for-selected="value" slot="dropdown-content">
                    <template is="dom-repeat" items="[[ _timezoneList ]]">
                        <paper-item value="[[ item.value ]]">[[ item.text ]]</paper-item>
                    </template>
                </paper-listbox>
            </paper-dropdown-menu>
        </div>

        <div class="form">
            <table>
                <tbody><tr>
                    <th>Day</th>
                    <th>From</th>
                    <th>To</th>
                </tr>
                <tr>
                    <td>Monday:</td>
                    <td><appsco-time-picker id="mondayFrom" name="mondayFrom" value="[[ _restrictions.monday.from ]]"></appsco-time-picker></td>
                    <td><appsco-time-picker id="mondayTo" name="mondayTo" value="[[ _restrictions.monday.to ]]"></appsco-time-picker></td>
                </tr>
                <tr>
                    <td>Tuesday:</td>
                    <td><appsco-time-picker id="tuesdayFrom" name="tuesdayFrom" value="[[ _restrictions.tuesday.from ]]"></appsco-time-picker></td>
                    <td><appsco-time-picker id="tuesdayTo" name="tuesdayTo" value="[[ _restrictions.tuesday.to ]]"></appsco-time-picker></td>
                </tr>
                <tr>
                    <td>Wednesday:</td>
                    <td><appsco-time-picker id="wednesdayFrom" name="wednesdayFrom" value="[[ _restrictions.wednesday.from ]]"></appsco-time-picker></td>
                    <td><appsco-time-picker id="wednesdayTo" name="wednesdayTo" value="[[ _restrictions.wednesday.to ]]"></appsco-time-picker></td>
                </tr>
                <tr>
                    <td>Thursday:</td>
                    <td><appsco-time-picker id="thursdayFrom" name="thursdayFrom" value="[[ _restrictions.thursday.from ]]"></appsco-time-picker></td>
                    <td><appsco-time-picker id="thursdayTo" name="thursdayTo" value="[[ _restrictions.thursday.to ]]"></appsco-time-picker></td>
                </tr>
                <tr>
                    <td>Friday:</td>
                    <td><appsco-time-picker id="fridayFrom" name="fridayFrom" value="[[ _restrictions.friday.from ]]"></appsco-time-picker></td>
                    <td><appsco-time-picker id="fridayTo" name="fridayTo" value="[[ _restrictions.friday.to ]]"></appsco-time-picker></td>
                </tr>
                <tr>
                    <td>Saturday:</td>
                    <td><appsco-time-picker id="saturdayFrom" name="saturdayFrom" value="[[ _restrictions.saturday.from ]]"></appsco-time-picker></td>
                    <td><appsco-time-picker id="saturdayTo" name="saturdayTo" value="[[ _restrictions.saturday.to ]]"></appsco-time-picker></td>
                </tr>
                <tr>
                    <td>Sunday:</td>
                    <td><appsco-time-picker id="sundayFrom" name="sundayFrom" value="[[ _restrictions.sunday.from ]]"></appsco-time-picker></td>
                    <td><appsco-time-picker id="sundayTo" name="sundayTo" value="[[ _restrictions.sunday.to ]]"></appsco-time-picker></td>
                </tr>
            </tbody></table>

            <paper-button type="button" class="save-action" on-tap="_onSaveAction">Save</paper-button>
        </div>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
`;
  }

  static get is() { return 'appsco-login-time-restriction-policy-settings'; }

  static get properties() {
      return {
          policy: {
              type: Object,
              value: function () {
                  return {};
              },
              observer: '_restrictionsChanged'
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

          _restrictions: {
              type: Object,
              computed: '_computeRestrictions(policy)'
          },

          _timezoneList: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _timeZoneListUrl: {
              type: String,
              value: function () {
                  return this.resolveUrl('./data/timezone-list.json');
              }
          }
      };
  }

  ready() {
      super.ready();

      this._target = this;
  }

  _restrictionsChanged(newValue, oldValue) {
      if (newValue.restrictions) {
          this.$.paperListboxTimezone.select(newValue.restrictions.timezone);
      }
  }

  _computeMondayFrom(policy) {
      return policy.restrictions.mondayFrom;
  }

  _computeRestrictions(policy) {
      return policy.restrictions ? policy.restrictions : {};
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
      this._saveRestrictions();
  }

  _onTimezoneListResponse(event, ironRequest) {
      const response = [];

      ironRequest.response.forEach(function(zone, i) {
          if (zone.utc) {
              zone.utc.forEach(function(utc, index) {
                  var item = {
                      value: utc,
                      text: utc.split('/')[1]
                  };

                  response.push(item);
              }.bind(this));
          }
      }.bind(this));

      this._timezoneList = response.sort(function(zoneA, zoneB) {
          zoneA = zoneA.text.toLowerCase();
          zoneB = zoneB.text.toLowerCase();

          return zoneA < zoneB ? -1 : zoneA > zoneB ? 1 : 0;
      });

  }

  _saveRestrictions() {
      const restrictions = {
              'timezone': this.$.restrictionTimezone.selectedItem.value,
              'monday': {
                  'from': this.$.mondayFrom.value,
                  'to': this.$.mondayTo.value
              },
              'tuesday': {
                  'from': this.$.tuesdayFrom.value,
                  'to': this.$.tuesdayTo.value
              },
              'wednesday': {
                  'from': this.$.wednesdayFrom.value,
                  'to': this.$.wednesdayTo.value
              },
              'thursday': {
                  'from': this.$.thursdayFrom.value,
                  'to': this.$.thursdayTo.value
              },
              'friday': {
                  'from': this.$.fridayFrom.value,
                  'to': this.$.fridayTo.value
              },
              'saturday': {
                  'from': this.$.saturdayFrom.value,
                  'to': this.$.saturdayTo.value
              },
              'sunday': {
                  'from': this.$.sundayFrom.value,
                  'to': this.$.sundayTo.value
              }
          },
          policy = this.policy;

      const request = document.createElement('iron-request'),
          options = {
              url: policy.self,
              method: 'PUT',
              headers: this._headers,
              handleAs: 'json'
          };
      let body = 'policy[name]=' + policy.name + '&policy[description]=' + policy.description +'&';

      body += 'policy[restrictions]=' + encodeURIComponent(JSON.stringify(restrictions));
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

              this.set('policy', {});
              this.set('policy', request.response);
              this._hideLoader();
          }
      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
          this._hideLoader();
      }.bind(this));
  }
}
window.customElements.define(AppscoLoginTimeRestrictionPolicySettings.is, AppscoLoginTimeRestrictionPolicySettings);
