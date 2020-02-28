import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import './shared-styles.js';
import './components/page/appsco-content.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoProvisioningIntegrationAuthorizationSuccessPage extends PolymerElement {
  static get template() {
    return html`
        <style include="webkit-scrollbar-style">
            :host {
                display: block;
                font-size: 14px;

                --appsco-content-sections: {
                    padding: 0;
                };
            }
            :host div[content] {
                padding: 10px;
                color: var(--primary-text-color);
                text-align: center;
            }
            .provisioning-action {
                @apply --primary-button;
                display: inline-block;
                margin-top: 20px;
                margin-bottom: 40px;
            }
            .image {
                max-width: 100%;
            }
        </style>

        <appsco-content id="appscoContent">

            <div content="" slot="content">
                <h2 class="title">Authorization Success</h2>

                <div class="active-integrations-info">
                    <p>Authorization process was successful.</p>
                    <p>
                        Please proceed to Provisioning page and sync remote accounts with AppsCo.
                    </p>

                    <paper-button class="provisioning-action" on-tap="_onProvisioningAction">Provisioning</paper-button>

                    <div>
                        <img src\$="[[rootPath]]images/provisioning/provisioning-integration-success.png" class="image">
                    </div>
                </div>
            </div>
        </appsco-content>
`;
  }

  static get is() { return 'appsco-provisioning-integration-authorization-success-page'; }

  static get properties() {
      return {
          pageLoaded: {
              type: Boolean,
              value: false
          }
      };
  }

  ready() {
      super.ready();

      this.pageLoaded = false;
      afterNextRender(this, function() {
          this._pageLoaded();
      });
  }

  _pageLoaded() {
      this.pageLoaded = true;
      this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
  }

  _onProvisioningAction() {
      this.dispatchEvent(new CustomEvent('provisioning', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoProvisioningIntegrationAuthorizationSuccessPage.is, AppscoProvisioningIntegrationAuthorizationSuccessPage);
