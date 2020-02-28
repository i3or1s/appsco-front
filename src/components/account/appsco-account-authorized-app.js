/**
`appsco-account-authorized-app`
Is used to represent authorized app.

Example:

    <body>
      <appsco-account-authorized-app application="{}"
                                    short-view>
     </appsco-account-authorized-app>

 Custom property | Description | Default
----------------|-------------|----------
`--account-authorized-app` | Mixin applied to root element | `{}`
`--authorized-app` | Mixin applied to inner application element | `{}`
`--authorized-app-icon` | Mixin applied to application image | `{}`
`--authorized-app-info` | Mixin applied to application info container | `{}`
`--authorized-app-title` | Mixin applied to application title | `{}`
`--authorized-app-date` | Mixin applied to date | `{}`
`--authorized-app-additional-info` | Mixin applied additional info | `{}`

@demo demo/appsco-account-authorized-apps.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountAuthorizedApp extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: none;
                padding: 16px 0 10px 6px;
                border-top: 1px solid var(--divider-color);
                @apply --account-authorized-app;

            --paper-icon-button: {
                 width: 32px;
                 height: 32px;
             };

            --iron-image-height: 32px;
            }
            :host .application {
                position: relative;
                padding-top: 20px;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --authorized-app;
            }
            :host .application-info-container {
                @apply --layout-vertical;
                @apply --layout-flex;
            }
            :host .application-basic {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .application-date {
                font-size: 11px;
                position: absolute;
                top: 5px;
                right: 6px;
                opacity: 0.5;
                @apply --authorized-app-date;
            }
            :host .application-icon {
                min-width: 32px;
                margin-right: 10px;
                @apply --layout-flex-none;
                @apply --authorized-app-icon;
            }
            :host .application-info {
                @apply --layout-vertical;
                @apply --authorized-app-info;
            }
            :host .application-title {
                @apply --authorized-app-title;
            }
            :host .application-scope {
                font-size: 12px;
                opacity: 0.6;
            }
            :host .revoke-action {
                opacity: 0.6;
            }
            :host .application-additional {
                margin-top: 10px;
                font-size: 12px;
                opacity: 0.8;
                @apply --layout-vertical;
                @apply --authorized-app-additional-info;
            }
            :host .application-description {
                margin-top: 4px;
            }
            :host .application-info-value {
                opacity: 0.6;
            }
            :host iron-image::shadow img {
                max-width: 100%;
            }
            :host([short-view]) {
                padding: 6px;
            }
            :host([short-view]) .application {
                padding-top: 0;
            }
            :host([short-view]) .application-date, :host([short-view]) .revoke-action, :host([short-view]) .application-additional {
                display: none;
            }
            :host .revoke-action {
                font-size: 12px;
            }
        </style>

        <div class="application">
            <div class="application-date">[[ _dateFormat(application.created.date) ]]</div>

            <div class="application-info-container">
                <div class="application-basic">

                    <template is="dom-if" if="[[ application.icon_url ]]">
                        <iron-image preload="" fade="" placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAIAAgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/T2iiitTIKKKKACiiigAooooA//Z" src="[[ application.icon_url ]]" class="application-icon" hidden\$="[[ !application.icon_url ]]">
                        </iron-image>
                    </template>

                    <div class="application-info">
                        <div class="application-title">[[ application.title ]]</div>
                        <div class="application-scope">Access: [[ application.scopes ]]</div>
                    </div>
                </div>

                <div class="application-additional">

                    <template is="dom-if" if="[[ application.website ]]">
                        <div class="application-website">
                            Website:
                            <br>
                            <span class="application-info-value">[[ application.website ]]</span>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ application.description ]]">
                        <div class="application-description">
                            Description:
                            <br>
                            <span class="application-info-value">[[ application.description ]]</span>
                        </div>
                    </template>
                </div>
            </div>

            <paper-button on-tap="_onRevokeAction" class="revoke-action">Revoke</paper-button>
        </div>
`;
  }

  static get is() { return 'appsco-account-authorized-app'; }

  static get properties() {
      return {
          application: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          /**
           * Indicates if short view should be displayed.
           */
          shortView: {
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
          this.style.display = 'block';
      });

      afterNextRender(this, function() {
          this.playAnimation('entry');
      });
  }

  _dateFormat(value) {
      if (value) {
          const options = {
              weekday: "long", year: "numeric", month: "short",
              day: "numeric", hour: "2-digit", minute: "2-digit"
          };

          return (new Date(value)).toLocaleDateString('en', options);
      }
  }

  _onRevokeAction() {
      this.dispatchEvent(new CustomEvent('revoke-authorized-application', {
          bubbles: true,
          composed: true,
          detail: {
              application: this.application
          }
      }));
  }
}
window.customElements.define(AppscoAccountAuthorizedApp.is, AppscoAccountAuthorizedApp);
