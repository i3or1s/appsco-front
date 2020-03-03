import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDeleteGroups extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
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

            <div class="header">
                <h2>Groups delete</h2>
            </div>

            <paper-dialog-scrollable>
                <div class="remove-container">

                    <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

                    <p>Please confirm deleting of selected groups.</p>

                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="_onDeleteAction">Delete</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-delete-groups'; }

    static get properties() {
        return {
            groups: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            companyApi: {
                type: String
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

    _onDeleteAction() {
        let groups = this.groups,
            length = groups.length - 1,
            appRequest = document.createElement('iron-request'),
            options = {
                url: this.companyApi + '/group',
                method: 'DELETE',
                handleAs: 'json',
                headers: this._headers
            },
            body = '';

        this._loader = true;

        for (let i = 0; i <= length; i++) {
            let next = (i === length) ? '' : '&';
            body += 'groups[]=' + encodeURIComponent(groups[i].self) + next;
        }

        options.body = body;

        appRequest.send(options).then(function(request) {
            this.$.dialog.close();

            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('groups-removed', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        contacts: request.response.groups
                    }
                }));
            }
            else {
                this.dispatchEvent(new CustomEvent('groups-remove-failed', { bubbles: true, composed: true }));
            }

            this.set('groups', []);
            this._loader = false;
        }.bind(this));
    }
}
window.customElements.define(AppscoDeleteGroups.is, AppscoDeleteGroups);
