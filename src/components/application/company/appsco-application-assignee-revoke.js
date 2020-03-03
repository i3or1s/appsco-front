import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../../components/appsco-loader.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationAssigneeRevoke extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
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
        
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <h2>Revoke access</h2>

            <div class="remove-container">
                <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is revoking access" multi-color=""></appsco-loader>
                <p>Please confirm access revoking for [[ assignee.display_name ]].</p>
            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="_onRevokeAccessAction">Revoke</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-application-assignee-revoke'; }

    static get properties() {
        return {
            /**
             * Assignee to revoke access for.
             */
            assignee: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _loader: {
                type: Boolean,
                value: false
            }
        };
    }

    toggle() {
        this.$.dialog.toggle();
    }

    setAssignee(assignee) {
        this.set('assignee', assignee);
    }

    _onRevokeAccessAction() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.assignee.meta.revoke,
                method: 'DELETE',
                handleAs: 'json',
                headers: this._headers
            };

        this._loader = true;

        request.send(options).then(function() {
            this._loader = false;

            this.dispatchEvent(new CustomEvent('access-revoked', {
                bubbles: true,
                composed: true,
                detail: {
                    assignee: this.assignee,
                    application: request.response
                }
            }));

            this.$.dialog.close();
        }.bind(this));
    }
}
window.customElements.define(AppscoApplicationAssigneeRevoke.is, AppscoApplicationAssigneeRevoke);
