import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import '../components/appsco-list-styles.js';
import './appsco-integration-template-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationTemplates extends mixinBehaviors([
    AppscoListBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host appsco-integration-template-item {
                width: 100%;
                @apply --appsco-integration-template-item;
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
                    <template is="dom-repeat" items="[[ _listItems ]]" filter="_isValidTemplate" on-dom-change="_onItemsDomChange">

                        <appsco-integration-template-item id="appscoListItem_[[ index ]]" item="[[ item ]]" integration="[[ integration ]]" authorization-token="[[ authorizationToken ]]" type="[[ type ]]" selectable="[[ selectable ]]" on-item="_onListItemAction" on-select-item="_onSelectListItemAction"></appsco-integration-template-item>
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

    static get is() { return 'appsco-integration-templates'; }

    static get properties() {
        return {
            integration: {
                type: Object,
                value: function () {
                    return {};
                }
            }
        };
    }

    getAvailableTemplatesExist() {
        let items = this._allListItems,
            length = items.length;

        for (let i = 0; i < length; i++) {
            if (!items[i].is_existing || (items[i].is_webhook_required && !items[i].is_webhook_enabled)) {
                return true;
            }
        }
        return false;
    }

    _isValidTemplate(item) {
        return (!item.is_existing || (item.is_webhook_required && !item.is_webhook_enabled));
    }
}
window.customElements.define(AppscoIntegrationTemplates.is, AppscoIntegrationTemplates);
