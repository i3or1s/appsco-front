import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-progress/paper-progress.js';
import '../account/appsco-account-image.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import './appsco-access-report-account-resource-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccessReportAccountItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                --appsco-access-report-account-resource: {
                    width: calc(100% / 3);
                    margin-bottom: 15px;
                    padding-right: 90px;
                    box-sizing: border-box;
                };
            }
            appsco-account-image {
                --account-initials-background-color: var(--report-account-initials-background-color);
            }
            iron-collapse {
                @apply --shadow-elevation-2dp;
            }
            .resources-container {
                padding: 20px;
                @apply --layout-vertical;
                @apply --layout-center;
                background-color: var(--collapsible-content-background-color);
            }
            .resource-list {
                width: 100%;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-wrap;
            }
            .message {
                @apply --info-message;
            }
            .load-more-box {
                margin-top: 10px;
                padding-top: 4px;
                position: relative;
            }
            .load-more-box paper-progress {
                width: 100%;
                position: absolute;
                top: 4px;
                left: 0;
            }
            .load-more-action {
                display: block;
                width: 120px;
                margin: 10px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            :host([screen1300]) {
                --appsco-access-report-account-resource: {
                    width: 49%;
                    margin-left: 1%;
                    margin-bottom: 15px;
                    padding-right: 90px;
                    box-sizing: border-box;
                };
            }
            :host([screen800]) {
                --appsco-access-report-account-resource: {
                    width: 100%;
                    padding-right: 0;
                    margin-bottom: 15px;
                    box-sizing: border-box;
                };
            }
            :host([screen800]) .item-additional-info {
                display: none;
            }
            :host .item-info {
                padding: 0 10px;
            }
        </style>

        <iron-ajax id="getResourcesApiRequest" url="[[ _getResourcesApiUrl ]]" headers="[[ _headers ]]" auto="" on-error="_onGetResourcesError" on-response="_onGetResourcesResponse"></iron-ajax>

        <iron-media-query query="(max-width: 1300px)" query-matches="{{ screen1300 }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ screen800}}"></iron-media-query>

        <div class="item">
            <appsco-account-image account="[[ item.account ]]"></appsco-account-image>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.account.display_name ]]</span>
                <span class="info-value">[[ item.account.email ]]</span>
            </div>

            <div class="item-info item-additional-info">
                <div class="info">
                    <span class="info-label">Assigned resources:&nbsp;</span>
                    <span class="info-value">[[ _resourcesCount ]]</span>
                </div>
            </div>

            <div class="actions">
                <paper-button on-tap="_onShowResources" hidden\$="[[ _resourcesVisible ]]">Show</paper-button>
                <paper-button on-tap="_onHideResources" hidden\$="[[ !_resourcesVisible ]]">Hide</paper-button>
            </div>
        </div>

        <iron-collapse id="resources" on-transitioning-changed="_onCollapseTransitionChanged">
            <div class="resources-container">

                <div class="resource-list">
                    <template is="dom-repeat" items="[[ _resources ]]" rendered-item-count="{{ renderedCount }}">
                        <appsco-access-report-account-resource-item item="[[ item ]]"></appsco-access-report-account-resource-item>
                    </template>

                    <template is="dom-if" if="{{ !renderedCount }}">
                        <p class="message">There are no resources assigned to this [[ type ]].</p>
                    </template>
                </div>

                <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                    <paper-progress id="loadMoreProgress" indeterminate="" hidden=""></paper-progress>
                    <paper-button class="load-more-action" on-tap="_onLoadMoreAction">Load More</paper-button>
                </div>
            </div>
        </iron-collapse>
`;
    }

    static get is() { return 'appsco-access-report-account-item'; }

    static get properties() {
        return {
            numberOfResourcesToDisplay: {
                type: Number,
                value: 15
            },

            loadMore: {
                type: Boolean,
                value: false
            },

            screen800: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            screen1300: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _resources: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _getResourcesApiUrl: {
                type: String,
                computed: '_computeGetResourcesApiUrl(item, numberOfResourcesToDisplay)'
            },

            _secondResourcesPageApiUrl: {
                type: String
            },

            _nextResourcesPageApiUrl: {
                type: String
            },

            _loadMore: {
                type: Boolean,
                value: false
            },

            _resourcesCount: {
                type: Number,
                value: 0
            },

            _resourcesVisible: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(screen800, screen1300)'
        ];
    }

    _computeGetResourcesApiUrl(item, numberOfResourcesToDisplay) {
        return (item.meta && numberOfResourcesToDisplay) ? (item.meta.applications + '?extended=1&limit=' + numberOfResourcesToDisplay) : null;
    }

    _updateScreen() {
        this.updateStyles();
    }

    _setLoadMoreAction() {
        this._hideLoadMoreProgressBar();
        this._loadMore = (this.loadMore && this._resources.length < this._resourcesCount);
    }

    _showLoadMoreAction() {
        this._hideLoadMoreProgressBar();
        this._loadMore = true;
    }

    _hideLoadMoreAction() {
        this._hideLoadMoreProgressBar();
        this._loadMore = false;
    }

    _showLoadMoreProgressBar() {
        this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
    }

    _hideLoadMoreProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
        }.bind(this), 300);
    }

    _setApiRequestUrl(url) {
        this.$.getResourcesApiRequest.url = url;
    }

    _onGetResourcesError() {
        this.set('_resources', []);
        this._resourcesCount = 0;
        this._hideLoadMoreAction();
    }

    _onGetResourcesResponse(event) {
        const response = event.detail.response;

        if (response && response.applications) {
            const resources = response.applications,
                listCount = resources.length - 1;

            this._resourcesCount = response.meta ? response.meta.total : 0;
            this._nextResourcesPageApiUrl = response.meta.next + '&limit=' + this.numberOfResourcesToDisplay;

            if (!this._secondResourcesPageApiUrl) {
                this._secondResourcesPageApiUrl = response.meta.next + '&limit=' + this.numberOfResourcesToDisplay;
            }

            resources.forEach(function(el, index) {
                setTimeout(function() {
                    this.push('_resources', el);

                    if (index === listCount) {
                        this._hideLoadMoreProgressBar();
                        this._setLoadMoreAction();
                    }
                }.bind(this), (index + 1) * 30 );
            }.bind(this));
        }
    }

    _onShowResources() {
        this.$.resources.show();
        this._resourcesVisible = true;
    }

    _onHideResources() {
        this.$.resources.hide();
        this._resourcesVisible = false;
    }

    _onLoadMoreAction() {
        this._showLoadMoreProgressBar();
        this._setApiRequestUrl(null);
        this._setApiRequestUrl(this._nextResourcesPageApiUrl);
    }

    _onCollapseTransitionChanged(event) {
        if (!event.detail.value && this._resources) {
            this._nextResourcesPageApiUrl = this._secondResourcesPageApiUrl;

            if (this._resources.length > this.numberOfResourcesToDisplay) {
                this.set('_resources', this._resources.slice(0, this.numberOfResourcesToDisplay));
                this._showLoadMoreAction();
            }
        }
    }
}
window.customElements.define(AppscoAccessReportAccountItem.is, AppscoAccessReportAccountItem);
