import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoResourceRemoveFromGroup extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-resource-remove-from-group;

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

            <h2>Remove from group</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="remove-container">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <template is="dom-if" if="[[ _resourceType ]]">
                        <p>Removing resource from group also removes access for accounts which belongs to group.</p>
                    </template>

                    <template is="dom-if" if="[[ _roleType ]]">
                        <p>Removing user from group also removes access to applications shared to group.</p>
                    </template>

                    <template is="dom-if" if="[[ _contactType ]]">
                        <p>Removing contact from group also removes access to applications shared to group.</p>
                    </template>

                    <p>Please confirm remove action.</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onRemoveAction">Remove</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-resource-remove-from-group'; }

    static get properties() {
        return {
            group: {
                type: Array,
                value: function () {
                    return {};
                }
            },

            /**
             * Item to remove from group.
             */
            item: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            resourceType: {
                type: String,
                value: ''
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _removeFromGroupsApi: {
                type: String,
                computed: '_computeRemoveFromGroupApi(group, resourceType)'
            },

            _responseItems: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _resourceType: {
                type: Boolean,
                computed: '_computeResourceType(resourceType)'
            },

            _roleType: {
                type: Boolean,
                computed: '_computeRoleType(resourceType)'
            },

            _contactType: {
                type: Boolean,
                computed: '_computeContactType(resourceType)'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _requests: {
                type: Number,
                value: 0
            }
        };
    }

    setGroup(group) {
        this.group = group;
    }

    setItem(item) {
        this.item = item;
    }

    setType(type) {
        this.resourceType = type;
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

    _computeRemoveFromGroupApi(group, resourceType) {
        for (const key in group) {
            return ('resource' === resourceType)
                ? group.meta.applications
                : ('role' === resourceType)
                    ? group.meta.company_roles
                    : ('contact' === resourceType)
                        ? group.meta.contacts
                        : '';
        }

        return '';
    }

    _computeResourceType(resourceType) {
        return 'resource' === resourceType;
    }

    _computeRoleType(resourceType) {
        return 'role' === resourceType;
    }

    _computeContactType(resourceType) {
        return 'contact' === resourceType;
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

    _onRemoveAction() {
        const request = document.createElement('iron-request'),
            options = {
                url: this._removeFromGroupsApi + '/' + this.item.alias,
                method: 'DELETE',
                handleAs: 'json',
                headers: this._headers
            };

        if (!this._removeFromGroupsApi) {
            this._showError(this.apiErrors.getError(404));
            return false;
        }

        this._hideError();
        this._showLoader();

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('resource-removed-from-group', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        group: this.group,
                        item: request.response,
                        resourceType: this.resourceType
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
window.customElements.define(AppscoResourceRemoveFromGroup.is, AppscoResourceRemoveFromGroup);
