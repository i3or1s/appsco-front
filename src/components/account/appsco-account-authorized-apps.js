import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-button/paper-button.js';
import './appsco-account-authorized-app.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountAuthorizedApps extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                width: 100%;
            @apply --account-authorized-apps;
            }
            .authorized-apps {
                padding-top: 10px;
                position: relative;
            @apply --layout-vertical;
            @apply --account-authorized-apps-container;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
            @apply --paper-font-body2;
            @apply --info-message;
            }
            :host paper-progress {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: 100%;
                @apply --appsco-list-progress-bar;
                display: block;
            }
            :host appsco-account-authorized-app {
            @apply --account-authorized-app;
            }
            :host appsco-account-authorized-app:first-of-type {
            @apply --account-authorized-app-first;
            }
            :host .load-more-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
        </style>

        <iron-ajax
            id="ironAjaxAuthorizedApps"
            url="[[ _computedUrl ]]"
            method="GET"
            headers="[[ _headers ]]"
            handle-as="json"
            on-error="_handleError"
            on-response="_handleResponse">
        </iron-ajax>

        <div class="authorized-apps">
            <paper-progress id="progress" hidden\$="[[ !_progressVisible ]]" indeterminate=""></paper-progress>

            <template is="dom-repeat" items="[[ _authorizedApps ]]">
                <appsco-account-authorized-app application="[[ item ]]" short-view="[[ shortView ]]"></appsco-account-authorized-app>
            </template>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">
                    [[ _message ]]
                </p>
            </template>

            <template is="dom-if" if="[[ _shouldShowLoadMore ]]">
                <paper-button id="loadMore" class="load-more-button" on-tap="_loadMore">Load More</paper-button>
            </template>
        </div>`;
    }

    static get is() { return 'appsco-account-authorized-apps'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {}
                },
                notify: true
            },

            authorizedAppsApi: {
                type: String
            },

            _nextPage: {
                type: Number,
                value: 1
            },

            /**
             * Number of authorized apps to load.
             */
            size: {
                type: Number,
                value: 5
            },

            /** Is loadMore option enabled */
            loadMore: {
                type: Boolean,
                value: false
            },

            _hasMoreToLoad: {
                type: Boolean,
                value: false
            },

            _shouldShowLoadMore: {
                type: Boolean,
                computed: '_computeShouldShowLoadMore(loadMore, _hasMoreToLoad)'
            },

            shortView: {
                type: Boolean,
                value: false
            },

            _computedUrl: {
                type: String,
                computed: "_computeUrl(authorizedAppsApi)"
            },

            _authorizedApps: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _message: {
                type: String
            },

            _progressVisible: {
                type: Boolean,
                value: false
            }
        };
    }

    _computeUrl(authorizedAppsApi) {
        return authorizedAppsApi + '?page=' + this._nextPage + '&limit=' + this.size;
    }

    _computeShouldShowLoadMore(loadMore, _hasMoreToLoad) {
        return loadMore && _hasMoreToLoad;
    }

    loadAuthorizedApps() {
        this._showProgressBar();
        this._authorizedApps = [];
        this._nextPage = 1;

        this.$.ironAjaxAuthorizedApps.url = this._computeUrl(this.authorizedAppsApi);
        this.$.ironAjaxAuthorizedApps.generateRequest();
    }

    _loadMore() {
        this._showProgressBar();

        this.$.ironAjaxAuthorizedApps.url = this._computeUrl(this.authorizedAppsApi);
        this.$.ironAjaxAuthorizedApps.generateRequest();
    }

    _handleError(event) {
        this._message = 'We couldn\'t load applications at the moment. Please try again in a minute. If error continues contact us.';
        this._hideProgressBar();
    }

    _handleResponse(event) {
        const response = event.detail.response,
            applications = response.authorizations,
            currentLength = this._authorizedApps.length;

        this._hasMoreToLoad = applications.length + currentLength < response.meta.total;

        if (applications && applications.length > 0) {
            this._nextPage += 1;

            applications.forEach(function(application, i) {
                setTimeout( function() {
                    this.push('_authorizedApps', applications[i]);

                    if (i === (applications.length - 1)) {
                        this._hideProgressBar();
                    }
                }.bind(this), (i + 1) * 30 );
            }.bind(this));
        }
        else if (applications && !applications.length) {
            if (!currentLength) {
                this._message = 'You don\'t have authorized applications.';
            }
            this._hideProgressBar();
        }
        else if (!currentLength) {
            this._message = 'We couldn\'t load applications at the moment.';
            this._hideProgressBar();
        }
    }

    _showProgressBar() {
        this._progressVisible = true;
    }

    _hideProgressBar() {
        setTimeout(function() {
            this._progressVisible = false;
        }.bind(this), 500);
    }
}
window.customElements.define(AppscoAccountAuthorizedApps.is, AppscoAccountAuthorizedApps);
