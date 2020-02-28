/*
`appsco-company-group-resource-item`
Account item is used to present account in form of an item.

    <appsco-company-group-resource-item>
    </appsco-company-group-resource-item>

### Styling

`<appsco-company-group-resource-item>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--item-background-color` | Background color applied to the root element | `#fff`
`--color` | Color applied to all the text | `#33`
`--appsco-company-group-resource-item` | Mixin applied to resource item | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../account/appsco-account-image.js';
import '../application/appsco-application-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyGroupResourceItem extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: none;
                color: var(--primary-text-color);
            }
            .item {
                width: 100%;
                height: 70px;
                padding: 0 10px;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
                background-color: var(--item-background-color, #fff);
                border-radius: 3px;
                @apply --shadow-elevation-2dp;
                @apply --layout-horizontal;
                @apply --layout-center;
                transition: all 0.1s ease-out;
                @apply --appsco-company-group-resource-item;
            }
            .item:hover {
                @apply --shadow-elevation-4dp;
            }
            .account-title {
                display: block;
                height: 32px;
                line-height: 16px;
                @apply --paper-font-common-base;
                font-size: 14px;
                font-weight: 400;
                overflow: hidden;
            }
            .actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                position: absolute;
                right: 4px;
                bottom: 4px;
            }
            paper-button {
                @apply --paper-font-common-base;
                @apply --paper-font-common-nowrap;

                padding: 4px;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.018em;
                line-height: 18px;
                text-transform: uppercase;
            }
            paper-button[disabled] {
                background: transparent;
            }
            .preview-application-image {
                --application-image: {
                    width: 28px;
                    height: 28px;
                };
                --application-initials-background-color: var(--body-background-color-darker);
                --application-initials-font-size: 12px;
            }
            :host .application-title {
                display: block;
                line-height: 16px;
                @apply --paper-font-common-base;
                font-size: 14px;
                font-weight: 400;
                @apply --text-wrap-break;
            }
            :host .application-info {
                @apply --layout-vertical;
                @apply --layout-start;
                padding: 0 10px;
            }
            :host .application-basic-info {
                width: 220px;
            }
            :host .info-value {
                display: block;
                font-size: 12px;
            }
        </style>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="item">

                <appsco-application-image application="[[ resource ]]"></appsco-application-image>

                <div class="application-info application-basic-info">
                    <span class="info-label application-title">[[ resource.title ]]</span>
                    <span class="info-value">[[ _resourceType ]]</span>
                </div>

                <div class="actions">
                    <paper-button on-tap="_onRemove">Revoke</paper-button>
                </div>

            </div>
        </template>

        <template is="dom-if" if="[[ preview ]]">
            <div class="preview-item">
                <appsco-application-image application="[[ resource ]]" class="preview-application-image"></appsco-application-image>
                <paper-tooltip position="right">[[ resource.title ]]</paper-tooltip>
            </div>
        </template>
`;
  }

  static get is() { return 'appsco-company-group-resource-item'; }

  static get properties() {
      return {
          resource: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          preview: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          group: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _resourceType: {
              type: String,
              computed: '_computeApplicationType(resource)'
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
                  duration: 200
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

      beforeNextRender(this, function() {
          this.style.display = 'inline-block';
      });

      afterNextRender(this, function() {
          this.playAnimation('entry');
      });
  }

  _computeApplicationType(resource) {
      switch (resource.auth_type) {
          case 'login':
              return 'Login';
          case 'cc':
              return 'Credit Card';
          case 'softwarelicence':
              return 'Software Licence';
          case 'passport':
              return 'Passport';
          case 'securenote':
              return 'Secure Note';
          case 'none':
              return 'Link';
          default:
              return 'Application';
      }
  }

  _onRemove (event) {
      event.stopPropagation();

      this.dispatchEvent(new CustomEvent('remove-company-resource-from-group', {
          bubbles: true,
          composed: true,
          detail: {
              resource: this.resource,
              group: this.group
          }
      }));
  }
}
window.customElements.define(AppscoCompanyGroupResourceItem.is, AppscoCompanyGroupResourceItem);
