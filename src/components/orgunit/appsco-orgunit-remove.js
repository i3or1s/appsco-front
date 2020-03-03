import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoOrgUnitRemove extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            @apply --appsco-orgunit-remove;
            }
            :host paper-dialog {
                width: 670px;
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
        <paper-dialog id="removeDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <div class="remove-container">

                <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is removing organization unit" multi-color=""></appsco-loader>

                <h2>Remove organization unit [[ orgUnit.name ]]</h2>

                <template is="dom-if" if="[[ _errorMessage ]]">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
                </template>

                <p>Your users that are assigned to [[ orgUnit.name ]] will not be removed.</p>
            </div>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_remove">Remove</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-orgunit-remove'; }

    static get properties() {
        return {
            orgUnit: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String,
                value: ''
            }
        };
    }

    open() {
        this.$.removeDialog.open();
    }

    _onDialogClosed() {
        this._errorMessage = '';
        this._loader = false;
    }

    _remove() {
        const appRequest = document.createElement('iron-request');

        this._loader = true;

        appRequest.send({
            url: this.orgUnit.self,
            method: "DELETE",
            handleAs: 'json',
            headers: this._headers
        }).then(function() {
            this.dispatchEvent(new CustomEvent('orgunit-removed', {
                bubbles: true,
                composed: true,
                detail: {
                    orgUnit: this.orgUnit
                }
            }));

            this.$.removeDialog.close();
        }.bind(this), function() {
            this._loader = false;
            this._errorMessage = 'It is not allowed to remove organization unit which have applications or accounts assigned to it.';
        }.bind(this));
    }
}
window.customElements.define(AppscoOrgUnitRemove.is, AppscoOrgUnitRemove);
