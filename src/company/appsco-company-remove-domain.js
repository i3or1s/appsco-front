import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyRemoveDomain extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-domain-remove;

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
            :host appsco-loader {
                @apply --paper-dialog-appsco-loader;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Remove [[ domain.domain ]]</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="remove-container">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
                    <p>Please confirm removal of [[ domain.domain ]] from company.</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_remove">Remove</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-company-remove-domain'; }

    static get properties() {
        return {
            domain: {
                type: Array,
                value: function () {
                    return {};
                }
            },

            _removeDomainApi: {
                type: String,
                computed: '_computeRemoveDomainApi(domain)'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
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

    _computeRemoveDomainApi(domain) {
        return domain.self ? domain.self : '';
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _onDialogClosed() {
        this._hideError();
        this._hideLoader();
    }

    _remove() {
        var request = document.createElement('iron-request'),
            options = {
                url: this._removeDomainApi,
                method: 'DELETE',
                handleAs: 'json',
                headers: this._headers
            };

        this._showLoader();

        request.send(options).then(function() {
            this.close();

            this.dispatchEvent(new CustomEvent('domain-removed', {
                bubbles: true,
                composed: true,
                detail: {
                    domain: this.domain
                }
            }));
        }.bind(this), function() {
            if (request.status === 404) {
                this._showError('We couldn\'t remove domain from company. Please try again in a minute.');
            }

            this._hideLoader();
        }.bind(this));
    }
}
window.customElements.define(AppscoCompanyRemoveDomain.is, AppscoCompanyRemoveDomain);
