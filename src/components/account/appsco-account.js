/**
`appsco-account`
Component that represents composition of components related to appsco account.

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
class AppscoAccount extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
            }
        </style>

        <p>
            Component that represents composition of components related to appsco account.
        </p>
`;
  }

  static get is() { return 'appsco-account'; }
}
window.customElements.define(AppscoAccount.is, AppscoAccount);
