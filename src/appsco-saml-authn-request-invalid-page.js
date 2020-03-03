import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import './shared-styles.js';
import './components/page/appsco-content.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoSamlAuthnRequestInvalidPage extends PolymerElement {
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
                <h2 class="title">Authentication Failed</h2>

                <div class="active-integrations-info">
                    <p>Authentication process was not successful.</p>
                    <p>
                        SAML authentication failed. Please contact your administrator for further support.
                    </p>

                    <paper-button class="provisioning-action" on-tap="_onBackToDashboardAction">Back to dashboard</paper-button>

                    <div>
                        <img src\$="[[rootPath]]images/provisioning/provisioning-integration-failed.png" class="image">
                    </div>
                </div>
            </div>
        </appsco-content>
`;
    }

    static get is() { return 'appsco-saml-authn-request-invalid-page'; }

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

    _onBackToDashboardAction() {
        this.dispatchEvent(new CustomEvent('back-to-dashboard', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoSamlAuthnRequestInvalidPage.is, AppscoSamlAuthnRequestInvalidPage);
