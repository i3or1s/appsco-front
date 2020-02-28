/*
`appsco-group-card`
Presents group in form of a card which contains group name and close action if needed.

    <appsco-group-card group="{}"
                       remove-action>
    </appsco-group-card>

### Styling

`<appsco-group-card>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-group-card` | Mixin applied to the root element | `{}`
`--group-card` | Mixin applied to group card | `{}`
`--group-name` | Mixin applied to group name | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoGroupCard extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: none;
                @apply --appsco-group-card;
            }
            .group-card {
                @apply --shadow-elevation-2dp;
                @apply --layout-horizontal;
                @apply --layout-center;
                width: 142px;
                height: 24px;
                line-height: 24px;
                padding: 4px;
                font-size: 13px;
                cursor: pointer;
                position: relative;
                border-radius: 3px;
                @apply --group-card;
            }
            .group-name {
                @apply --layout-flex;
                @apply --paper-font-common-nowrap;
                text-align: center;
                @apply --group-name;
            }
            .clear-icon {
                width: 14px;
                height: 14px;
                position: absolute;
                top: 2px;
                right: 0;
            }
        </style>

        <div class="group-card">
            <span class="group-name">[[ group.name ]]</span>

            <template is="dom-if" if="[[ removeAction ]]">
                <iron-icon icon="icons:clear" class="clear-icon"></iron-icon>
            </template>

        </div>
`;
  }

  static get is() { return 'appsco-group-card'; }

  static get properties() {
      return {
          group: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          removeAction: {
              type: Boolean,
              value: false
          },

          animationConfig: {
              value: function () {
                  return {

                  }
              }
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
                  duration: 100
              }
          },
          'exit': {
              name: 'fade-out-animation',
              node: this,
              timing: {
                  duration: 200
              }
          }
      };

      beforeNextRender(this, function() {
          this.style.display = 'flex';
      });

      afterNextRender(this, function() {
          this.playAnimation('entry');
          this._addListeners();
      })
  }

  _addListeners() {
      this.addEventListener('tap', this._onTap);
      this.addEventListener('neon-animation-finish', this._onAnimationFinish);
  }

  _onTap() {
      this.playAnimation('exit', {
          exit: true
      });
  }

  _onAnimationFinish(event) {
      if (event.detail.exit) {
          this.dispatchEvent(new CustomEvent('selected', {
              bubbles: true,
              composed: true,
              detail: {
                  group: this.group
              }
          }));
      }
  }
}
window.customElements.define(AppscoGroupCard.is, AppscoGroupCard);
