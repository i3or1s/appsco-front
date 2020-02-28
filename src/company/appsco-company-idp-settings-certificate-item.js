/*
`appsco-company-idp-settings-certificate-item`
Presents certificate in form of an item.

    <appsco-company-certificate-item certificate="{}"
                                certificates-api=""
                                authorization-token=""
                                preview>
    </appsco-company-certificate-item>

### Styling

`<appsco-company-certificate-item>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--item-background-color` | Background color applied to the root element | `#fff`
`--color` | Color applied to all the text | `#33`
`--appsco-company-certificate-item` | Mixin applied to certificate item element | `{}`
`--certificate-basic-info` | Mixin applied to the basic info | `{}`
`--certificate-status-info` | Mixin applied to the status info | `{}`
`--certificate-basic-info-values` | Mixin applied to the basic info values | `{}`
`--certificate-status-info-values` | Mixin applied to the status info values | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../components/components/appsco-date-format.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyIdpSettingsCertificateItem extends PolymerElement {
  static get template() {
    return html`
        <style>

            .item {
                width: 100%;
                height: 40px;
                padding: 0px 10px;
                margin-bottom: 10px;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
                background-color: var(--item-background-color, #ffffff);
                border-radius: 3px;
                @apply --shadow-elevation-2dp;
                @apply --layout-horizontal;
                @apply --layout-center;
                transition: all 0.1s ease-out;
                @apply --appsco-company-idp-domain-item;
            }
            .item:hover {
                @apply --shadow-elevation-4dp;
            }

            .actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                position: absolute;
                right: 4px;
                bottom: 4px;
                font-size: 10px;
            }

        </style>

        <div class="item">

            <div class="cert-info cert-basic-info">
                <span class="info-label cert-title">[[ displayValue ]]</span>
            </div>

            <div class="actions">
                <paper-button on-tap="_onDeleteAction">Remove</paper-button>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-company-idp-settings-certificate-item'; }

  static get properties() {
      return {
          certificate: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          displayValue: {
              type: String,
              computed: '_computeDisplayValue(certificate)'
          },

          onRemoveIdpConfigCertificate: {
              type: Object,
              value: {}
          },

          mobileScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          screen1000: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          }
      };
  }

  static get observers() {
      return [
          '_updateScreen(mobileScreen, screen1000)'
      ];
  }

  _updateScreen() {
      this.updateStyles();
  }

  _computeDisplayValue(certificate) {
      certificate = certificate.replace('-----BEGIN CERTIFICATE-----', '');
      certificate = certificate .replace('\n', '');
      return certificate .substring(0, 40) + '...';
  }

  _onDeleteAction() {
      this.dispatchEvent(new CustomEvent('remove-idp-certificate', {
          bubbles: true,
          composed: true,
          detail: {
              certificate: this.certificate
          }
      }));
  }
}
window.customElements.define(AppscoCompanyIdpSettingsCertificateItem.is, AppscoCompanyIdpSettingsCertificateItem);
