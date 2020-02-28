import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/appsco-import-resource.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoImportResources extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-import-resources;
            }
            :host .info {
                margin: 0;
            }
        </style>

        <appsco-import-resource id="appscoImportResource" authorization-token="[[ authorizationToken ]]" import-api="[[ importApi ]]">

            <h2 title="" slot="title">Importing resources</h2>

            <div info="" slot="info">
                <p class="info">
                    To get started, prepare your data in the proper format
                    for importing to AppsCo. Allowed format is comma separated csv.
                </p><ul>
                    <li>Currently, AppsCo only supports import from LastPass.</li>
                    <li>If you are importing more than 500 records at a time, split them into multiple CSVs before you import them.</li>
                    <li>Make sure your symbols are ASCII or Unicode Latin-based.</li>
                    <li>
                        Records with username and password will be imported as custom application,
                        records without username and password will be imported as secure note.
                    </li>
                </ul>
                <p></p>
            </div>
        </appsco-import-resource>
`;
  }

  static get is() { return 'appsco-import-resources'; }

  static get properties() {
      return {
          authorizationToken: {
              type: String
          },

          importApi: {
              type: String
          }
      };
  }

  toggle() {
      this.$.appscoImportResource.toggle();
  }

  close() {
      this.$.appscoImportResource.close();
  }
}
window.customElements.define(AppscoImportResources.is, AppscoImportResources);
