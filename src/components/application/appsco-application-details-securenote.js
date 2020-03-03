import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationDetailsSecureNote extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host div[label] {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                @apply --application-details-label;
            }

            :host div[content] {
                color: var(--primary-text-color);
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --paper-font-subhead;
                @apply --application-details-value;
            }

            :host .flex {
                @apply --layout-flex;
                white-space: pre-line;
                height: 200px;
                overflow-y: auto;
                overflow-x: hidden;
            }

            :host > div {
                margin: 6px 0;
            }

            .copy {
                padding-bottom: 180px;
            }

        </style>

        <template is="dom-if" if="[[ claims.note ]]">
            <div label="">Note</div>
            <div content="">
                <div class="flex">[[ claims.note ]]</div>
                <div class="copy">
                    <appsco-copy value="[[ claims.note ]]"></appsco-copy>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-application-details-securenote'; }

    static get properties() {
        return {
            claims: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            }
        };
    }
}
window.customElements.define(AppscoApplicationDetailsSecureNote.is, AppscoApplicationDetailsSecureNote);
