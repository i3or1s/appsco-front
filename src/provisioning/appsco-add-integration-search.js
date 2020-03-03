import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../components/components/appsco-search.js';
import '../components/components/appsco-loader.js';
import './appsco-available-integration-item.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAddIntegrationSearch extends mixinBehaviors([NeonSharedElementAnimatableBehavior, Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            :host p:first-of-type {
                margin-top: 0;
            }
            :host p + p {
                margin-bottom: 0;
            }
            appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            appsco-search {
                margin-bottom: 15px;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            .integration-list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                height: 100%;
            }
            appsco-available-integration-item {
                width: 100%;

                --item-icon-width: 32px;
                --item-icon-height: 32px;

                --appsco-list-item: {
                    box-shadow: none;
                    padding: 5px;
                    height: auto;
                    border-bottom: 1px solid var(--border-color);
                };

                --appsco-list-item-activated: {
                    box-shadow: none;
                    background-color: var(--body-background-color);
                };

                --item-info-label: {
                    font-size: 14px;
                };

                --item-info-value: {
                    display: none;
                };
            }
            :host .message {
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
        </style>

        <iron-ajax auto="" method="GET" url="[[ _availableIntegrationsApi ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onAvailableIntegrationsResponse"></iron-ajax>
        <div>
            <p>
                Integrations enable the exchange of provisioning information and help you automate the management of users,
                access and data across different systems.
            </p>
            <p>
                AppsCo provides a set of systems that integration can be achieved with. Choose an integration you wish to add.
            </p>
        </div>

        <appsco-search id="appscoSearch" label="Search available integration systems" float-label="" on-search="_onSearch" on-search-clear="_onClearSearch"></appsco-search>

        <paper-dialog-scrollable>
            <div class="integration-list">

                <appsco-loader active="[[ _searchLoader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

                <template is="dom-repeat" items="[[ _availableIntegrationListDisplay ]]">
                    <appsco-available-integration-item id="appscoListItem_[[ index ]]" item="[[ item ]]" on-item="_onListItemSelectAction"></appsco-available-integration-item>
                </template>

                <template is="dom-if" if="[[ _message ]]">
                    <p class="message">
                        [[ _message ]]
                    </p>
                </template>
            </div>
        </paper-dialog-scrollable>
`;
    }

    static get is() { return 'appsco-add-integration-search'; }

    static get properties() {
        return {
            availableIntegrationsApi: {
                type: String
            },

            _availableIntegrationsApi: {
                type: String,
                computed: '_computeAvailableIntegrationsApi(availableIntegrationsApi)'
            },

            _searchAvailableIntegrationsApi: {
                type: String,
                computed: '_computeSearchAvailableIntegrationsApi(availableIntegrationsApi, _searchTerm)'
            },

            _searchTerm: {
                type: String,
                value: ''
            },

            _availableIntegrationList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _availableIntegrationListDisplay: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Message to display if there is no search result.
             */
            _message: {
                type: String,
                value: ''
            },

            /**
             * Indicates if appsco loader should be displayed.
             */
            _searchLoader: {
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
            'entry': {
                name: 'scale-up-animation',
                node: this
            },
            'exit': [{
                name: 'hero-animation',
                id: 'hero',
                fromPage: this,
                timing: {
                    duration: 300
                }
            }, {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 100
                }
            }]
        };
        this.sharedElements = {
            'hero': {}
        };
    }

    reset() {
        this.$.appscoSearch.reset();
        this.set('_availableIntegrationListDisplay', []);
        this.set('_availableIntegrationListDisplay', JSON.parse(JSON.stringify(this._availableIntegrationList)));
        this._hideMessage();
        this._hideLoader();
    }

    _computeAvailableIntegrationsApi(availableIntegrationsApi) {
        return availableIntegrationsApi ? availableIntegrationsApi + '?extended=1' : null;
    }

    _computeSearchAvailableIntegrationsApi(availableIntegrationsApi, term) {
        return (availableIntegrationsApi && term) ? (availableIntegrationsApi + '?extended=1&limit=10&term=' + term) : null;
    }

    _showMessage(message) {
        this._message = message;
    }

    _hideMessage() {
        this._message = '';
    }

    _showLoader() {
        this._searchLoader = true;
    }

    _hideLoader() {
        this._searchLoader = false;
    }

    _onAvailableIntegrationsResponse(event) {
        var response = event.detail.response;

        if (response && response.available_integrations) {
            this.set('_availableIntegrationList', response.available_integrations);
            this.set('_availableIntegrationListDisplay', response.available_integrations);
        }
        this._hideLoader();
    }

    _searchList(searchTerm) {
        var term = decodeURIComponent(searchTerm.toLowerCase()).trim(),
            termLength = term.length,
            list = this._availableIntegrationList,
            length = list.length;

        this._showLoader();

        this.set('_availableIntegrationListDisplay', []);

        if (1 === termLength) {
            this._showMessage('Please type two or more letters.');
            this._hideLoader();
            return false;
        }

        this._hideMessage();

        for (var i = 0; i < length; i++) {
            var item = list[i];

            if (item && item.title.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                this.push('_availableIntegrationListDisplay', item);
            }
        }

        if (0 === this._availableIntegrationListDisplay.length && 2 <= termLength) {
            this._showMessage('There are no available integrations with asked term.');
        }

        this._hideLoader();
    }

    _onSearch(event) {
        this._searchList(event.detail.term);
    }

    _onClearSearch() {
        this._searchList('');
    }

    _onListItemSelectAction(event) {
        var alias = parseInt(event.detail.item.alias),
            list = this._availableIntegrationListDisplay,
            length = list.length,
            selectedListItem;

        for (var i = 0; i < length; i++) {

            if (alias === list[i].alias) {
                selectedListItem = list[i];
                break;
            }
        }

        this.sharedElements.hero = this.shadowRoot.getElementById('appscoListItem_' + event.model.index);
        this.dispatchEvent(new CustomEvent('available-integration-selected', {
            bubbles: true,
            composed: true,
            detail: {
                integration: selectedListItem
            }
        }));
    }
}
window.customElements.define(AppscoAddIntegrationSearch.is, AppscoAddIntegrationSearch);
