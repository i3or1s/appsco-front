import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import './appsco-directory-role-resource-admin-applications.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDirectoryRoleResourceAdminApplicationsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                    border-bottom: 1px solid var(--divider-color);
                };

                --appsco-directory-role-application: {
                     background-color: var(--body-background-color);
                 };
            }
            :host paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    @apply --full-page-paper-card-header-text;
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
            .info p {
                margin-top: 5px;
                margin-bottom: 0;
            }
            .info {
                margin-bottom: 20px;
            }
            .add-action {
                @apply --primary-button;
                display: inline-block;
            }
        </style>

        <paper-card heading="Resource admin" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_back"></paper-icon-button>

            <div class="card-content layout vertical">

                <div>
                    <paper-button class="add-action" on-tap="_onAddResourceAction">Add resource</paper-button>
                </div>

                <template is="dom-if" if="[[ !_applicationsEmpty ]]">
                    <div class="info">
                        <p>The user can modify setting for the following resources</p>
                    </div>
                </template>

                <appsco-directory-role-resource-admin-applications id="appscoDirectoryRoleResourceAdminApplications" company-role="[[ role ]]" authorization-token="[[ authorizationToken ]]" load-more="" size="5" on-resource-admin-applications-empty="_onApplicationsEmpty" on-resource-admin-applications-loaded="_onApplicationsLoaded"></appsco-directory-role-resource-admin-applications>

            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-directory-role-resource-admin-applications-page'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String,
                value: ''
            },

            role: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _applicationsEmpty: {
                type: Boolean,
                value: false
            },

            animationConfig: {
                type: Object
            },

            sharedElements: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': [{
                name: 'hero-animation',
                id: 'hero',
                toPage: this
            }, {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 600
                }
            }],
            'exit': {
                name: 'slide-right-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };
        this.sharedElements = {
            'hero': this.$.card
        };
    }

    _onApplicationsEmpty() {
        this._applicationsEmpty = true;
    }

    _onApplicationsLoaded() {
        this._applicationsEmpty = false;
    }

    _back() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    reloadApplications() {
        this.$.appscoDirectoryRoleApplications.reload();
    }

    reloadResourceAdmins() {
        this.$.appscoDirectoryRoleResourceAdminApplications.reload();
    }

    _onAddResourceAction() {
        this.dispatchEvent(new CustomEvent('add-resource-admin', {
            bubbles: true,
            composed: true,
            detail: {
                role: this.role
            }
        }));
    }
}
window.customElements.define(AppscoDirectoryRoleResourceAdminApplicationsPage.is, AppscoDirectoryRoleResourceAdminApplicationsPage);
