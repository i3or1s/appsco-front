import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/slide-from-left-animation.js';
import '@polymer/paper-styles/typography.js';
import './appsco-integration-resource-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import '../components/appsco-list-styles.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationResources extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            appsco-integration-resource-item {
                @apply --appsco-integration-resource-item;
            }
            :host .info-total {
                margin-bottom: 10px;
            }
            :host .total {
                @apply --paper-font-caption;
                color: var(--secondary-text-color);
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">
                <div class="info-total">
                    <div class="total">
                        Total resources: [[ _totalListItems ]]
                    </div>
                </div>

                <div class="list">
                    <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                        <appsco-integration-resource-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]"></appsco-integration-resource-item>

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

    static get is() { return 'appsco-integration-resources'; }

    static get observers() {
        return [
            '_observeItems(_listItems)'
        ];
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            this._showProgressBar();
        });
    }

    _observeItems(items) {
        this.setObservableType('resources');
        this.populateItems(items);
    }

    _setFinalItemList(availableItemList, existingItemList) {
        let availableIndex = availableItemList.length,
            existingIndex = existingItemList.length;

        for (let i = 0; i < availableIndex; i++) {
            const availableItem = availableItemList[i];

            for (let j = 0; j < existingIndex; j++) {
                if (availableItem.id === existingItemList[j].id) {
                    availableItem.exists = true;
                    existingItemList.splice(j, 1);
                    existingIndex--;
                }
            }
        }

        return availableItemList;
    }

    _onGetListResponse(event) {
        const response = event.detail.response,
            availableItemList = response.available ? response.available : [],
            existingItemList = response.existing ? response.existing : [],
            itemList = (0 < availableItemList.length) ? this._setFinalItemList(availableItemList, existingItemList) : [],
            itemListCount = itemList.length;

        this._hideMessage();
        this._totalListItems = itemListCount;

        if (0 === itemListCount) {
            this._showMessage('There are no resources to display.');
            this._handleEmptyLoad();
            return false;
        }

        if (0 < itemListCount) {
            this._listEmpty = false;

            itemList.forEach(function(el, index) {
                this._listLoaders.push(setTimeout(function() {
                    const items = JSON.parse(JSON.stringify(this._listItems));

                    el.activated = false;
                    el.selected = false;

                    this._listItems = [];
                    items.push(el);
                    this._listItems = items;
                    this.push('_allListItems', el);

                    if (index === itemListCount - 1) {
                        this._hideProgressBar();

                        this.dispatchEvent(new CustomEvent('list-loaded', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                items: itemList
                            }
                        }));
                    }
                }.bind(this), (index + 1) * 30 ));
            }.bind(this));
        }
        else {
            (itemList && !itemListCount) ?
                this._showMessage('There are no resources to display.') :
                this._showMessage('We couldn\'t load resources at the moment. Please contact AppsCo support.');

            this._handleEmptyLoad();
        }
    }
}
window.customElements.define(AppscoIntegrationResources.is, AppscoIntegrationResources);
