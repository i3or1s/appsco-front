/*
`appsco-application-card`
Presents application in form of a card which contains image, title and close action if needed.

    <appsco-application-card application="{}">
    </appsco-application-card>

### Styling

`<appsco-application-card>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-application-card` | Mixin applied to the root element | `{}`
`--application-card` | Mixin applied to application card | `{}`
`--application-image` | Mixin applied to application image | `{}`
`--application-title` | Mixin applied to application title | `{}`

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
import '@polymer/iron-image/iron-image.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationCard extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: none;
            @apply --appsco-application-card;
            }
            .application-card {
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
            @apply --application-card;
            }
            .application-image {
            @apply --layout-flex-none;
                width: 22px;
                height: 22px;
                margin-right: 4px;
            @apply --application-image;
            }
            .application-title {
            @apply --layout-flex;
            @apply --paper-font-common-nowrap;
            @apply --application-title;
            }
            .clear-icon {
                width: 14px;
                height: 14px;
                position: absolute;
                top: 2px;
                right: 0;
            }
        </style>

        <div class="application-card">

            <iron-image class="application-image" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="cover" preload="" fade="" src="[[ _applicationImage ]]"></iron-image>

            <span class="application-title">[[ application.title ]]</span>

            <template is="dom-if" if="[[ removeAction ]]">
                <iron-icon icon="icons:clear" class="clear-icon"></iron-icon>
            </template>
        </div>
`;
  }

  static get is() { return 'appsco-application-card'; }

  static get properties() {
      return {
          application: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          removeAction: {
              type: Boolean,
              value: false
          },

          _applicationImage: {
              type: String,
              computed: '_computeApplicationImage(application)'
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
                  duration: 100
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
          this.style.display = 'flex';
      });

      afterNextRender(this, function () {
          this.playAnimation('entry');
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('tap', this._onTap);
      this.addEventListener('neon-animation-finish', this._onAnimationFinish);
  }

  _computeApplicationImage(application) {
      return application.icon_url ? application.icon_url : application.application_url;
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
                  application: this.application
              }
          }));
      }
  }
}
window.customElements.define(AppscoApplicationCard.is, AppscoApplicationCard);
