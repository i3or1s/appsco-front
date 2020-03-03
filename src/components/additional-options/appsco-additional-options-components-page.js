import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '../page/appsco-layout-with-cards-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAdditionalOptionsComponentsPage extends mixinBehaviors([
    Appsco.HeadersMixin,
    NeonSharedElementAnimatableBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-layout-with-cards-styles">
            :host .info {
                @apply --info-message;
            }
        </style>

        <iron-ajax id="getCompanyIdpConfigListApiRequest" url="[[ _getCompanyIdpConfigListApi ]]" headers="[[ _headers ]]" debounce-duration="300" auto="" on-error="_onGetCompanyIdpConfigListError" on-response="_onGetCompanyIdpConfigListResponse"></iron-ajax>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <template is="dom-if" if="[[ _message ]]">
            <p class="info">[[ _message ]]</p>
        </template>

        <div class="cols-layout two-cols-layout">
            <template is="dom-repeat" items="[[ _idpConfigList ]]">
                <div class="col">
                    <paper-card heading="[[ item.name ]]" class="card">
                        <div class="card-content">
                            <p class="info">
                                [[ item.name ]] is set as an Identity Provider for your company.
                                Choose the [[ item.name ]] applications you wish to add to your company.
                            </p>
                        </div>
                        <div class="card-actions">
                            <paper-button on-tap="_onManageIntegrationAction">Manage</paper-button>
                        </div>
                    </paper-card>
                </div>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-additional-options-components-page'; }

    static get properties() {
        return {
            getCompanyIdpConfigListApi: {
                type: String
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mediumScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _getCompanyIdpConfigListApi: {
                type: String,
                computed: '_computeGetCompanyIdpConfigListApi(getCompanyIdpConfigListApi)'
            },

            _idpConfigList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _loaders: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String,
                value: ''
            },

            animationConfig: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(tabletScreen, mediumScreen)'
        ];
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: dom(this.root).querySelectorAll('paper-card'),
                nodeDelay: 50,
                timing: {
                    delay: 200,
                    duration: 100
                }
            },
            'exit': [{
                name: 'hero-animation',
                id: 'hero',
                fromPage: this
            }, {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 500
                }
            }]
        };

        this.pageLoaded = false;

        beforeNextRender(this, function() {
            if (this.tabletScreen || this.mediumScreen) {
                this.updateStyles();
            }
        });
    }

    initializePage() {
        this.dispatchEvent(new CustomEvent('show-page-progress-bar', { bubbles: true, composed: true }));
        this._getCompanyIdpConfigList();
    }

    resetPage() {
        this._clearIdpConfigList();
    }

    _computeGetCompanyIdpConfigListApi(api) {
        return api ? (api + '?extended=1&page=1&limit=100') : null;
    }

    _updateScreen() {
        this.updateStyles();
    }

    _setSharedElement(target) {
        if (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
            target = target.parentNode;
        }

        this.sharedElements = {
            'hero': target
        };
    }

    _clearLoaders() {
        for (let idx in this._loaders) {
            clearTimeout(this._loaders[idx]);
        }

        this.set('_loaders', []);
    }

    _clearIdpConfigList() {
        this._clearLoaders();
        this.set('_idpConfigList', []);
        this.set('_message', '');
    }

    _fireIdpConfigListLoadedEvent(idpConfigList) {
        this.dispatchEvent(new CustomEvent('idp-config-list-loaded', {
            bubbles: true,
            composed: true,
            detail: {
                idpConfigList: idpConfigList
            }
        }));
    }

    _getCompanyIdpConfigList() {
        this._clearIdpConfigList();

        if (this._getCompanyIdpConfigListApi && this._headers['Authorization']) {
            const requestComponent = this.$.getCompanyIdpConfigListApiRequest;

            if (requestComponent.lastRequest) {
                requestComponent.lastRequest.abort();
            }

            requestComponent.generateRequest();
        }
        else {
            this.set('_message', this.apiErrors.getError(404));
            this._fireIdpConfigListLoadedEvent([]);
        }
    }

    _onGetCompanyIdpConfigListError(event) {
        this.set('_message', this.apiErrors.getError(event.detail.request.response.code));
        this._fireIdpConfigListLoadedEvent([]);
    }

    _onGetCompanyIdpConfigListResponse(event) {
        const response = event.detail.response;

        this._clearIdpConfigList();
        this.set('_message', '');

        if (response && response.configs) {
            const idpConfigList = response.configs,
                meta = response.meta,
                idpConfigListCount = idpConfigList.length - 1;

            if (0 === meta.total) {
                this.set('_message', 'There are no Identity Providers set.');
                this._fireIdpConfigListLoadedEvent(idpConfigList);
                return false;
            }

            idpConfigList.forEach(function(el, index) {
                this._loaders.push(setTimeout(function() {
                    this.push('_idpConfigList', el);

                    if (index === idpConfigListCount) {
                        this._fireIdpConfigListLoadedEvent(idpConfigList);
                    }

                }.bind(this), (index + 1) * 30));
            }.bind(this));
        }
    }

    _onManageIntegrationAction(event) {
        this._setSharedElement(event.target);

        this.dispatchEvent(new CustomEvent('manage-idp', {
            bubbles: true,
            composed: true,
            detail: {
                idp: event.model.item
            }
        }));
    }
}
window.customElements.define(AppscoAdditionalOptionsComponentsPage.is, AppscoAdditionalOptionsComponentsPage);
