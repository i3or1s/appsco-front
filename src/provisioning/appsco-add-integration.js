import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../components/components/appsco-list-item-styles.js';
import './appsco-add-integration-search.js';
import './appsco-add-integration-form.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAddIntegration extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                display: block;
                position: relative;

                --paper-dialog-scrollable: {
                    min-height: 220px;
                    padding: 0;
                };
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host neon-animated-pages > * {
                @apply --neon-animated-pages;
            }
            :host neon-animated-pages > .iron-selected {
                position: relative;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            .dialog-container {
                min-height: 420px;
            }
            :host paper-dialog-scrollable {
                margin: 25px;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">
            <paper-dialog-scrollable>
                <h2>Add Integration</h2>

                <div class="dialog-container">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name">
                        <appsco-add-integration-search id="appscoAddIntegrationSearch" name="appsco-add-integration-search" authorization-token="[[ authorizationToken ]]" available-integrations-api="[[ availableIntegrationsApi ]]" on-available-integration-selected="_onAvailableIntegrationSelected">
                        </appsco-add-integration-search>

                        <appsco-add-integration-form id="appscoAddIntegrationForm" name="appsco-add-integration-form" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-integration-requested="_onIntegrationRequested">
                        </appsco-add-integration-form>
                    </neon-animated-pages>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button id="addAction" class="add-action" on-tap="_onAddAction">
                    Add</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-add-integration'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String,
                value: ''
            },

            availableIntegrationsApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _selected: {
                type: String,
                value: 'appsco-add-integration-search',
                notify: true
            },

            _addAction: {
                type: Boolean,
                value: false
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this.$.addAction,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this.$.addAction,
                timing: {
                    duration: 200
                }
            }
        };

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('_selected-changed', this._onSelectedChanged);
        this.addEventListener('neon-animation-finish', this._onAddActionAnimationFinish);
    }

    open() {
        this.$.dialog.open();
    }

    close() {
        this.$.dialog.close();
    }

    _showIntegrationSearch() {
        this._selected = 'appsco-add-integration-search';
    }

    _showIntegrationForm() {
        this._selected = 'appsco-add-integration-form';
    }

    _reset() {
        this.$.appscoAddIntegrationSearch.reset();
        this.$.appscoAddIntegrationForm.reset();
        this._showIntegrationSearch();
    }

    _onDialogClosed() {
        this._reset();
    }

    _onSelectedChanged() {
        if (this._selected != 'appsco-add-integration-search') {
            this.$.addAction.style.display = 'block';
            this.playAnimation('entry');
            this._addAction = true;
        }
        else {
            this._addAction = false;
            this.playAnimation('exit');
        }
    }

    _onAddActionAnimationFinish() {
        if (!this._addAction) {
            this.$.addAction.style.display = 'none';
        }
    }

    _onAvailableIntegrationSelected(event) {
        this.$.appscoAddIntegrationForm.setIntegration(event.detail.integration);
        this._showIntegrationForm();
    }

    _onAddAction() {
        this.$.appscoAddIntegrationForm.addIntegration();
    }

    _onIntegrationRequested(event) {
        if (event.detail.authorizationUrl) {
            this.close();
        }
    }
}
window.customElements.define(AppscoAddIntegration.is, AppscoAddIntegration);
