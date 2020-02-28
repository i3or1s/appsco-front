/**
`appsco-directory-role-resource-admin-application`
Is used to represent companyRole for application.

Example:

    <body>
      <appsco-directory-role-resource-admin-application companyRole="{}" preview>
     </appsco-directory-role-resource-admin-application>

 Custom property | Description | Default
----------------|-------------|----------
`--appsco-directory-role-resource-admin-application` | Mixin applied to root element | `{}`
`--appsco-directory-role-resource-admin-application-image` | Mixin applied to inner image element | `{}`
`--appsco-directory-role-resource-admin-application-image-contain` | Mixin applied to iron-image #sizedImgDiv | `{}`

@demo demo/company/appsco-directory-role-resource-admin-application.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-image/iron-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoDirectoryRoleResourceAdminApplication extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: none;
                color: var(--primary-text-color);
                @apply --appsco-directory-role-application;
                margin-bottom: 4px;
                font-size: 14px;
            }
            :host .iron-image {
                border-radius: 50%;
            }
            :host .iron-image::shadow #sizedImgDiv, :host .iron-image::shadow #placeholder {
                border-radius: 50%;
            }
            :host .companyRole-image-preview {
                width: 28px;
                height: 28px;
                @apply --appsco-directory-role-application-image;
            }
            :host .companyRole-image-preview::shadow #sizedImgDiv, :host .companyRole-image-preview::shadow #placeholder {
                @apply --appsco-directory-role-application-image-contain;
            }
            :host .account-initials {
                position: relative;
                background-color: var(--body-background-color, #f5f8fa);
                color: var(--primary-text-color);
                cursor: default;
                @apply --subscriber-initials;
            }
            :host .account-initials .initials {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                line-height: 28px;
                text-align: center;
                text-transform: uppercase;
                font-size: 12px;
            }
            paper-tooltip {
                --paper-tooltip: {
                    font-size: 11px;
                    line-height: 12px;
                };
            }
            :host .companyRole {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --shadow-elevation-2dp;
                width: 100%;
                height: 70px;
                padding: 0 10px;
                box-sizing: border-box;
                border-radius: 3px;
                overflow: hidden;
                position: relative;
                background-color: var(--item-background-color, #fafafa);
                @apply --appsco-directory-role-resource-admin-application;
            }
            :host .companyRole:hover {
                @apply --shadow-elevation-4dp;
            }
            :host .companyRole .companyRole-image-preview {
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 50%;
                @apply --layout-flex-none;
            }
            :host .companyRole .initials {
                line-height: 52px;
                font-size: 18px;
            }
            :host .companyRole-info {
                @apply --layout-vertical;
                @apply --layout-start;
                padding: 0 10px;
            }
            :host .companyRole-basic-info {
                width: 220px;
            }
            :host.companyRole-basic-info .info-label, :host .companyRole-basic-info .info-value {
                width: 226px;
                @apply --paper-font-common-nowrap;
            }
            :host .companyRole-security-info {
                border-left: 1px solid var(--divider-color);
            }
            :host .info-label {
                font-size: 16px;
                height: auto;
                line-height: normal;
            }
            :host .info-value {
                display: block;
                font-size: 12px;
            }
            :host .companyRole-name {
                display: block;
                @apply --paper-font-common-base;
                font-size: 16px;
                font-weight: 400;
                overflow: hidden;
            }
            :host .actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                position: absolute;
                right: 4px;
                bottom: 4px;
            }
            :host paper-button {
                @apply --paper-font-common-base;
                @apply --paper-font-common-nowrap;
                padding: 4px;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.018em;
                line-height: 18px;
                text-transform: uppercase;
            }
            :host paper-button[disabled] {
                background: transparent;
            }
            :host .application-icon {
                width: 24px;
                height: 24px;
                margin-right: 5px;
            }
            :host .flex-horizontal {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .flex-vertical {
                @apply --layout-vertical;
            }
        </style>

        <template is="dom-if" if="[[ preview ]]">
            <div class="flex-horizontal">
                <iron-image class="application-icon" preload="" fade="" sizing="cover" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" src="[[ application.application_url ]]"></iron-image>
                <span>[[ application.title ]]</span>
            </div>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="companyRole">

                <iron-image class="iron-image companyRole-image-preview" sizing="cover" preload="" fade="" src="[[ application.application_url ]]" alt="[[ application.title ]]"></iron-image>


                <div class="companyRole-info companyRole-basic-info">
                    <span class="info-label companyRole-name">[[ application.title ]]</span>
                    <span class="info-value">
                        [[ _orgUnits ]]
                    </span>
                </div>
                <div class="actions">
                    <paper-button on-tap="_onRevokeAction">Revoke</paper-button>
                </div>
            </div>
        </template>
`;
  }

  static get is() { return 'appsco-directory-role-resource-admin-application'; }

  static get properties() {
      return {
          companyRole: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          /**
           * Application which is assigned to account.
           */
          application: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          /**
           * Indicates if companyRole should be in preview mode rather then full detailed view.
           */
          preview: {
              type: Boolean,
              value: false
          },

          animationConfig: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': {
              name: 'fade-in-animation',
              node: this,
              timing: {
                  duration: 300
              }
          },
          'exit': {
              name: 'fade-out-animation',
              node: this,
              timing: {
                  duration: 100
              }
          }
      };

      beforeNextRender(this, function() {
          this.style.display = 'inline-block';
      });

      afterNextRender(this, function() {
          this.playAnimation('entry');
      });
  }

  _computeOrganizationUnits(application) {
      if (application.org_units) {
          var result = '',
              orgUnits = application.org_units,
              length = orgUnits.length;

          for (var i = 0; i < length; i++) {
              result += orgUnits[i].name;
              result += (i === length -1) ? '' : ', ';
          }

          return result;
      }

      return '';
  }

  _onRevokeAction(event) {
      this.dispatchEvent(new CustomEvent('revoke-resource-admin', {
          bubbles: true,
          composed: true,
          detail: {
              assignee: this.companyRole.account,
              application: this.application
          }
      }));
  }
}
window.customElements.define(AppscoDirectoryRoleResourceAdminApplication.is, AppscoDirectoryRoleResourceAdminApplication);
