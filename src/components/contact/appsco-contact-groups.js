import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-contact-group-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoContactGroups extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-contact-groups;
            }
            :host .groups {
                @apply --layout-vertical;
                @apply --appsco-groups;
            }
            :host appsco-contact-groups-item:first-of-type {
                border-top: none;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host paper-progress {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-list-progress-bar;
            }
            .info-total {
                margin-top: 10px;
            }
            .total {
                @apply --paper-font-caption;
                color: var(--secondary-text-color);
            }

        </style>

        <iron-ajax id="ironAjaxGetGroups" url="[[ groupsApi ]]" on-response="_onGroupResponse" on-error="_handleError" headers="{{ _headers }}"></iron-ajax>

        <paper-progress id="progress" indeterminate=""></paper-progress>

        <div class="groups">
            <template is="dom-repeat" items="[[ _groups ]]" rendered-item-count="{{ renderedCount }}">
                <appsco-contact-group-item group="[[ item ]]" contact="[[ contact ]]" preview="[[ preview ]]">
                </appsco-contact-group-item>
            </template>
        </div>

        <template is="dom-if" if="{{ _message }}">
            <p class="message">
                [[ _message ]]
            </p>
        </template>

        <div class="info-total">
            <div class="total">
                Total groups: [[ _totalGroups ]]
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-contact-groups'; }

    static get properties() {
        return {
            contact: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            groupsApi: {
                type: String
            },

            _groups: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Number of groups to load.
             */
            size: {
                type: Number
            },

            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _message: {
                type: String
            },

            _totalGroups: {
                type: Number
            }
        };
    }

    loadGroups() {
        this.$.progress.hidden = false;
        this.set('_groups', []);
        this._message = '';
        this._totalGroups = 0;

        this.$.ironAjaxGetGroups.url = this._computeUrl(this.groupsApi);
        this.$.ironAjaxGetGroups.generateRequest();
    }

    removeGroup(group) {
        const _groups = JSON.parse(JSON.stringify(this._groups)),
            _length = _groups.length;

        for (let j = 0; j < _length; j++) {
            if (group.alias === _groups[j].alias) {
                this.splice('_groups', j, 1);
                break;
            }
        }

        this._totalGroups--;
    }

    _computeUrl(groupsApi) {
        return this.size ? groupsApi + '&limit=' + this.size : groupsApi;
    }

    _onGroupResponse(event) {
        const response = event.detail.response;
        if (!response) {
            return false;
        }
        this._groups = response ? response.company_groups : [];
        this._totalGroups = response.meta.total;

        if (!this._groups.length) {
            this._message = "Contact doesn't belong to any group.";
        }
        this.$.progress.hidden = true;
    }

    _handleError(event) {
        this._message = 'We couldn\'t load groups at the moment. Please try again in a minute. If error continues contact us.';
        this.$.progress.hidden = true;
    }
}
window.customElements.define(AppscoContactGroups.is, AppscoContactGroups);
