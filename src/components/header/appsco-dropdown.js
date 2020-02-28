/**
`appsco-dropdown` represents dropdown component.
It displays dropdown with given content. On click outside content it closes dropdown.

Example:

    <body>
        <appsco-dropdown></appsco-dropdown>

### Styling

`<appsco-dropdown>` provides the following custom mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--dropdown-caret-background-color` | Color for caret of dropdown element. | `#ffffff`
`--appsco-dropdown` | Mixin applied to root appsco-dropdown element. | `{}`
`--appsco-dropdown-caret` | Mixin applied to the caret of root element. Use it to hide it where needed. | `{}`

@demo demo/appsco-dropdown.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/slide-from-bottom-animation.js';
import '@polymer/neon-animation/animations/slide-down-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoDropdown extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: none;
                background: transparent;
                position: absolute;
                right: 0;
                top: 30px;
                width: 350px;
                z-index: 999;
                padding: 0;
                margin: 0;

                --appsco-account-info-dropdown: {
                    width: 350px;
                };

                @apply --appsco-dropdown;
            }
            :host .content {
                height: 100%;
                background-color: #ffffff;

                @apply --shadow-elevation-2dp;
            }
            :host .caret {
                height: 10px;
                position: relative;
                overflow: hidden;
                z-index: 100;
                @apply --appsco-dropdown-caret;
            }
            :host .caret > div:first-child {
                width: 0;
                height: 0;
                border-left: 11px solid transparent;
                border-right: 11px solid transparent;
                border-bottom: 11px solid rgba(0,0,0, 0.2);
                position: absolute;
                right: 10px;
            }
            :host .caret > div:last-child {
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 10px solid var(--dropdown-caret-background-color, #ffffff);
                position: absolute;
                right: 11px;
            }
        </style>

        <div class="caret">
            <div></div>
            <div></div>
        </div>

        <div class="content"><slot></slot></div>
`;
  }

  static get is() { return 'appsco-dropdown'; }

  static get properties() {
      return {
          /**
           * Indicates whether dropdown is opened or not.
           */
          open: {
              type: Boolean,
              value: false,
              notify: true
          },

          /**
           * Indicates if user clicks inside dropdown.
           */
          trigger: {
              type: Object,
              value: {},
              notify: true
          },

          /**
           * Indicates if dropdown should be closed on click outside.
           */
          dontCloseOutside: {
              type: Boolean,
              value: false
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
              name: 'scale-up-animation',
              node: this,
              axis: 'y',
              transformOrigin: '0 0',
              timing: {
                  duration: 300
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
      afterNextRender(this, function() {
          this._addListeners();
          if (!this.dontCloseOutside) {
              gestures.add(document, 'tap', this._handleDocumentClick.bind(this));
          }
      });
  }

  _addListeners() {
      this.addEventListener('neon-animation-finish', this._onAnimationFinish);
      this.addEventListener('open-changed', this._openChanged);
  }

  toggle() {
      this.open = !this.open;
  }

  /**
   * Evaluates if item is in given path.
   *
   * @param {HTMLElement} element The element to be evaluated.
   * @param {Array<HTMLElement>=} path Elements in path to be checked against item element.
   * @return {Boolean}
   *
   * @private
   */
  _isInPath(path, element) {
      path = path || [];

      for (let i = 0; i < path.length; i++) {
          if (path[i] == element) {
              return true;
          }
      }

      return false;
  }

  /**
   * Listens for click outside of dropdown in order to close it.
   * @private
   */
  _handleDocumentClick(event) {
      const path = dom(event).path;

      if (this.trigger && !this._isInPath(path, this) && !this._isInPath(path, this.trigger)) {
          this.open = false;
      }
  }

  /**
   * It is called after dropdown animation is finished.
   * @private
   */
  _onAnimationFinish() {
      if (!this.open) {
          this.style.display = 'none';
      }
  }

  /**
   * Listen for 'open' property change.
   * If it is true it shows the dropdown.
   * If it is false it hides the dropdown.
   * @private
   */
  _openChanged() {
      if (this.open) {
          this.style.display = 'block';
          this.playAnimation('entry');
      }
      else {
          this.playAnimation('exit');
      }
  }
}
window.customElements.define(AppscoDropdown.is, AppscoDropdown);
