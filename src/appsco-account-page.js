import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './components/account/appsco-account-image-settings.js';
import './account/appsco-account-components-page.js';
import './account/appsco-account-settings-page.js';
import './account/appsco-account-2fa-page.js';
import './account/appsco-account-2fa-manage.js';
import './account/appsco-account-notifications-page.js';
import './account/appsco-account-authorized-apps-page.js';
import './account/appsco-account-log-page.js';
import './account/appsco-account-change-password-page.js';
import './components/account/appsco-account-remove-personal.js';
import './account/appsco-account-page-actions.js';
import './account/appsco-account-disable-2fa.js';
import './components/account/appsco-account-authorized-app-revoke.js';
import './components/application/appsco-import-personal-resources.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-manage-page-styles">
            :host {
                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };
                --paper-card-header-text: {
                    padding-top: 8px;
                    padding-bottom: 8px;
                    padding-left: 16px;
                    padding-right: 16px;
                };
            }
            :host div[resource] {
                height: calc(100% - 32px - 20px);
            }
            :host appsco-account-image-settings {
                display: block;
            }
            :host appsco-account-image-settings .upload-container {
                border-radius: 50%;
            }
            :host .account-managed-by {
                margin-top: 10px;
            }
            :host .change-password-hero {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                width: 100px;
                height: 100px;
                opacity: 0;
                visibility: hidden;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">
            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-header">
                    <appsco-account-image-settings id="appscoAccountImageSettings" account="{{ account }}" authorization-token="[[ authorizationToken ]]" image-settings-api="[[ imageSettingsApi ]]">
                    </appsco-account-image-settings>
                </div>

                <div class="resource-content">
                    <template is="dom-if" if="[[ _accountName ]]">
                        <div class="account-name">[[ _accountName ]]</div>
                    </template>

                    <div class="account-email">[[ account.email ]]</div>

                    <div class="account-uuid">[[ account.uuid ]]</div>

                    <template is="dom-if" if="[[ account.company ]]">
                        <hr>
                        <div class="account-managed-by">
                            <p>Managed by: [[ account.company.name ]]</p>
                        </div>
                    </template>
                </div>

                <div class="resource-actions flex-horizontal">
                    <paper-button class="button secondary-button flex" on-tap="_onChangePassword">
                        Change password
                    </paper-button>
                    <template is="dom-if" if="![[ accountManaged ]]">
                        <paper-button class="button danger-button flex" on-tap="_onRemoveAccount">
                            Remove account
                        </paper-button>
                    </template>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <neon-animated-pages class="flex" selected="[[ _selected ]]" attr-for-selected="name" on-neon-animation-finish="_onPageAnimationFinish">

                        <appsco-account-components-page id="appscoAccountComponentsPage" name="appsco-account-components-page" account="{{ account }}" authorization-token="[[ authorizationToken ]]" notifications-api="[[ notificationsApi ]]" authorized-apps-api="[[ authorizedAppsApi ]]" log-api="[[ logApi ]]" two-fa-api="[[ twoFaApi ]]" two-fa-qr-api="[[ twoFaQrApi ]]" on-account-settings="_onAccountSettings" on-2fa-enable="_on2FAEnable" on-2fa-manage="_on2FAManage" on-all-notifications="_onAllNotifications" on-manage-authorized-apps="_onManageAuthorizedApps" on-import-personal-resources="_onImportPersonalResourcesAction" on-whole-log="_onWholeLog" on-log-loaded="_pageLoaded" on-log-empty="_pageLoaded">
                        </appsco-account-components-page>

                        <appsco-account-settings-page name="appsco-account-settings-page" account="{{ account }}" authorization-token="[[ authorizationToken ]]" settings-api="[[ settingsApi ]]" image-settings-api="[[ imageSettingsApi ]]" on-settings-saved="_onSettingsSaved" on-back="_onResourceBack">
                        </appsco-account-settings-page>

                        <appsco-account-2fa-page id="appscoAccountTwoFaPage" name="appsco-account-2fa-page" account="{{ account }}" two-fa-api="[[ twoFaApi ]]" two-fa-qr-api="[[ twoFaQrApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-back="_onResourceBack" on-twofa-enabled="_onTwoFaEnabled"></appsco-account-2fa-page>

                        <appsco-account-2fa-manage name="appsco-account-2fa-manage" account="{{ account }}" two-fa-codes-api="[[ twoFaCodesApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-back="_onResourceBack" on-disable-twofa="_onDisableTwoFaAction"></appsco-account-2fa-manage>

                        <appsco-account-notifications-page name="appsco-account-notifications-page" account="{{ account }}" authorization-token="[[ authorizationToken ]]" notifications-api="[[ notificationsApi ]]" on-back="_onResourceBack">
                        </appsco-account-notifications-page>

                        <appsco-account-authorized-apps-page id="appscoAccountAuthorizedAppsPage" name="appsco-account-authorized-apps-page" account="{{ account }}" authorization-token="[[ authorizationToken ]]" authorized-apps-api="[[ authorizedAppsApi ]]" on-revoke-authorized-application="_onRevokeAuthorizedApplication" on-back="_onResourceBack">
                        </appsco-account-authorized-apps-page>

                        <appsco-account-log-page id="appscoAccountLogPage" name="appsco-account-log-page" account="{{ account }}" authorization-token="[[ authorizationToken ]]" log-api="[[ logApi ]]" on-back="_onResourceBack">
                        </appsco-account-log-page>

                        <appsco-account-change-password-page name="appsco-account-change-password-page" authorization-token="[[ authorizationToken ]]" change-password-api="[[ changePasswordApi ]]" on-password-changed="_onPasswordChanged" on-back="_onResourceBack">
                        </appsco-account-change-password-page>

                    </neon-animated-pages>
                </div>

            </div>
        </appsco-content>

        <appsco-account-remove-personal id="accountRemoveDialog" authorization-token="[[ authorizationToken ]]" remove-account-api="[[ removeAccountApi ]]" logout-api="[[ logoutApi ]]">
        </appsco-account-remove-personal>

        <appsco-account-disable-2fa id="appscoAccountDisableTwoFa" two-fa-api="[[ twoFaApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]">
        </appsco-account-disable-2fa>

        <appsco-account-authorized-app-revoke id="appscoAccountAuthorizedAppRevoke" application="[[ _authorizedApplication ]]" authorization-token="[[ authorizationToken ]]">
        </appsco-account-authorized-app-revoke>

        <appsco-import-personal-resources id="appscoImportPersonalResources" authorization-token="[[ authorizationToken ]]" application-template-api="[[ applicationTemplateApi ]]">
        </appsco-import-personal-resources>

        <div id="changePasswordHero" class="change-password-hero"></div>
`;
  }

  static get is() { return 'appsco-account-page'; }

  static get properties() {
      return {
          account: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String
          },

          notificationsApi: {
              type: String
          },

          authorizedAppsApi: {
              type: String
          },

          logApi: {
              type: String
          },

          twoFaApi: {
              type: String
          },

          twoFaQrApi: {
              type: String
          },

          twoFaCodesApi: {
              type: String
          },

          settingsApi: {
              type: String
          },

          imageSettingsApi: {
              type: String
          },

          changePasswordApi: {
              type: String
          },

          removeAccountApi: {
              type: String
          },

          applicationTemplateApi: {
              type: String
          },

          /**
           * If attribute is set account display will contain account display name.
           * Otherwise, account display will contain account picture_url only.
           */
          _accountName: {
              type: String,
              computed: '_setAccountName(account)'
          },

          /**
           * Selected page.
           * It has value of component's 'name' attribute.
           */
          _selected: {
              type: String,
              value: 'appsco-account-components-page',
              notify: true
          },

          mediumScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          tabletScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          mobileScreen: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          accountManaged: {
              type: Boolean
          },

          animationConfig: {
              type: Object
          },

          showAllNotifications: {
              type: Boolean,
              value: false,
              observer: '_observeSeeAllNotifications'
          },

          pageLoaded: {
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return [
          '_updateScreen(mediumScreen, tabletScreen, mobileScreen)'
      ];
  }

  ready() {
      super.ready();

      this.pageLoaded = false;
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
                  duration: 200
              }
          }
      };

      beforeNextRender(this, function() {
          if (this.mobileScreen || this.tabletScreen || this.mediumScreen) {
              this.updateStyles();
          }
      });

      afterNextRender(this, function() {
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('twofa-enabled', this.reloadLog.bind(this));
      this.addEventListener('settings-saved', this.reloadLog.bind(this));
      this.addEventListener('token-generated', this.reloadLog.bind(this));
      this.addEventListener('password-changed', this.reloadLog.bind(this));
      this.addEventListener('image-changed', this.reloadLog.bind(this));
      this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
      this.toolbar.addEventListener('advanced-settings', this._onAccountAdvancedSettings.bind(this));
  }

  setupAfterTwoFaDisabled() {
      this._showAccountComponentsPage();
      this.$.appscoAccountComponentsPage.load2FaApi();
      this.reloadLog();
  }

  _updateScreen(medium, tablet, mobile) {
      this.updateStyles();

      if (mobile) {
          this.$.appscoContent.hideSection('resource');
      }
      else if(!this.$.appscoContent.resourceActive) {
          this.$.appscoContent.showSection('resource');
      }
  }

  _pageLoaded() {
      this.pageLoaded = true;
      this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
  }

  _observeSeeAllNotifications(seeAll) {
      if (seeAll) {
          this.showAllApplications();
      }
  }

  /**
   * Returns display name for account.
   * @param {Object} account.
   *
   * @private
   */
  _setAccountName(account) {
      let displayName = null;

      if (account.first_name) {
          displayName = account.first_name;
      }

      if (account.last_name) {
          displayName = displayName ? (displayName + ' ' + account.last_name) : account.last_name;
      }

      return displayName;
  }

  _onResourceBack() {
      this._showAccountComponentsPage();
  }

  _onTwoFaEnabled () {
      this._showAccountComponentsPage();
      this.$.appscoAccountComponentsPage.load2FaApi();
  }

  _onSettingsSaved() {
      this._showAccountComponentsPage();
  }

  _onPasswordChanged() {
      this._showAccountComponentsPage();
  }

  _onRemoveAccount() {
      this.$.accountRemoveDialog.open();
  }

  reloadAuthorizedApplications() {
      this.$.appscoAccountAuthorizedAppsPage.loadAuthorizedApps();
      this.$.appscoAccountComponentsPage.loadAuthorizedApps();
  }

  _showAccountComponentsPage() {
      this._enableAdvancedSettings();
      this._selected = 'appsco-account-components-page';
  }

  showAllApplications() {
      this.$.appscoAccountComponentsPage.setSharedElement('notifications');

      setTimeout(function() {
          this._onAllNotifications();
          this.showAllNotifications = false;
      }.bind(this), 50);
  }

  resetPage() {
      this.$.appscoAccountComponentsPage.hideAdvancedSettings();
      this.$.appscoAccountTwoFaPage.resetPage();
      this._showAccountComponentsPage();
  }

  toggleResource() {
      this.$.appscoContent.toggleSection('resource');
  }

  reloadLog() {
      this.$.appscoAccountComponentsPage.loadLog();
      this.$.appscoAccountLogPage.loadLog();
  }

  _onAccountAdvancedSettings() {
      this.$.appscoAccountComponentsPage.toggleAdvancedSettings();
      this._showAccountComponentsPage();
  }

  _disableAdvancedSettings() {
      this.dispatchEvent(new CustomEvent('disable-advanced-settings', { bubbles: true, composed: true }));
  }

  _enableAdvancedSettings() {
      this.dispatchEvent(new CustomEvent('enable-advanced-settings', { bubbles: true, composed: true }));
  }

  _onAccountSettings() {
      this._disableAdvancedSettings();
      this._selected = 'appsco-account-settings-page';
  }

  _on2FAEnable() {
      this._disableAdvancedSettings();
      this._selected = 'appsco-account-2fa-page';
  }

  _on2FAManage() {
      this._disableAdvancedSettings();
      this._selected = 'appsco-account-2fa-manage';
  }

  _onAllNotifications() {
      this._disableAdvancedSettings();
      this._selected = 'appsco-account-notifications-page';
  }

  _onManageAuthorizedApps() {
      this._disableAdvancedSettings();
      this._selected = 'appsco-account-authorized-apps-page';
  }

  _onWholeLog() {
      this._disableAdvancedSettings();
      this._selected = 'appsco-account-log-page';
  }

  _onChangePassword() {
      this._disableAdvancedSettings();

      this.$.appscoAccountComponentsPage.sharedElements = {
          'hero': this.$.changePasswordHero
      };

      this._selected = 'appsco-account-change-password-page';
  }

  _onPageAnimationFinish(event) {
      const fromPage = event.detail.fromPage,
          toPage = event.detail.toPage;

      switch(fromPage.getAttribute('name')) {
          case 'appsco-account-settings-page':
          case 'appsco-account-change-password-page':
              fromPage.resetPage();
              break;
          default:
              break;
      }

      switch(toPage.getAttribute('name')) {
          case 'appsco-account-settings-page':
          case 'appsco-account-change-password-page':
              toPage.setPage();
              break;
          default:
              break;
      }
  }

  _onDisableTwoFaAction() {
      this.shadowRoot.getElementById('appscoAccountDisableTwoFa').open();
  }

  _onRevokeAuthorizedApplication(event) {
      const dialog = this.shadowRoot.getElementById('appscoAccountAuthorizedAppRevoke');
      dialog.setApplication(event.detail.application);
      dialog.open();
  }

  _onImportPersonalResourcesAction() {
      this.shadowRoot.getElementById('appscoImportPersonalResources').toggle();
  }
}
window.customElements.define(AppscoAccountPage.is, AppscoAccountPage);
