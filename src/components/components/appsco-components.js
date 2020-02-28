/**
`appsco-components`
Is used to hold all appsco independent elements.

@demo demo/index.html 
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoComponents extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
            }
        </style>
        <h2>Hello [[prop1]]</h2>
`;
  }

  static get is() { return 'appsco-components'; }

  static get properties() {
      return {
          prop1: {
              type: String,
              value: 'appsco-components',
          },
      };
  }
}
window.customElements.define(AppscoComponents.is, AppscoComponents);
