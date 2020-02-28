/**
`appsco-header`
appsco-header is used to represent overall info about branding, current appsco product, global actions and user info. It is top section within appsco page.

Example:

    <body>
      <appsco-header></appsco-header>


### Styling

`<appsco-header>` provides the following custom mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--divider-color` | Default color for divider | `#eaeaea`
`--appsco-header` | Mixin applied to root appsco-header element. | `{}`

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import './appsco-brand.js';
import './appsco-product.js';
import './appsco-header-account-actions.js';
import './appsco-account-info.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoHeader extends PolymerElement {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: block;
                background-color: var(--header-background-color);
                color: var(--header-text-color);

                --paper-icon-button-ink-color: var(--header-icon-color);
                --appsco-account-action-color: var(--header-icon-color);

                @apply --appsco-header;
            }
            :host .appsco-header-container {
                height: 100%;
            }
            :host .vertical-divider {
                width: 2px;
                height: 32px;
                background-color: var(--header-divider-color);
                margin-left: 20px;
                margin-right: 20px;
            }
            :host .action-icon {
                color: var(--header-icon-color);
                margin-right: 10px;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
        </style>

        <div class="appsco-header-container layout horizontal center justified">

            <div class="layout horizontal center">
                <appsco-brand logo="[[ brandLogo ]]" logo-width="[[ brandLogoWidth ]]" logo-height="[[ brandLogoHeight ]]" brand-title="[[ brandTitle ]]" brand-logo-clickable="[[ brandLogoClickable ]]"></appsco-brand>

                <div class="vertical-divider"></div>

                <appsco-product id="appscoProduct" partner="[[ productPartner ]]" business="[[ productBusiness ]]" on-appsco-product-changed="_handleAppscoProductChangeAction"></appsco-product>
            </div>

            <div class="layout horizontal center">

                <appsco-header-account-actions id="appscoHeaderAccountActions" class="mr-10" account="[[ account ]]" chat="[[ accountChat ]]" tutorial-action-available="[[ tutorialActionAvailable ]]" authorization-token="[[ authorizationToken ]]" notifications-api="[[ notificationsApi ]]" notifications-size="[[ notificationsSize ]]">
                </appsco-header-account-actions>

                <appsco-account-info account="[[ account ]]" info="[[ accountInfo ]]" display-name="[[ accountDisplayName ]]" logout-api="[[ logoutApi ]]">
                </appsco-account-info>
            </div>

        </div>
`;
  }

  static get is() { return 'appsco-header'; }

  static get properties() {
      return {
          /**
           * Active account from AppsCo dashboard.
           */
          account: {
              type: Object
          },

          /** Source to image which represents brand logo. */
          brandLogo: {
              type: String
          },

          brandLogoClickable: {
              type: Boolean,
              value: false
          },

          /** Width of brand logo. */
          brandLogoWidth: {
              type: Number,
              value: 0
          },

          /** Height of brand logo. */
          brandLogoHeight: {
              type: Number,
              value: 0
          },

          /** Title of a brand to be displayed right to brand logo. */
          brandTitle: {
              type: String
          },

          /** Indicates if chat is present or not. */
          accountChat: {
              type: Boolean,
              value: false
          },

          tutorialActionAvailable: {
              type: Boolean,
              value: false
          },

          authorizationToken: {
              type: String
          },

          notificationsApi: {
              type: String
          },

          logoutApi: {
              type: String
          },

          notificationsSize: {
              type: Number,
              value: 5
          },

          accountInfo: {
              type: String
          },

          /**
           * If attribute is set account display will contain account display name.
           * Otherwise, account display will contain account picture_url only.
           */
          accountDisplayName: {
              type: Boolean,
              value: false
          },

          /** Indicates if user has access to Appsco Partner product. */
          productPartner: {
              type: Boolean,
              value: false
          },

          /** Indicates if user has access to Appsco Business product. */
          productBusiness: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          domain: {
              type: String
          }

      };
  }

  _handleAppscoProductChangeAction(event) {
      if('appsco-partner-product' === event.detail.product) {
          window.location.href = this.domain+'/pp/home';
      }
  }

  setProduct(product) {
      this.$.appscoProduct.setProduct(product);
  }

  removeProduct(product) {
      this.$.appscoProduct.removeProduct(product);
  }

  removeProductCompanies(companies) {
      this.$.appscoProduct.removeProductCompanies(companies);
  }

  addPersonalToProducts() {
      this.$.appscoProduct.addPersonalToProducts();
  }

  notifyNewNotifications (newNotifications) {
      this.$.appscoHeaderAccountActions.notifyNewNotifications(newNotifications);
  }

  notifyNotificationsSeen () {
      this.$.appscoHeaderAccountActions.notifyNotificationsSeen();
  }
}
window.customElements.define(AppscoHeader.is, AppscoHeader);
