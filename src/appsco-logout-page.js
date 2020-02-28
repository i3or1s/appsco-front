import '@polymer/polymer/polymer-legacy.js';
import './components/components/appsco-loader.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoLogoutPage extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;

                --appsco-loader: {
                     width: 48px;
                     height: 48px;
                 };
            }
        </style>

        <appsco-loader active="" multi-color=""></appsco-loader>
`;
  }

  static get is() { return 'appsco-logout-page'; }

  static get properties() {
      return {
          logoutApi: {
              type: String
          }
      };
  }

  ready() {
      super.ready();

      window.location.href = this.logoutApi;
  }
}
window.customElements.define(AppscoLogoutPage.is, AppscoLogoutPage);
