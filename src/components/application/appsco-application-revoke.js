import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import './appsco-application-subscribers.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationRevoke extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-application-revoke;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>
        <paper-dialog id="removeDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <h2>Remove resource [[ applicationInstance.application.title ]]</h2>

            <div class="remove-container">
                <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is revoking access" multi-color=""></appsco-loader>
                <p>Are you sure you want to remove resource [[ applicationInstance.application.title ]]?</p>
            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="_revokeAccess">Revoke</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-application-revoke'; }

    static get properties() {
        return {
            /**
             * [Application](https://developers.appsco.com/api/dashboard/id/icons/id) that is to be rendered
             */
            applicationInstance: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            _loader: {
                type: Boolean,
                value: false
            }
        };
    }

    open() {
        this.$.removeDialog.open();
    }

    _revokeAccess() {
        const revokeUri = this.applicationInstance.self;

        const appRequest = document.createElement('iron-request');

        this._loader = true;

        appRequest.send({
            url: revokeUri,
            method: "DELETE",
            handleAs: 'json',
            headers: this._headers
        }).then(function() {
            this._loader = false;

            this.dispatchEvent(new CustomEvent('application-instance-removed', {
                bubbles: true,
                composed: true,
                detail: {
                    applicationInstance: this.applicationInstance
                }
            }));

            this.$.removeDialog.close();
        }.bind(this));
    }
}
window.customElements.define(AppscoApplicationRevoke.is, AppscoApplicationRevoke);
