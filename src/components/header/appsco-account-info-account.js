/**
`appsco-account-info-account`
Appsco additional account component

Example:

    <body>
      <appsco-account-info-account account={}></appsco-account-info-account>

 Custom property | Description | Default
----------------|-------------|----------
`--divider-color` | Color for divider used for border of root element | `Based on default theme --divider-color`
`--appsco-account-info-account` | Mixin applied to root element | `{}`
`--appsco-account` | Mixin applied to inner element with class .account | `{}`
`--appsco-account-img` | Mixin applied to inner <img> element that holds account picture | `{}`
`--appsco-account-info-lead` | Mixin applied to inner element that holds account display name | `{}`
`--appsco-account-info-additional` | Mixin applied to inner element that holds account email | `{}`

@demo demo/appsco-account-info-account.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '../account/appsco-account-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountInfoAccount extends PolymerElement {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: block;
                background-color: var(--inactive-account-background-color, #f5f5f5);
                border-bottom: 1px solid var(--divider-color);
                position: relative;

            @apply --appsco-account-info-account;
            }
            :host:hover {
                background-color: var(--inactive-account-background-hover, #f9f7f7);
            }
            :host:first-child {
                border-top: 1px solid var(--divider-color);
            }
            :host .account {
                padding: 6px 20px;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                cursor: pointer;

            @apply --appsco-account;
            }
            :host .account:hover {
                background-color: var(--hover-background-color);
            }
            appsco-account-image {
                --account-image: {
                    width: 32px;
                    height: 32px;
                    margin-right: 10px;
                    @apply --appsco-account-img;
                };
                --account-initials-font-size: 14px;
            }
            :host .account .info-lead {
                font-size: 14px;
                line-height: 16px;
                margin: 0;
                display: block;

            @apply --appsco-account-info-lead;
            }
            :host .account .info-additional {
                font-size: 12px;
                line-height: 14px;

            @apply --appsco-account-info-additional;
            }
            :host .account .info-lead, :host .account .info-additional {
                display: block;
                width: 95%;
            }
            :host .account iron-icon {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 14px;
                margin: auto;
            }
            :host .truncate {
            @apply --paper-font-common-nowrap;
                display: block;
            }
        </style>

        <div class="account layout horizontal center">
            <appsco-account-image account="[[ account ]]"></appsco-account-image>

            <div class="account-info flex truncate">
                <template is="dom-if" if="[[ _accountDisplay ]]">
                    <span class="info-lead truncate">[[ _accountDisplay ]]</span>
                </template>

                <span class="info-additional truncate">[[ account.email ]]</span>
            </div>

            <template is="dom-if" if="[[ !removeAccount ]]">
                <iron-icon icon="icons:chevron-right" class="flex"></iron-icon>
            </template>

            <template is="dom-if" if="[[ removeAccount ]]">
                <iron-icon icon="icons:clear" class="flex"></iron-icon>
            </template>

        </div>

        <paper-ripple></paper-ripple>
`;
  }

  static get is() { return 'appsco-account-info-account'; }

  static get properties() {
      return {
          account: {
              type: Object,
              notify: true
          },

          _accountDisplay: {
              type: String,
              computed: '_setAccountDisplay(account)'
          },

          /**
           * Indicates if _accountDisplay is empty or not.
           */
          _name: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          }
      };
  }

  ready() {
      super.ready();

      afterNextRender(this, function() {
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('tap', this._onAccountTap);
  }

  _setAccountDisplay(account) {
      let displayName = '';

      if (account.first_name) {
          displayName = account.first_name;
          this._name = true;
      }

      if (account.last_name) {
          displayName = displayName ? (displayName + ' ' + account.last_name) : account.last_name;
          this._name = true;
      }

      return displayName;
  }

  _onAccountTap() {
      this.dispatchEvent(new CustomEvent('account-selected', {
          bubbles: true,
          composed: true,
          detail: {
              account: this.account
          }
      }));
  }
}
window.customElements.define(AppscoAccountInfoAccount.is, AppscoAccountInfoAccount);
