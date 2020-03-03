import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyNotice extends PolymerElement {
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
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host appsco-loader {
                @apply --paper-dialog-appsco-loader;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Notice</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <p>[[ notice ]]</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button autofocus="" on-tap="_onConfirmAction">OK</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-company-notice'; }

    static get properties() {
        return {
            notice: {
                type: String,
                value: ''
            },

            noticeEvent: {
                type: String,
                value: ''
            },

            _loader: {
                type: Boolean,
                value: false
            }
        };
    }

    setNotice(notice) {
        this.notice = notice;
    }

    setNoticeEvent(noticeEvent) {
        this.noticeEvent = noticeEvent;
    }

    open() {
        this.$.dialog.open();
    }

    close() {
        this.$.dialog.close();
    }

    toggle() {
        this.$.dialog.toggle();
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _onDialogClosed() {
        this.dispatchEvent(new CustomEvent(this.noticeEvent, { bubbles: true, composed: true }));
        this._hideLoader();
    }

    _onConfirmAction() {
        this._showLoader();
        this.close();
    }
}
window.customElements.define(AppscoCompanyNotice.is, AppscoCompanyNotice);
