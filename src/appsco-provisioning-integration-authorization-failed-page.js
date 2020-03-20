import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import './shared-styles.js';
import './components/page/appsco-content.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoProvisioningIntegrationAuthorizationFailedPage extends PolymerElement {
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
                <h2 class="title">Authorization Failed</h2>

                <div class="active-integrations-info">
                    <p>Authorization process was not successful.</p>
                    <p>
                        Please proceed to Provisioning page and try again. If failure continues please contact AppsCo support.
                    </p>

                    <paper-button class="provisioning-action" on-tap="_onProvisioningAction">Provisioning</paper-button>

                    <div>
                        <img src\$="[[ resolveUrl('./../images/provisioning/provisioning-integration-failed.png') ]]" class="image">
                    </div>
                </div>
            </div>
        </appsco-content>
`;
    }

    static get is() { return 'appsco-provisioning-integration-authorization-failed-page'; }

    static get properties() {
        return {
            pageLoaded: {
                type: Boolean,
                value: false
            }
        };
    }

    static get importMeta() {
        return import.meta;
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
window.customElements.define(AppscoProvisioningIntegrationAuthorizationFailedPage.is, AppscoProvisioningIntegrationAuthorizationFailedPage);
