/*
`appsco-company-details`
Component holds details about appsco company.

Example:
    <body>
        <appsco-company-details company={}>
        </appsco-company-details>

### Styling

`<appsco-company-details>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-company-details` | Mixin for the root element. | `{}`
`--company-detail-container` | Mixin for the inner element that holds label and value. | `{}`
`--company-details-label` | Mixin applied to detail label. | `{}`
`--company-details-value` | Mixin applied to detail value. | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyDetails extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: none;
            }
            :host > div {
                margin: 6px 0;
                @apply --company-detail-container;
            }
            :host div[label] {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                @apply --company-details-label;
            }
            :host div[content] {
                color: var(--primary-text-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --paper-font-subhead;
                @apply --company-details-value;
            }
            :host .flex {
                @apply --layout-flex;
                @apply --paper-font-common-nowrap;
            }
        </style>

        <div hidden\$="[[ !company.name ]]">
            <div label="">Name</div>
            <div content="">
                <div class="flex">
                    [[ company.name ]]
                </div>
            </div>
        </div>

        <div hidden\$="[[ !company.contact_email ]]">
            <div label="">Contact email</div>
            <div content="">
                <div class="flex">
                    [[ company.contact_email ]]
                </div>
            </div>
        </div>

        <div hidden\$="[[ !company.billing_email ]]">
            <div label="">Billing email</div>
            <div content="">
                <div class="flex">
                    [[ company.billing_email ]]
                </div>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-company-details'; }

  static get properties() {
      return {
          company: {
              type: Object,
              value: function () {
                  return {};
              },
              observer: '_onCompanyChanged'
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

  _onCompanyChanged() {
      this._showDetails();
  }

  _showDetails() {
      this.style.display = 'block';
      this.playAnimation('entry');
  }
}
window.customElements.define(AppscoCompanyDetails.is, AppscoCompanyDetails);
