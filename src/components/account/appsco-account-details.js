/**
`appsco-account-details`
Component holds details about appsco account.

Example:
    <body>
        <appsco-account-details account={}>
        </appsco-account-details>

### Styling

`<appsco-account-details>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-account-details` | Mixin for the root element. | `{}`
`--account-detail-container` | Mixin for the inner element that holds label and value. | `{}`
`--account-details-label` | Mixin applied to detail label. | `{}`
`--account-details-value` | Mixin applied to detail value. | `{}`

@demo demo/appsco-account-details.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountDetails extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: none;
            }
            :host > div {
                margin: 6px 0;
            @apply --account-detail-container;
            }
            :host div[label] {
                color: var(--secondary-text-color);
            @apply --paper-font-body1;
            @apply --account-details-label;
            }
            :host div[content] {
                color: var(--primary-text-color);
            @apply --layout-horizontal;
            @apply --layout-center;
            @apply --paper-font-subhead;
            @apply --account-details-value;
            }
            :host .flex {
            @apply --layout-flex;
            @apply --paper-font-common-nowrap;
            }
        </style>

        <iron-ajax auto="" url="[[ _countryListUrl ]]" handle-as="json" on-response="_onCountryListResponse">
        </iron-ajax>

        <div hidden\$="[[ !_accountFirstName ]]">
            <div label="">First name</div>
            <div content="">
                <div class="flex">
                    [[ _accountFirstName ]]
                </div>
            </div>
        </div>

        <div hidden\$="[[ !_accountLastName ]]">
            <div label="">Last name</div>
            <div content="">
                <div class="flex">
                    [[ _accountLastName ]]
                </div>
            </div>
        </div>

        <div>
            <div label="">Email</div>
            <div content="">
                <div class="flex">
                    [[ account.email ]]
                </div>
            </div>
        </div>

        <div hidden\$="[[ !account.country ]]">
            <div label="">Country</div>
            <div content="">
                <div class="flex">
                    [[ _accountCountry ]]
                </div>
            </div>
        </div>

        <div hidden\$="[[ !account.phone ]]">
            <div label="">Phone</div>
            <div content="">
                <div class="flex">
                    [[ account.phone ]]
                </div>
            </div>
        </div>

        <div>
            <div label="">Public profile</div>
            <div content="">
                <div class="flex">
                    [[ _publicProfile ]]
                </div>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-account-details'; }

  static get properties() {
      return {
          account: {
              type: Object,
              value: function () {
                  return {};
              },
              observer: '_onAccountChanged'
          },

          _accountFirstName: {
              type: String,
              computed: '_computeAccountFirstName(account)'
          },

          _accountLastName: {
              type: String,
              computed: '_computeAccountLastName(account)'
          },

          /**
           * Computed country name.
           */
          _accountCountry: {
              type: String,
              computed: '_computeCountry(_countryList, account)'
          },

          /**
           * Country list to get name of country from.
           * Country code = account.country.
           *
           * This is loaded from local data/country-list.json.
           */
          _countryList: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _countryListUrl: {
              type: String,
              value: function () {
                  return this.resolveUrl('./data/country-list.json');
              }
          },

          _publicProfile: {
              type: String,
              computed: '_computePublicProfileInfo(account)'
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
              node: this,
              timing: {
                  duration: 500
              }
          },
          'exit': {
              name: 'fade-out-animation',
              node: this,
              timing: {
                  duration: 100
              }
          }
      };
  }

  _onCountryListResponse(event, ironRequest) {
      this._countryList = ironRequest.response;
  }

  _computeAccountFirstName(account) {
      return account && account.first_name ? account.first_name : '';
  }

  _computeAccountLastName(account) {
      return account && account.last_name ? account.last_name : '';
  }

  _computeCountry(list, account) {
      const length = list.length - 1;

      for (let i = 0; i < length; i++) {
          const country = list[i];

          if (account && country.code === account.country) {
              return country.name;
          }
      }

      return '';
  }

  _computePublicProfileInfo(account) {
      return (account && account.profile_options && account.profile_options.public) ? 'On' : 'Off';
  }

  _onAccountChanged() {
      this._showDetails();
  }

  _showDetails() {
      this.style.display = 'block';
      this.playAnimation('entry');
  }
}
window.customElements.define(AppscoAccountDetails.is, AppscoAccountDetails);
