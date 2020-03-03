import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountImage extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            :host .account-image {
                @apply --layout-vertical;
                @apply --layout-center-justified;
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 50%;
                @apply --account-image;
            }
            :host .account-image::shadow #sizedImgDiv, :host .account-image::shadow #placeholder {
                border-radius: 50%;
            }
            :host .account-initials {
                background-color: var(--account-initials-background-color, #f5f8fa);
                color: var(--primary-text-color);
            }
            :host .account-initials .initials {
                text-align: center;
                text-transform: uppercase;
                font-size: var(--account-initials-font-size, 18px);
                line-height: var(--account-initials-font-size, 18px);
                color: var(--account-initials-font-color);
            }
        </style>

            <template is="dom-if" if="[[ _pictureUrl ]]">
                <iron-image class="account-image" sizing="cover" preload="" fade="" src="[[ _pictureUrl ]]"></iron-image>
            </template>

            <template is="dom-if" if="[[ !_pictureUrl ]]">
                <div class="account-image account-initials">
                    <span class="initials">[[ _accountInitials ]]</span>
                </div>
            </template>
`;
    }

    static get is() { return 'appsco-account-image'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _accountInitials: {
                type: String,
                computed: '_computeAccountInitials(account)'
            },

            _pictureUrl: {
                type: String,
                computed: '_computePictureUrl(account)'
            }
        };
    }

    _computePictureUrl(account) {
        if (!account) {
            return '';
        }
        if (account.account && account.account.picture_url) {
            return account.account.picture_url;
        }
        return account.picture_url ? account.picture_url : null;
    }

    _computeAccountInitials(account) {
        const acc = (account && !!account.account) ? account.account : account;
        let initials = '';

        if (acc && acc.first_name && acc.last_name) {
            initials = acc.first_name.substring(0, 1) + acc.last_name.substring(0, 1);
        }
        else if (acc && acc.name) {
            initials = acc.name.substring(0, 2);
        }
        if(acc && acc.email && '' === initials) {
            initials = acc.email.substring(0, 2);
        }

        return initials;
    }
}
window.customElements.define(AppscoAccountImage.is, AppscoAccountImage);
