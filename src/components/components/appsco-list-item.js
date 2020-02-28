/**
`appsco-list-item`
Is used to represent list item such as application log, account-log and account notification.

Example:

    <body>
      <appsco-list-item item="{}">
     </appsco-list-item>

 Custom property | Description | Default
----------------|-------------|----------
`--appsco-list-item` | Mixin applied to root element | `{}`
`--appsco-list-item-icon` | Mixin applied to item image | `{}`
`--ppsco-list-item-icon-contain` | Mixin applied to iron-image #sizedImgDiv | `{}`
`--appsco-list-item-message` | Mixin applied to message | `{}`
`--appsco-list-item-date` | Mixin applied to date | `{}`

@demo demo/appsco-account-notification.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-image/iron-image.js';
import '../account/appsco-account-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoListItem extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: none;
                padding: 20px 16px 10px 6px;
                border-top: 1px solid var(--divider-color);
                line-height: 1.4;
                position: relative;

                @apply --appsco-list-item;
            }
            :host .item-icon {
                width: 32px;
                height: 32px;
                margin-right: 10px;
                @apply --appsco-list-item-icon;
            }
            :host .item-icon::shadow #sizedImgDiv {
                border-radius: 50%;
                @apply --appsco-list-item-icon-contain;
            }
            :host .item-date {
                font-size: 11px;
                position: absolute;
                top: 5px;
                right: 6px;
                opacity: 0.5;
                @apply --appsco-list-item-date;
            }
            :host .item-message {
                @apply --appsco-list-item-message;
            }
            appsco-account-image.preview-account-image {
                margin-right: 8px;
                --account-image: {
                    width: 28px;
                    height: 28px;
                };
                --account-initials-font-size: 12px;
            }
        </style>

        <div class="item layout horizontal center">
            <div class="item-date">[[ _dateFormat(item.date) ]]</div>

            <template is="dom-if" if="[[ item.icon ]]">
                <iron-image src="[[ item.icon ]]" sizing="contain" class="item-icon"></iron-image>
            </template>

            <template is="dom-if" if="[[ item.account ]]">
                <appsco-account-image account="[[ item.account ]]" class="preview-account-image"></appsco-account-image>
            </template>

            <div class="item-message flex">[[ item.message ]]</div>
        </div>
`;
  }

  static get is() { return 'appsco-list-item'; }

  static get properties() {
      return {
          item: {
              type: Object
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
          this.style.display = 'block';
      });

      afterNextRender(this, function() {
          this.playAnimation('entry');
      });
  }

  _dateFormat(value) {
      if (!value) {
          return '';
      }

      const options = {
          weekday: "long", year: "numeric", month: "short",
          day: "numeric", hour: "2-digit", minute: "2-digit"
      };

      return (new Date(value)).toLocaleDateString('en', options);
  }
}
window.customElements.define(AppscoListItem.is, AppscoListItem);
