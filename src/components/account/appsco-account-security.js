/**
`appsco-account-security`
Contains security information: security score (in percentage) displayed as colored circle with percentage number
    inside it and security info as text.

    <appsco-account-security>
    </appsco-account-security>

### Styling

`<appsco-account-security>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--strong-color` | Strong color | `#0f9d58`
`--medium-color` | Medium color | `#4285f4`
`--weak-color` | Weak color | `#db4437`
`--icon-pass-color` | Security pass icon color  | `#0f9d58`
`--icon-fail-color` | Security fail icon color  | `#db4437`
`--appsco-account-security` | Mixin for the root element | `{}`
`--security-score` | Mixin for inner score element. | `{}`

@demo demo/appsco-account-security.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountSecurity extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                @apply --appsco-account-security;

                --iron-icon-height: 20px;
                --iron-icon-width: 20px;
                --iron-icon: {
                    margin-top: -2px;
                };
            }
            .security-score {
                @apply --paper-font-code1;
                @apply --layout;
                @apply --layout-center;
                @apply --layout-center-justified;
                width: 40px;
                height: 40px;
                box-sizing: border-box;
                border-radius: 50%;
                color: #ffffff;
                @apply --security-score;
            }
            :host([strong]) .security-score {
                background-color: var(--strong-color, #0f9d58);
            }
            :host([medium]) .security-score {
                background-color: var(--medium-color, #4285f4);
            }
            :host([weak]) .security-score {
                background-color: var(--weak-color, #db4437);
            }
            .security-info {
                margin-top: 10px;
            }
            .info {
                margin-top: 5px;
                margin-bottom: 5px;
            }
            .icon-pass {
                --iron-icon-fill-color: var(--icon-pass-color, #0f9d58);
            }
            .icon-fail {
                --iron-icon-fill-color: var(--icon-fail-color, #db4437);
            }
        </style>

        <div class="security-score">
            [[ _score ]]%
        </div>

        <template is="dom-if" if="[[ info ]]">
        </template>
`;
  }

  static get is() { return 'appsco-account-security'; }

  static get properties() {
      return {
          role: {
              type: Object,
              value: function () {
                  return {};
              },
              observer: '_roleChanged'
          },

          info: {
              type: Boolean,
              value: false
          },

          _score: {
              type: Number,
              value: 0
          },

          strong: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          medium: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          weak: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          }
      };
  }

  _roleChanged() {
      if (this.role && this.role.security) {
          const score = this.role.security.application_score;

          this._score = Math.round(score);
          this.weak = false;
          this.medium = false;
          this.strong = false;

          if (score > 80) {
              this.strong = true;
              return;
          }

          if (score > 60) {
              this.medium = true;
              return;
          }

          this.weak = true;
      }
  }
}
window.customElements.define(AppscoAccountSecurity.is, AppscoAccountSecurity);
