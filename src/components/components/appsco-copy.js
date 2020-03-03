import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCopy extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
            }
            :host paper-icon-button {
                @apply --appsco-copy-action;
            }
        </style>
        <paper-icon-button icon="icons:content-copy" id="icon" hidden="[[ !value ]]"></paper-icon-button>
`;
    }

    static get is() { return 'appsco-copy'; }

    static get properties() {
        return {
            value: {
                type: String,
                value: null
            },

            name: {
                type: String,
                value: ''
            }
        };
    }

    constructor() {
        super();
        this._iconSet = undefined;
    }

    ready() {
        super.ready();

        afterNextRender(this, function () {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('tap', this._copy);
    }

    _setSuccessIcon() {
        const me = this;
        clearTimeout(this._iconSet);
        this._iconSet = setTimeout(function () {
            me.$.icon.setAttribute('icon', 'content-copy');
        }, 1000);
        this.$.icon.setAttribute('icon', 'icons:done');
    }

    _copy() {
        const input = document.createElement('span'),
            textNodeValue = document.createTextNode(this.value),
            range = document.createRange();

        input.appendChild(textNodeValue);

        document.body.appendChild(input);

        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }

        range.selectNodeContents(input);
        window.getSelection().addRange(range);

        document.execCommand('copy');

        input.remove();

        this.dispatchEvent(new CustomEvent('copied', {
            bubbles: true,
            composed: true,
            detail: {
                name: this.name
            }
        }));

        this._setSuccessIcon();
    }
}
window.customElements.define(AppscoCopy.is, AppscoCopy);
