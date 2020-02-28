import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/slide-from-left-animation.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import '../components/appsco-list-styles.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import './appsco-report-item.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoReportsList extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-list-styles"></style>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ !_listEmpty ]]">
                <div class="list">
                    <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                        <appsco-report-item id="reportsListItem_[[ index ]]" item="[[ item ]]" on-item="_onListItemAction" type="[[ type ]]">
                        </appsco-report-item>

                    </template>
                </div>
            </template>
        </div>
`;
  }

  static get is() { return 'appsco-reports-list'; }

  static get observers() {
      return [
          '_observeItems(_listItems)'
      ];
  }

  _observeItems(items) {
      this.setObservableType('reports');
      this.populateItems(items);
  }
}
window.customElements.define(AppscoReportsList.is, AppscoReportsList);
