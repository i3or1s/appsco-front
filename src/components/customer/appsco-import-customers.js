import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/appsco-import-resource.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoImportCustomers extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-import-customers;
            }
            :host .info {
                margin: 0;
            }
            .download-action {
                color: var(--primary-text-color);
                display: inline;
                padding: 0;
                font-size: 12px;
            }
            .download-icon {
                width: 18px;
                height: 18px;
                margin-top: -4px;
            }
        </style>

        <appsco-import-resource id="appscoImportResource" authorization-token="[[ authorizationToken ]]" import-api="[[ importApi ]]">

            <h2 title="" slot="title">Importing customers</h2>

            <div info="" slot="info">
                <p class="info">
                    To get started, prepare your organization’s business customer data so it’s in the proper format
                    for importing to AppsCo. Allowed format is csv.
                    </p><ul>
                        <li>
                            If you are importing more then 500 customers at a time, split them into multiple
                            CSVs before you import them.
                        </li>
                        <li>
                            Make sure your symbols are ASCII or Unicode Latin-based.
                        </li>
                        <li>
                            Download example import for reference.
                            <paper-button class="download-action" on-tap="_onDownloadExampleImportFile">
                                <iron-icon class="download-icon" icon="icons:attachment"></iron-icon> Download
                            </paper-button>
                        </li>
                        <li>
                            If your list is in Excel or Google Sheet you can save it as CSV.
                        </li>
                    </ul>
                <p></p>
            </div>
        </appsco-import-resource>
`;
  }

  static get is() { return 'appsco-import-customers'; }

  static get properties() {
      return {
          authorizationToken: {
              type: String,
              value: ''
          },

          importApi: {
              type: String
          },

          domain: {
              type: String,
              value: ''
          }
      };
  }

  toggle() {
      this.$.appscoImportResource.toggle();
  }

  open() {
      this.$.appscoImportResource.open();
  }

  close() {
      this.$.appscoImportResource.close();
  }

  _onDownloadExampleImportFile(event) {
      event.stopPropagation();
      window.location.href = this.domain + '/example_import_customers.csv';
  }
}
window.customElements.define(AppscoImportCustomers.is, AppscoImportCustomers);
