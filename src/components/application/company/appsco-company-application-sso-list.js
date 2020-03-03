import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-styles/typography.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../../components/appsco-loader.js';
import './appsco-company-resource-item.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyApplicationSSOList extends mixinBehaviors([
    Appsco.HeadersMixin,
    NeonSharedElementAnimatableBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;

                --item-additional-info: {
                    display: none;
                };

                --item-actions: {
                    display: none;
                };
            }
            .application-list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                padding: 2px;
                margin-right: -8px;
            }
            appsco-company-resource-item {
                width: 100%;

                --item-icon-width: 32px;
                --item-icon-height: 32px;

                --appsco-list-item: {
                    box-shadow: none;
                    padding: 5px 0;
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

        <div class="application-list">

            <appsco-loader active="[[ _searchLoader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <template is="dom-repeat" items="[[ _searchList ]]">
                <appsco-company-resource-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="resource" on-item="_onApplicationSelect"></appsco-company-resource-item>
            </template>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">
                    [[ _message ]]
                </p>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-company-application-sso-list'; }

    static get properties() {
        return {
            applicationsTemplateApi: {
                type: String
            },

            /**
             * Selected application from search list.
             */
            selectedApplication: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            _getResourcesApi: {
                type: String,
                computed: '_computeGetResourceApi(applicationsTemplateApi)'
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

        beforeNextRender(this, function() {
            this._populateTopSSOApps();
        });
    }

    _computeGetResourceApi(applicationsTemplateApi) {
        return applicationsTemplateApi ? (applicationsTemplateApi + '?status=3&extended=1') : null;
    }

    _showLoader() {
        this._searchLoader = true;
    }

    _hideLoader() {
        this._searchLoader = false;
    }

    _showMessage(message) {
        this._message = message;
    }

    _hideMessage() {
        this._message = '';
    }

    _setSearchList(applications) {
        this.set('_searchList', applications.sort(function(app1, app2) {
            const app1Title = app1.title.toLowerCase(),
                app2Title = app2.title.toLowerCase();

            if (app1Title < app2Title) {
                return -1;
            }

            if (app1Title > app2Title) {
                return 1;
            }

            return 0;
        }));
    }

    _populateTopSSOApps() {
        if (!this._getResourcesApi) {
            this._showMessage('There are no applications to display.');
            return false;
        }

        const request = document.createElement('iron-request'),
            url = this._getResourcesApi;

        this._hideMessage();

        const options = {
            url: url,
            method: 'GET',
            handleAs: 'json',
            headers: this._headers
        };

        request.send(options).then(function() {
            const applications = request.response.applications;

            if (applications && applications.length > 0) {
                this._setSearchList(applications);
            }

            this._hideLoader();
        }.bind(this));
    }

    filterResourcesByTerm(term) {
        let termLength = term.length;

        this._showLoader();
        this._hideMessage();

        if (0 === termLength) {
            this._populateTopSSOApps();

            return false;
        }

        if (termLength < 2) {
            this._showMessage('Please type two or more letters.');
            this._hideLoader();
            this.set('_searchList', []);

            return false;
        }

        const request = document.createElement('iron-request'),
            url = this._getResourcesApi + '&term=' + term;

        this._hideMessage();

        const options = {
            url: url,
            method: 'GET',
            handleAs: 'json',
            headers: this._headers
        };

        request.send(options).then(function() {
            const applications = request.response.applications;

            if (applications && applications.length > 0) {
                this._setSearchList(applications);
            }
            else {
                this.set('_searchList', []);
                this._showMessage('There are no applications with asked title. Please check your input.');
            }

            this._hideLoader();
        }.bind(this));
    }

    /**
     * Called after application has been selected from search list.
     * Sets selected application.
     * Fires an event.
     *
     * @param {Object} event
     * @private
     */
    _onApplicationSelect(event) {
        this.sharedElements.hero = this.shadowRoot.getElementById('appscoListItem_' + event.model.index);
        this.selectedApplication = event.detail.item;

        this.dispatchEvent(new CustomEvent('application-select', { bubbles: true, composed: true }));
    }

    _onAddSSOApplication(event) {
        this.sharedElements.hero = dom(event).rootTarget;

        this.dispatchEvent(new CustomEvent('add-custom-sso', { bubbles: true, composed: true }));
    }

    setup() {}

    reset() {
        this.set('_searchList', []);
        this._populateTopSSOApps();
        this._hideMessage();
        this._hideLoader();
    }
}
window.customElements.define(AppscoCompanyApplicationSSOList.is, AppscoCompanyApplicationSSOList);
