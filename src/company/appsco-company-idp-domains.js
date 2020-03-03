import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import './appsco-company-idp-domain-item.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyIdpDomains extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
            }
            .domains {
                @apply --layout-vertical;
                @apply --layout-start;
            }
            appsco-company-idp-domain-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-company-idp-domain-item;
            }
            .domains-container {
                width: 100%;
                position: relative;
            }
            appsco-loader {
                background-color: rgba(255, 255, 255, 0.4);
            }
            .progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-list-progress-bar;
            }
            .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
        </style>

        <div class="domains-container">

            <iron-ajax id="getDomainsApiRequest" url="[[ _domainsApiUrl ]]" headers="[[ _headers ]]" on-error="_onError" on-response="_onResponse" debounce-duration="300"></iron-ajax>

            <paper-progress id="paperProgress" class="progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_domainsEmpty ]]">

                <div class="domains">
                    <template is="dom-repeat" items="[[ _domains ]]">

                        <appsco-company-idp-domain-item id="appscoDomainItem_[[ index ]]" domain="[[ item ]]" preview="[[ preview ]]"></appsco-company-idp-domain-item>

                    </template>
                </div>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-company-idp-domains'; }

    static get properties() {
        return {
            domainsApi: {
                type: String
            },

            /**
             * Number of items to load and present
             */
            size: {
                type: Number,
                value: 10
            },

            /**
             * Indicates if domain should be in preview mode rather then full detailed view.
             */
            preview: {
                type: Boolean,
                value: false
            },

            _domainsApiUrl: {
                type: String,
                computed: '_computeDomainsApiUrl(domainsApi, size)',
                observer: '_onDomainsApiUrlChanged'
            },

            _domains: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _allDomains: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _totalDomains: {
                type: Number,
                value: 0
            },

            _domainsEmpty: {
                type: Boolean,
                value: false
            },

            _message: {
                type: String,
                value: ''
            },

            _renderedIndex: {
                type: Number,
                value: -1
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
                name: 'cascaded-animation',
                animation: 'slide-from-left-animation',
                nodes: [],
                nodeDelay: 50,
                timing: {
                    duration: 300
                }
            }
        };
    }

    reloadDomains() {
        this._loadDomains();
    }

    modifyDomain(domain) {
        const domains = JSON.parse(JSON.stringify(this._domains)),
            length = domains.length,
            allDomains = JSON.parse(JSON.stringify(this._allDomains)),
            allLength = allDomains.length;

        for (let i = 0; i < length; i++) {
            if (domain.alias === domains[i].alias) {
                domains[i] = domain;
                break;
            }
        }

        for (let j = 0; j < allLength; j++) {
            if (domain.alias === allDomains[j].alias) {
                allDomains[j] = domain;
                break;
            }
        }

        this.set('_domains', []);
        this.set('_allDomains', []);

        setTimeout(function() {
            this.set('_domains', domains);
            this.set('_allDomains', allDomains);
        }.bind(this), 10);
    }

    _computeDomainsApiUrl(domainsApi, size) {
        return (domainsApi && size) ? (domainsApi + '&page=1&limit=' + size) : null;
    }

    _onDomainsApiUrlChanged(url) {
        if (url && url.length > 0) {
            this._loadDomains();
        }
    }

    _loadDomains() {
        this._showProgressBar();
        this.set('_domains', []);
        this.set('_allDomains', []);
        this.$.getDomainsApiRequest.generateRequest();
    }

    _onError() {
        this._message = 'We couldn\'t load domains at the moment. Please try again in a minute.';
        this._handleEmptyLoad();
    }

    _handleEmptyLoad() {
        this._domainsEmpty = true;
        this._message = 'There are no domains added.';

        this.dispatchEvent(new CustomEvent('empty-load', { bubbles: true, composed: true }));

        this._hideProgressBar();
    }

    _onResponse(event) {
        const response = event.detail.response,
            domains = response.domains,
            meta = response.meta,
            domainsCount = domains.length - 1;

        this._totalDomains = meta.total;

        if (meta.total === 0) {
            this._handleEmptyLoad();
            return false;
        }

        this._domainsEmpty = false;
        this._message = '';

        domains.forEach(function(el, index) {
            setTimeout(function() {
                if (el.verified) {
                    this.push('_domains', el);
                    this.push('_allDomains', el);
                }

                if (index === domainsCount) {
                    this._hideProgressBar();

                    if (!this._domains.length) {
                        this._handleEmptyLoad();
                        return false;
                    }

                    this.dispatchEvent(new CustomEvent('loaded', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            domains: domains
                        }
                    }));
                }
            }.bind(this), (index + 1) * 30);
        }.bind(this));
    }

    _showProgressBar() {
        this.shadowRoot.getElementById('paperProgress').hidden = false;
    }

    _hideProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('paperProgress').hidden = true;
        }.bind(this), 300);
    }
}
window.customElements.define(AppscoCompanyIdpDomains.is, AppscoCompanyIdpDomains);
