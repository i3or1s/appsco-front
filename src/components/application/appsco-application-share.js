import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import './appsco-account-card.js';
import '../components/appsco-search.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationShare extends mixinBehaviors([Appsco.HeadersMixin, NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-application-share;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            appsco-search {
                margin-bottom: 10px;
            }
            .share-container {
                padding-bottom: 20px;
            }
            .account-list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                padding: 2px;
                margin-right: -8px;
            }
            appsco-account-card {
                margin-right: 6px;
                margin-bottom: 6px;
            }
            .selected-account {
                --account-card: {
                    padding-right: 10px;
                    width: 136px;
                };
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host .message {
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
        </style>

        <paper-dialog id="shareDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Share resource [[ application.title ]]</h2>

            <appsco-loader id="shareLoader" active="[[ _shareLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="share-container">


                    <div class="account-list">

                        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                        <template is="dom-repeat" items="[[ _accounts ]]">
                            <appsco-account-card class="selected-account" account="[[ item ]]" remove-action="" on-selected="_removeFromAccounts"></appsco-account-card>
                        </template>
                    </div>

                    <appsco-search id="appscoSearch" label="Share to others" float-label="" on-search="_onSearch" on-search-clear="_onSearchClear"></appsco-search>

                    <div class="account-list search-list">

                        <appsco-loader id="searchAccountsLoader" active="[[ _loader ]]" loader-alt="Appsco is loading accounts" multi-color=""></appsco-loader>

                        <template is="dom-repeat" items="[[ _searchList ]]">
                            <appsco-account-card account="[[ item ]]" on-selected="_share"></appsco-account-card>
                        </template>

                        <template is="dom-if" if="[[ _message ]]">
                            <p class="message">
                                [[ _message ]]
                            </p>
                        </template>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_shareApplicationAction">Share</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-application-share'; }

    static get properties() {
        return {
            /**
             * [Application](https://developers.appsco.com/api/dashboard/id/icons/id) that is to be rendered
             */
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            /**
             * Number of accounts to load and present
             */
            size: {
                type: Number,
                value: 8
            },

            _accounts: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _searchList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Message to display if there is no search result.
             */
            _message: {
                type: String
            },

            accountsApi: {
                type: String
            },

            _loader: {
                type: Boolean,
                value: false
            },

            /**
             * Indicates if appsco loader should be displayed.
             */
            _shareLoader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            /**
             * Number of successfully shared
             */
            numberOfSuccess: {
                type: Number,
                value: 0
            },

            /**
             * Number of unsuccessfully shared
             */
            numberOfFailed: {
                type: Number,
                value: 0
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            "entry": {
                name: "fade-in-animation",
                timing: {
                    duration: 200
                }
            },
            "exit": {
                name: "fade-out-animation",
                timing: {
                    duration: 200
                }
            }
        };

        afterNextRender(this, function () {
            this._addListeners();
        });
    }

    setApplication(application) {
        this.application = application;
    }

    _addListeners() {
        this.addEventListener('on-request', this._loading);
    }

    _removeFromAccounts(event) {
        const account = event.detail.account;

        this.splice('_accounts', this._accounts.indexOf(account), 1);
        this.push('_searchList', account);
    }

    _share(event) {
        const account = event.detail.account;

        this._errorMessage = '';
        this.push('_accounts', account);
        this.splice('_searchList', this._searchList.indexOf(account), 1);
    }

    /**
     * Shares application to one account
     *
     * @returns Promise
     * @private
     */
    _shareToUser(account) {
        const appRequest = document.createElement('iron-request');

        return appRequest.send({
            url: account.self+"/share",
            method: "POST",
            handleAs: 'json',
            body: "icon="+encodeURIComponent(this.application.self),
            headers: this._headers
        });
    }

    /**
     * Shares application to all selected accounts
     *
     * @private
     */
    _shareApplication() {
        let me = this,
            length = this._accounts.length;
        this._accounts.forEach(function(item) {
            me._shareToUser(item).then(function() {
                length--;
                this.numberOfSuccess++;
                if (0 === length) {
                    this._sharingFinished();
                }
            }.bind(this), function() {
                length--;
                this.numberOfFailed++;
                if (0 === length) {
                    this._sharingFinished();
                }
            }.bind(this));
        }.bind(this));
    }

    /**
     * Called when all share requests (for all selected accounts) has been finished
     *
     * @private
     */
    _sharingFinished() {
        this.$.shareDialog.close();
        this.set('_accounts', []);
        this._shareLoader = false;

        this.dispatchEvent(new CustomEvent('application-shared', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.application,
                succeded: this.numberOfSuccess,
                failed: this.numberOfFailed
            }
        }));
    }

    _shareApplicationAction() {
        if (this._accounts.length > 0) {
            this._shareLoader = true;

            setTimeout(function() {
                this.numberOfSuccess = 0;
                this.numberOfFailed = 0;
                this._shareApplication();
            }.bind(this), 500);
        }
        else {
            this._errorMessage = 'Please add at least one user to share resource to.';
            this.$.search.focus();
        }
    }

    _onSearch(event) {
        const value = event.detail.term;

        this._loader = true;
        this.set('_message', '');

        setTimeout(function() {
            this._errorMessage = '';
        }.bind(this), 500);

        if (value.length < 3) {
            this._message = 'Please type three or more letters.';
            this._loader = false;
            this.set('_searchList', []);

            return false;
        }

        const request = document.createElement('iron-request'),
            url = this.accountsApi + "?extended=1&limit=" + this.size + '&term=' + value;

        this._message = '';

        const options = {
            url: url,
            method: 'GET',
            handleAs: 'json',
            headers: this._headers
        };

        request.send(options).then(function() {
            const accounts = request.response.accounts;

            if (accounts && accounts.length > 0) {
                this.set('_searchList', accounts);
            }
            else {
                this.set('_searchList', []);
                this._message = 'There are no accounts with asked term. Please check your input.';
            }

            this._loader = false;
        }.bind(this));
    }

    _onSearchClear() {
        this._reset();
    }

    toggle() {
        this.$.shareDialog.toggle();
    }

    _onDialogOpened() {
        this.$.appscoSearch.setup();
    }

    _onDialogClosed() {
        this._reset();
        this.set('_accounts', []);
    }

    _reset() {
        this.$.appscoSearch.reset();
        this.set('_searchList', []);
        this._shareLoader = false;
        this._errorMessage = '';
        this._message = '';
    }
}
window.customElements.define(AppscoApplicationShare.is, AppscoApplicationShare);
