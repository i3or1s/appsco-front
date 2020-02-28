/*
`appsco-resource-auth-type`
Component is used to display resource auth type in form of text.
It uses translations to get proper auth type display text.

### Example:

      <appsco-resource-auth-type auth-type=""
                                 language=""></appsco-resource-auth-type>

### Styling

Custom property | Description | Default
----------------|-------------|----------
`--appsco-resource-auth-type` | Mixin applied to the root element | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoResourceAuthType extends mixinBehaviors([AppLocalizeBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: inline-block;
                color: var(--primary-text-color);
                font-size: 14px;
                @apply --appsco-resource-auth-type;
            }
        </style>

        [[ localize(authType) ]]
`;
  }

  static get is() { return 'appsco-resource-auth-type'; }

  static get properties() {
      return {
          authType: {
              type: String,
              value: ''
          },

          language: {
              value: 'en',
              type: String
          }
      };
  }

  ready() {
      super.ready();

      beforeNextRender(this, function() {
          this.loadResources(this.resolveUrl('data/appsco-auth-type-translations.json'));
      });
  }
}
window.customElements.define(AppscoResourceAuthType.is, AppscoResourceAuthType);
