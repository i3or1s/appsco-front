import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import './appsco-compliance-report-account-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import '../components/appsco-list-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoComplianceReportAccounts extends mixinBehaviors([AppscoListBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host {
                --appsco-list-item: {
                    @apply --appsco-compliance-report-list-item;
                };
                --appsco-list-item-activated: {
                    @apply --appsco-compliance-report-list-item-activated;
                };
            }
            :host appsco-compliance-report-account-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-compliance-report-account-item;
            }
            :host .info-total {
                margin-bottom: 10px;
            }
            :host .total {
                @apply --paper-font-caption;
                opacity: 0.6;
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onGetListError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">

                <div class="info-total" hidden\$="[[ !_accountsCount ]]">
                    <span class="total">Total [[ _typeLabel ]]: [[ _accountsCount ]]</span>
                </div>

                <div class="list">
                    <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                        <appsco-compliance-report-account-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]" authorization-token="[[ authorizationToken ]]" number-of-resources-to-display="[[ numberOfResourcesToDisplay ]]" load-more="[[ loadMore ]]"></appsco-compliance-report-account-item>
                    </template>
                </div>
            </template>
        </div>

        <template is="dom-if" if="[[ !_listEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button class="load-more-action" on-tap="_onLoadMoreAction">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-compliance-report-accounts'; }

    static get properties() {
        return {
            numberOfResourcesToDisplay: {
                type: Number,
                value: 15
            },

            _accountsCount: {
                type: Number,
                value: 0
            },

            _typeLabel: {
                type: String,
                computed: '_computeTypeLabel(type)'
            }
        };
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('filter-done', this._getResultTotal);
        this.addEventListener('list-loaded', this._getResultTotal);
        this.addEventListener('list-empty', this._getResultTotal);
    }

    _computeTypeLabel(type) {
        return ('account' === type) ? 'users' : type + 's';
    }

    _getResultTotal() {
        this._accountsCount = this.getCurrentCount();
    }
}
window.customElements.define(AppscoComplianceReportAccounts.is, AppscoComplianceReportAccounts);
