import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../../components/appsco-loader.js';
import './appsco-company-application-add-search.js';
import './appsco-company-application-add-settings.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyApplicationAdd extends mixinBehaviors([Appsco.HeadersMixin, NeonAnimationRunnerBehavior], PolymerElement) {
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

                    <appsco-company-application-add-search id="appscoApplicationAddSearch" name="appsco-application-add-search" authorization-token="[[ authorizationToken ]]" applications-template-api="[[ applicationsTemplateApi ]]" selected-application="{{ _selectedApplication }}" on-application-select="_onApplicationSelect" on-add-item="_onAddItem" on-add-link="_onAddLink">
                    </appsco-company-application-add-search>

                    <appsco-company-application-add-settings id="appscoApplicationAddSettings" name="appsco-application-add-settings" application="[[ _selectedApplication ]]" authorization-token="[[ authorizationToken ]]" add-application-api="[[ addApplicationApi ]]" on-form-error="_onFormError" on-application-added="_onApplicationAdded">
                    </appsco-company-application-add-settings>

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

    static get is() { return 'appsco-company-application-add'; }

    static get properties() {
        return {
            /**
             * Selected page.
             * It has value of component's 'name' attribute.
             */
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

            link: {
                type: Object,
                value: function () {
                    return {};
                }
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

            addApplicationApi: {
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
        }
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this.$.addApplicationAction,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this.$.addApplicationAction,
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
        this.addEventListener('_selected-changed', this._onSelectedChanged.bind(this));
        this.addEventListener('neon-animation-finish', this._onAddActionAnimationFinish.bind(this));
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _onFormError() {
        this._hideLoader();
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
        this.item.custom_application = true;
        this.item.title = event.detail.searchTerm;
        this.set('_selectedApplication', this.item);
        this._onApplicationSelect();
        this._dialogTitle = 'Add custom application';
    }

    _onAddLink() {
        this.link.title = 'Link';
        this.set('_selectedApplication', this.link);
        this._onApplicationSelect();
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
        this.$.appscoApplicationAddSettings.addApplication();
    }

    _onApplicationAdded() {
        this._closeDialog();
    }

    _closeDialog() {
        this.$.addApplicationDialog.close();
        this.$.addApplicationAction.disabled = false;
    }

    setAction(action) {
        this.$.appscoApplicationAddSettings.setAction(action);
    }

    toggle() {
        this.$.addApplicationDialog.toggle();
    }

    _onPageAnimationFinish(event) {
        const fromPage = event.detail.fromPage,
            toPage = event.detail.toPage;

        let attribute = fromPage.getAttribute('name');
        if (attribute === 'appsco-application-add-settings' || attribute === 'appsco-application-add-search') {
            fromPage.reset();
        }

        if (toPage.getAttribute('name') === 'appsco-application-add-search') {
            toPage.setup();
        }
    }
}
window.customElements.define(AppscoCompanyApplicationAdd.is, AppscoCompanyApplicationAdd);
