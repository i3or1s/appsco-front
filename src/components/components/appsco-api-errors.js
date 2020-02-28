/*
`appsco-api-errors`
Handles API error translations.

Example:
      <appsco-api-errors language=""></appsco-api-errors>

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApiErrors extends mixinBehaviors([AppLocalizeBehavior], PolymerElement) {
  static get template() {
    return html`

`;
  }

  static get is() { return 'appsco-api-errors'; }

  static get properties() {
      return {
          name: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          },

          language: {
              value: 'en',
              type: String
          },

          useKeyIfMissing: {
              type: Boolean,
              value: true
          },

          defaultError: {
              type: Number,
              value: 404
          }
      };
  }

  ready() {
      super.ready();

      afterNextRender(this, function() {
          this.set('name', this);
          this.loadResources('./data/appsco-api-errors.json');
      });
  }

  /**
   * Returns translation for error based on provided error code.
   *
   * @param {String} code The code for which to return error message.
   * @returns {string} Translated error message if exists. Otherwise, it returns given code.
   */
  getError(code) {
      const message = this.localize(code);

      return (!message || code === message) ? this.localize(this.defaultError) : message;
  }
}
window.customElements.define(AppscoApiErrors.is, AppscoApiErrors);
