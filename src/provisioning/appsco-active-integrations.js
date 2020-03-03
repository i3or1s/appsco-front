import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-active-integration-item.js';
import { AppscoListBehavior } from '../components/components/appsco-list-behavior.js';
import '../components/components/appsco-list-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoActiveIntegrations extends mixinBehaviors([AppscoListBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host {
                --appsco-list-item: {
                    @apply --appsco-active-integration-item;
                };
                --appsco-list-item-activated: {
                    @apply --appsco-active-integration-item-activated;
                };
            }
            :host appsco-active-integration-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-active-integration-item;
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onGetListError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">
                <div class="list">
                    <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                        <appsco-active-integration-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]" selectable="[[ selectable ]]" on-item="_onListItemAction" on-select-item="_onSelectListItemAction"></appsco-active-integration-item>
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

    static get is() { return 'appsco-active-integrations'; }

    reloadIntegrations() {
        this.reloadItems();
    }
}
window.customElements.define(AppscoActiveIntegrations.is, AppscoActiveIntegrations);
