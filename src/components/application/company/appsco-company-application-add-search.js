import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../../components/appsco-loader.js';
import '../../components/appsco-search.js';
import '../appsco-application-card.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyApplicationAddSearch extends mixinBehaviors([
    Appsco.HeadersMixin,
    NeonSharedElementAnimatableBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            appsco-search {
                margin-bottom: 10px;
            }
            .application-list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                padding: 2px;
                margin-right: -8px;
            }
            appsco-application-card {
                margin-right: 6px;
                margin-bottom: 6px;
            }
            :host .message {
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host .or-add-container {
                color: var(--secondary-text-color);
                line-height: 24px;
            }
            :host .add-custom-app-container {
                margin-top: 10px;
            }
            :host .link-button {
                padding: 0;
                margin: 0;
                min-width: initial;
                background-color: transparent;
                font-size: inherit;
                text-transform: uppercase;
                @apply --link-button;
            }
        </style>

        <appsco-search id="appscoSearch" label="Search applications" float-label="" on-search="_onSearch" on-search-clear="_onSearchClear"></appsco-search>

        <div class="application-list">

            <appsco-loader active="[[ _searchLoader ]]" loader-alt="Appsco is searching applications" multi-color=""></appsco-loader>

            <template is="dom-repeat" items="[[ _searchList ]]">
                <appsco-application-card id="application_[[ index ]]" application="[[ item ]]" on-selected="_onApplicationSelect"></appsco-application-card>
            </template>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">
                    [[ _message ]]
                </p>
            </template>
        </div>

        <div class="or-add-container add-custom-app-container">
            or&nbsp;
            <paper-button class="link-button" on-tap="_onAddItem">Add custom application</paper-button>
        </div>
`;
    }

    static get is() { return 'appsco-company-application-add-search'; }

    static get properties() {
        return {
            selectedApplication: {
                type: Object,
                notify: true
            },

            /**
             * Application list from search.
             */
            _searchList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String
            },

            applicationsTemplateApi: {
                type: String
            },

            /**
             * Number of applications to load and present.
             */
            size: {
                type: Number,
                value: 12
            },

            _searchActive: {
                type: Boolean,
                value: false
            },

            _customApplicationAction: {
                type: Boolean,
                value: false
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

    _onSearch(event) {
        const searchValue = event.detail.term,
            searchLength = searchValue.length;

        this._searchLoader = true;
        this._message = '';
        this._searchActive = true;

        if (searchLength === 0) {
            this._searchActive = false;
            this._message = '';
            this._searchLoader = false;
            this.set('_searchList', []);
            return false;
        }

        if (searchLength < 2) {
            this._message = 'Please type two or more letters.';
            this._searchLoader = false;
            this.set('_searchList', []);
            return false;
        }

        const request = document.createElement('iron-request'),
            url = this.applicationsTemplateApi + '?extended=1&limit=' + this.size + '&term=' + searchValue;

        this._message = '';

        const options = {
            url: url,
            method: 'GET',
            handleAs: 'json',
            headers: this._headers
        };

        request.send(options).then(function() {
            const applications = request.response.applications;

            if (applications && applications.length > 0) {
                this.set('_searchList', applications);
            }
            else {
                this.set('_searchList', []);
                this._message = 'There are no applications with asked title. Please check your input.';

            }

            this._searchLoader = false;
        }.bind(this));
    }

    _onSearchClear() {
        this._onSearch({
            detail: {
                term: ''
            }
        });
    }

    _onApplicationSelect(event) {
        this.sharedElements.hero = this.shadowRoot.getElementById('application_' + event.model.index);
        this.selectedApplication = event.detail.application;

        this.dispatchEvent(new CustomEvent('application-select', { bubbles: true, composed: true }));
    }

    _onAddItem(event) {
        this.sharedElements.hero = dom(event).rootTarget;

        this.dispatchEvent(new CustomEvent('add-item', { bubbles: true, composed: true }));
    }

    _onAddLink(event) {
        this.sharedElements.hero = dom(event).rootTarget;

        this.dispatchEvent(new CustomEvent('add-link', { bubbles: true, composed: true }));
    }

    setup() {
        this.$.appscoSearch.setup();
    }

    reset() {
        this.$.appscoSearch.reset();
        this._searchList = [];
        this._searchActive = false;
        this._message = '';
    }
}
window.customElements.define(AppscoCompanyApplicationAddSearch.is, AppscoCompanyApplicationAddSearch);
