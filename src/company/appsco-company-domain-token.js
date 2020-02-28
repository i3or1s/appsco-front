/*
`appsco-company-domain-token`
Shows dialog screen with confirmation for account removal from organization unit.

    <appsco-company-domain-token domain="{}" authorization-token="">
    </appsco-company-domain-token>

### Styling

`<appsco-company-domain-token>` provides the following custom properties and mixins for styling:

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '../components/components/appsco-copy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoCompanyDomainToken extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-company-domain-token;

                --form-error-box: {
                     margin-top: 0;
                 };
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            .emphasized {
                font-weight: 500;
            }
            .token-container {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            .token {
                @apply --paper-font-common-nowrap;
                color: var(--success-color);
            }
            appsco-copy {
                @apply --layout-flex-none;

                --appsco-copy-action: {
                    width: 24px;
                    height: 24px;
                    padding: 4px;
                    margin: 0 0 0 5px;
                };
            }
            .learn-more-action {
                @apply --link-button;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Token</h2>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <p>Before you verify domain</p>
                    <p class="emphasized">[[ domain.domain ]]</p>
                    <p>
                        You must copy and paste DNS verification code to the TXT record section
                        to prove that you own it.
                    </p>
                    <p class="token-container">
                        <span class="token">[[ domain.verification_code ]]</span>
                        <appsco-copy value="[[ domain.verification_code ]]" id="companyTokenCopyButton"></appsco-copy>
                    </p>
                    <p>
                        <a href="https://support.appsco.com/hc/en-gb/articles/115002896305-Domain-Verification-guideline" target="_blank" rel="noopener noreferrer" class="learn-more-action">Learn more about how to enter the DNS verification token.</a>
                    </p>
                    <p>Normally it can take up to 24h for DNS to be refreshed. If the domain is not verified, please wait, and try again a bit later.</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="" id="companyTokenCloseButton">Close</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-company-domain-token'; }

  static get properties() {
      return {
          domain: {
              type: Array,
              value: function () {
                  return {};
              }
          },

          token: {
              type: String,
              value: 'DVH4KHonhRQtsksUx4UPbm4JgvqoGLD3AVS8RQVgG3eT_W6NhXb1yB92OnmWREqWp66e7KGMwGT_a4E'
          }
      };
  }

  setDomain(domain) {
      this.domain = domain;
  }

  open () {
      this.$.dialog.open();
  }

  close () {
      this.$.dialog.close();
  }

  toggle () {
      this.$.dialog.toggle();
  }

  _onDialogClosed() {}
}
window.customElements.define(AppscoCompanyDomainToken.is, AppscoCompanyDomainToken);
