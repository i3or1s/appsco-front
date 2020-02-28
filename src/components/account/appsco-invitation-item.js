/*
`appsco-invitation-item`
Invitation item is used to present invitation in form of an item.

    <appsco-invitation-item>
    </appsco-invitation-item>

### Styling

`<appsco-invitation-item>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--item-background-color` | Background color applied to the root element | `#fff`
`--color` | Color applied to all the text | `#33`
`--appsco-invitation-item` | Mixin applied to the root element | `{}`
`--invitation-basic-info` | Mixin applied to the basic info | `{}`
`--invitation-status-info` | Mixin applied to the status info | `{}`
`--invitation-basic-info-values` | Mixin applied to the basic info values | `{}`
`--invitation-status-info-values` | Mixin applied to the status info values | `{}`
`--invitation-item-icon-fill-color` | Fill color for invitation icon | `{}`

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-request.js';
import '../components/appsco-date-format.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoInvitationItem extends mixinBehaviors([NeonAnimationRunnerBehavior, Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: none;
                color: var(--primary-text-color);
            }
            :host .item-progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --item-progress-bar;
            }
            .item {
                width: 100%;
                height: 70px;
                padding: 0 10px;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
                background-color: var(--item-background-color, #fff);
                border-radius: 3px;
                @apply --shadow-elevation-2dp;
                @apply --layout-horizontal;
                @apply --layout-center;
                transition: all 0.1s ease-out;
                @apply --appsco-invitation-item;
            }
            .item:hover {
                @apply --shadow-elevation-4dp;
            }
            :host([active]) .item {
                background: var(--app-primary-color);
                color: #ffffff;
                transition: all 0.2s ease-in;
            }
            .invitation-icon {
                width: 52px;
                height: 52px;
                background-color: var(--app-primary-color);
                @apply --layout-flex-none;
                border-radius: 50%;
                position: relative;
            }
            .invitation-icon::shadow #sizedImgDiv, .invitation-icon::shadow #placeholder {
                border-radius: 50%;
            }
            .invitation-icon .icon {
                width: 24px;
                height: 24px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;

                --iron-icon-fill-color: var(--invitation-item-icon-fill-color, #ffffff);
            }
            .invitation-initials .initials {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                line-height: 52px;
                text-align: center;
                text-transform: uppercase;
                font-size: 18px;
            }
            .invitation-title {
                display: block;
                height: 32px;
                line-height: 16px;
                @apply --paper-font-common-base;
                font-size: 14px;
                font-weight: 400;
                overflow: hidden;
            }
            .actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                position: absolute;
                right: 4px;
                bottom: 4px;
            }
            paper-button {
                @apply --paper-font-common-base;
                @apply --paper-font-common-nowrap;

                padding: 4px;
                font-size: 12px;
                font-weight: 400;
                letter-spacing: 0.018em;
                line-height: 18px;
                text-transform: uppercase;
            }
            paper-button[disabled] {
                background: transparent;
            }
            .invitation-info {
                @apply --layout-vertical;
                @apply --layout-start;
                padding: 0 10px;
            }
            .invitation-basic-info {
                width: 220px;
                @apply --invitation-basic-info;
            }
            .invitation-status-info {
                border-left: 1px solid var(--divider-color);
                @apply --invitation-status-info;
            }
            .invitation-basic-info .info-label, .invitation-basic-info .info-value {
                width: 220px;
                @apply --paper-font-common-nowrap;
                @apply --invitation-basic-info-values;
            }
            .invitation-status-info .info-label, .invitation-status-info .info-value {
                width: 220px;
                @apply --paper-font-common-nowrap;
                @apply --invitation-status-info-values;
            }
            .invitation-status-info .info-label {
                color: var(--app-primary-color);
            }
            .invitation-status-info .not-sent {
                color: var(--app-danger-color);
            }
            .info-label {
                font-size: 16px;
                height: auto;
                line-height: normal;
            }
            .info-value {
                display: block;
                font-size: 12px;
            }
        </style>

        <div class="item">

            <paper-progress class="item-progress-bar" indeterminate="" hidden\$="[[ !_progressBarDisplay ]]"></paper-progress>

            <div class="invitation-icon invitation-initials">
                <iron-icon icon="icons:drafts" class="icon"></iron-icon>
            </div>

            <!--<div class="invitation-icon invitation-initials">-->
            <!--<span class="initials">[[ _initials ]]</span>-->
            <!--</div>-->

            <div class="invitation-info invitation-basic-info">
                <span class="info-label invitation-title">[[ _invitationTitle ]]</span>

                <template is="dom-if" if="[[ _invitationTitle ]]">
                    <span class="info-value">[[ invitation.email ]]</span>
                </template>
            </div>


            <div class="invitation-info invitation-status-info">
                <template is="dom-if" if="[[ _invitationSent ]]">
                    <span class="info-label">Invitation pending</span>
                    <span class="info-value">
                        Last sent:
                        <appsco-date-format date="[[ invitation.resent_at.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>
                    </span>
                </template>

                <template is="dom-if" if="[[ !_invitationSent ]]">
                    <span class="info-label not-sent">Invitation not sent</span>
                    <span class="info-value">
                        Created at:
                        <appsco-date-format date="[[ invitation.created_at.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>
                    </span>
                </template>
            </div>

            <div class="actions">
                <paper-button on-tap="_onResend">Resend</paper-button>
                <paper-button on-tap="_onRemove">Remove</paper-button>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-invitation-item'; }

  static get properties() {
      return {
          invitation: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _invitationTitle: {
              type: String,
              value: ''
          },

          _invitationSent: {
              type: Boolean,
              computed: '_computeInvitationSentStatus(invitation)'
          },

          _initials: {
              type: String,
              computed: '_computeInitials(invitation)'
          },

          _resendApi: {
              type: String,
              computed: '_computeResendApi(invitation)'
          },

          _progressBarDisplay: {
              type: Boolean,
              value: false
          },

          active: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
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
                  duration: 200
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

  _computeInvitationSentStatus(invitation) {
      return invitation && 0 < parseInt(invitation.resent_count);
  }

  _computeInitials(invitation) {
      let initials = '';

      if (invitation.self && invitation.first_name && invitation.last_name) {
          initials = invitation.first_name.substring(0, 1) + invitation.last_name.substring(0, 1);
          this._invitationTitle = invitation.first_name + ' ' + invitation.last_name;
      }
      else if (invitation.self && invitation.email) {
          initials = invitation.email.substring(0, 2);
          this._invitationTitle = invitation.email;
      }

      return initials;
  }

  _computeResendApi(invitation) {
      return invitation && invitation.self ? invitation.self + '/resend' : null;
  }

  _showProgressBar() {
      this._progressBarDisplay = true;
  }

  _hideProgressBar() {
      setTimeout(function() {
          this._progressBarDisplay = false;
      }.bind(this), 500);
  }

  _onResend(event) {
      const request = document.createElement('iron-request'),
          options = {
              url: this._resendApi,
              method: 'PATCH',
              handleAs: 'json',
              headers: this._headers
          };

      event.stopPropagation();

      this._showProgressBar();

      request.send(options).then(function() {
          if (200 === request.status) {
              this.invitation = request.response;

              this.dispatchEvent(new CustomEvent('invitation-resent', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      invitation: this.invitation
                  }
              }));
          }
          this._hideProgressBar();
      }.bind(this));
  }

  _onRemove(event) {
      event.stopPropagation();

      this.dispatchEvent(new CustomEvent('remove', {
          bubbles: true,
          composed: true,
          detail: {
              invitation: this.invitation
          }
      }));
  }
}
window.customElements.define(AppscoInvitationItem.is, AppscoInvitationItem);
