/**
`appsco-application-info`
Contains app image, title.

    <appsco-application-info>
    </appsco-application-info>

### Styling

`<appsco-application-info>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-application-info` | Mixin for the root element | `{}`

@demo demo/appsco-application-info.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationInfo extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                @apply --layout-vertical;
                @apply --appsco-application-info;
            }

            :host .basic-info {
                @apply --layout-horizontal;
                @apply --layout-center;
            }

            :host iron-image {
                width: 32px;
                height: 32px;
                margin-right: 5px;

            }

            :host span[caption] {
                @apply --paper-font-caption;
            }

            :host .info {
                @apply --info-message;
            }
        </style>
        <div class="basic-info">
            <iron-image placeholder="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=" sizing="cover" preload="" fade="" src="[[ _applicationIcon ]]"></iron-image>
            <div>
                <span caption="">[[ application.title ]]</span>
            </div>
        </div>
        <template is="dom-if" if="[[ application.sso_counterpart ]]">
            <p class="info">
                An SSO counterpart of this application is available. SSO applications simplify the login process for
                users.
            </p>
        </template>
`;
  }

  static get is() { return 'appsco-application-info'; }

  static get properties() {
      return {
          company: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          /**
           * [Application](https://developers.appsco.com/api/dashboard/id/icons/id) that is to be rendered
           */
          application: {
              type: Object,
              value: {}
          },

          _applicationIcon: {
              type: String,
              computed: '_computeApplicationIcon(company, application)'
          }
      };
  }

  _computeApplicationIcon(company, application) {
      if (!application) {
          return '';
      }

      return company ? application.application_url : application.icon_url;
  }
}
window.customElements.define(AppscoApplicationInfo.is, AppscoApplicationInfo);
