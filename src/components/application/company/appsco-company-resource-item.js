import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-styles/typography.js';
import { AppscoListItemBehavior } from '../../components/appsco-list-item-behavior.js';
import '../../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyResourceItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                width: 100%;
                margin: 0 0 10px 0;

                --icon-action-border-radius: 16px;
            }
            :host([resource-admin]) .item {
                cursor: default;
                @apply --appsco-list-item;
            }
            :host([resource-admin]) .item:hover, :host([resource-admin][activated]) .item {
                @apply --shadow-elevation-2dp;
                @apply --appsco-list-item-activated;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="item" on-tap="_onItemAction">

            <template is="dom-if" if="[[ _selectable ]]">
                <div class="select-action" on-tap="_onSelectItemAction">
                    <iron-image class="item-icon" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="cover" preload="" fade="" src="[[ _resourceIcon ]]"></iron-image>

                    <div class="icon-action">
                        <div class="iron-action-inner">
                            <iron-icon icon="icons:check"></iron-icon>
                        </div>
                    </div>
                </div>
            </template>

            <template is="dom-if" if="[[ !_selectable ]]">
                <iron-image class="item-icon not-selectable" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="cover" preload="" fade="" src="[[ _resourceIcon ]]"></iron-image>
            </template>

            <template is="dom-if" if="[[ !displayGrid ]]">
                <div class="item-info item-basic-info">
                    <span class="info-label item-title">[[ item.title ]]</span>
                    <span class="info-value">[[ _resourceType ]]</span>
                </div>

                <template is="dom-if" if="[[ !resourceAdmin ]]">
                    <div class="item-info item-additional-info">

                        <template is="dom-if" if="[[ _groups ]]">
                            <div class="info">
                                <span class="info-label">Groups:&nbsp;</span>
                                <span class="info-value">[[ _groups ]]</span>
                            </div>
                        </template>
                    </div>
                </template>
            </template>

            <template is="dom-if" if="[[ displayGrid ]]">
                <div class="resource-title">
                    [[ item.title ]]
                </div>
            </template>


            <div class="actions">
                <paper-button on-tap="_onItemSettingsAction">Settings</paper-button>
                <paper-button on-tap="_onEditItemAction">Edit</paper-button>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-company-resource-item'; }

    static get properties() {
        return {
            resourceAdmin: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _selectable: {
                type: Boolean,
                computed: '_computeSelectableState(selectable, resourceAdmin)'
            },

            _resourceIcon: {
                type: String,
                computed: '_computeResourceIcon(item)'
            },

            _resourceType: {
                type: String,
                computed: '_computeResourceType(item)'
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            displayGrid: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    _computeSelectableState(selectable, resourceAdmin) {
        return (selectable && !resourceAdmin);
    }

    _computeResourceIcon(resource) {
        return resource.application_url ? resource.application_url : (resource.icon_url ? resource.icon_url : null);
    }

    _computeResourceType(resource) {
        switch (resource.auth_type) {
            case 'rdp':
                return 'Remote Desktop Protocol';
            case 'login':
                return 'Login';
            case 'cc':
                return 'Credit Card';
            case 'softwarelicence':
                return 'Software Licence';
            case 'passport':
                return 'Passport';
            case 'securenote':
                return 'Secure Note';
            case 'none':
                return 'Link';
            default:
                return 'Application';
        }
    }

    _onItemSettingsAction(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.dispatchEvent(new CustomEvent('resource-settings', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.item
            }
        }));
    }
}
window.customElements.define(AppscoCompanyResourceItem.is, AppscoCompanyResourceItem);
