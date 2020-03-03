import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import './appsco-application-add-search.js';
import './appsco-application-add-settings.js';
import './appsco-application-add-link.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationAdd extends mixinBehaviors([NeonAnimationRunnerBehavior, Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
            @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
            @apply --paper-dialog-scrollable-child;
            }
            :host neon-animated-pages > * {
            @apply --neon-animated-pages;
            }
            :host neon-animated-pages > .iron-selected {
                position: relative;
            }
            appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .buttons {
                padding-right: 24px;
            }
            :host .buttons paper-button {
            @apply --paper-dialog-button;
            }
            :host .buttons paper-button.add-action {
                margin: 0 0 0 10px;
                display: none;
            @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
            @apply --paper-dialog-dismiss-button;
            }
        </style>

        <paper-dialog id="addApplicationDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>[[ _dialogTitle ]]</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name" on-neon-animation-finish="_onPageAnimationFinish">

                    <appsco-application-add-search id="appscoApplicationAddSearch" name="appsco-application-add-search" authorization-token="[[ authorizationToken ]]" applications-template-api="[[ applicationsTemplateApi ]]" selected-application="{{ _selectedApplication }}" on-application-select="_onApplicationSelect" on-add-item="_onAddItem" on-add-link="_onAddLink">
                    </appsco-application-add-search>

                    <appsco-application-add-settings id="appscoApplicationAddSettings" name="appsco-application-add-settings" application-template="[[ _selectedApplication ]]" authorization-token="[[ authorizationToken ]]" dashboard-api="[[ dashboardApi ]]" on-form-error="_onFormError" on-application-added="_onApplicationAdded">
                    </appsco-application-add-settings>

                    <appsco-application-add-link id="appscoApplicationAddLink" name="appsco-application-add-link" link="[[ link ]]" authorization-token="[[ authorizationToken ]]" dashboard-api="[[ dashboardApi ]]" on-link-added="_onLinkAdded">
                    </appsco-application-add-link>

                </neon-animated-pages>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button id="addApplicationAction" class="add-action" on-tap="_onAddApplication">
                    Add
                </paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-application-add'; }

    static get properties() {
        return {
            _selected: {
                type: String,
                value: 'appsco-application-add-search',
                notify: true
            },

            _selectedApplication: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            item: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            applicationsTemplateApi: {
                type: String
            },

            dashboardApi: {
                type: String
            },

            _dialogTitle: {
                type: String,
                value: 'Add application'
            },

            /**
             * Indicates wheather add action should be displayed or not.
             * It depends on which page is currently displayed.
             */
            _addAction: {
                type: Boolean,
                value: false
            },

            _loader: {
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
                node: this.shadowRoot.getElementById('addApplicationAction'),
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this.shadowRoot.getElementById('addApplicationAction'),
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

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    /**
     * Called after selected page has been changed.
     * According to selected page it shows / hides add application action (_addAction).
     *
     * @private
     */
    _onSelectedChanged() {
        if (this._selected !== 'appsco-application-add-search') {
            this.$.addApplicationAction.style.display = 'block';
            this.playAnimation('entry');
            this._addAction = true;
        }
        else {
            this._addAction = false;
            this.playAnimation('exit');
        }
    }

    /**
     * Called after add application action animation is finished.
     * It hides action if it shouldn't be visible.
     *
     * @private
     */
    _onAddActionAnimationFinish() {
        if (!this._addAction) {
            this.$.addApplicationAction.style.display = 'none';
        }
    }

    /**
     * Called after application has been selected from search list.
     * It shows appsco-application-add-settings page.
     *
     * @private
     */
    _onApplicationSelect() {
        this._selected = 'appsco-application-add-settings';
    }

    /**
     * Called after clicked on Add Custom Application action.
     * It sets selected application to Item resource.
     *
     * @private
     */
    _onAddItem(event) {
        this.item.title = event.detail.searchTerm;
        this.set('_selectedApplication', this.item);
        this._onApplicationSelect();
        this._dialogTitle = 'Add custom application';
    }

    /**
     * Called after clicked on Add Link action.
     * It shows appsco-application-add-link page.
     *
     * @private
     */
    _onAddLink() {
        this._selected = 'appsco-application-add-link';
        this._dialogTitle = 'Add link';
    }

    _onDialogOpened() {
        this._dialogTitle = 'Add application';
        this.$.appscoApplicationAddSearch.setup();
    }

    /**
     * Called after dialog has been closed.
     * It resets search and settings pages.
     * It sets selected page to appsco-application-add-search.
     *
     * @private
     */
    _onDialogClosed() {
        this._selectedApplication = {};
        this.$.appscoApplicationAddSearch.reset();
        this.$.appscoApplicationAddSettings.reset();
        this.$.appscoApplicationAddLink.reset();
        this._selected = 'appsco-application-add-search';
        this._dialogTitle = 'Add application';
        this._hideLoader();
    }

    /**
     * Called when user wants to save chosen application.
     * It calls addApplication method of appsco-application-add-settings page.
     *
     * @private
     */
    _onAddApplication() {
        this._showLoader();
        this._selectedApplication.self ? this.$.appscoApplicationAddSettings.addApplication() : this.$.appscoApplicationAddLink.addLink();
    }

    _onFormError() {
        this._hideLoader();
    }

    /**
     * Called after application has been successfully added.
     * It closes the dialog.
     *
     * @private
     */
    _onApplicationAdded() {
        this._closeDialog();
    }

    /**
     * Called after link has been successfully added.
     * It closes the dialog.
     *
     * @private
     */
    _onLinkAdded() {
        this._closeDialog();
    }

    _closeDialog() {
        this.$.addApplicationDialog.close();
        this.$.addApplicationAction.disabled = false;
    }

    toggle() {
        this.$.addApplicationDialog.toggle();
    }

    _onPageAnimationFinish(event) {
        var fromPage = event.detail.fromPage,
            toPage = event.detail.toPage;

        switch(fromPage.getAttribute('name')) {
            case 'appsco-application-add-settings':
            case 'appsco-application-add-link':
            case 'appsco-application-add-search':
                fromPage.reset();
                break;

            default:
                break;
        }

        switch(toPage.getAttribute('name')) {
            case 'appsco-application-add-link':
            case 'appsco-application-add-search':
                toPage.setup();
                break;

            default:
                break;
        }
    }
}
window.customElements.define(AppscoApplicationAdd.is, AppscoApplicationAdd);
