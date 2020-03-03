import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../../components/appsco-loader.js';
import '../../components/appsco-form-error.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountDisapproveDevice extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-account-disapprove-device;

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

            <h2>Disapprove device</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div>
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
                    <p>Please confirm that you want to disapprove chosen device.</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onDisapproveAction">Disapprove</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-account-disapprove-device'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            device: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _disapproveDeviceApi: {
                type: String,
                computed: '_computeDisapproveApi(device)'
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

    setDevice(device) {
        this.set('device', device);
    }

    setAccount(account) {
        this.set('account', account);
    }

    open () {
        this.$.dialog.open();
    }

    close () {
        this.$.dialog.close();
    }

    _computeDisapproveApi(device) {
        return device.meta ? device.meta.disapprove : null;
    }

    _onDialogClosed() {
        this._errorMessage = '';
        this._loader = false;
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

    _onDisapproveAction() {
        const request = document.createElement('iron-request'),
            options = {
                url: this._disapproveDeviceApi,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            };

        this._showLoader();

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('device-disapprove-finished', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        device: this.device
                    }
                }));

                this.close();
            }

        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this._hideLoader();
        }.bind(this));
    }
}
window.customElements.define(AppscoAccountDisapproveDevice.is, AppscoAccountDisapproveDevice);
