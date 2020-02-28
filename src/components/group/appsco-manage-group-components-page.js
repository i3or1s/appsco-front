import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './appsco-company-group-roles.js';
import './appsco-company-group-contacts.js';
import './appsco-company-group-resources.js';
import '../page/appsco-layout-with-cards-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoManageGroupComponentsPage extends mixinBehaviors([NeonSharedElementAnimatableBehavior], PolymerElement) {
  static get template() {
    return html`
        <style include="appsco-layout-with-cards-styles"></style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="cols-layout three-cols-layout">
            <div class="col">
                <paper-card heading="Resources">
                    <div class="card-content">
                        <appsco-company-group-resources id="appscoCompanyGroupResources" group="[[ group ]]" list-api="[[ groupResourcesApi ]]" authorization-token="[[ authorizationToken ]]" size="5" preview=""></appsco-company-group-resources>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageGroupResources">Manage</paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">
                <paper-card heading="Users">
                    <div class="card-content">
                        <appsco-company-group-roles id="appscoCompanyGroupRoles" group="[[ group ]]" list-api="[[ groupRolesApi ]]" authorization-token="[[ authorizationToken ]]" size="5" preview=""></appsco-company-group-roles>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageGroupRoles">Manage</paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">
                <paper-card heading="Contacts">
                    <div class="card-content">
                        <appsco-company-group-contacts id="appscoCompanyGroupContacts" group="[[ group ]]" list-api="[[ groupContactsApi ]]" authorization-token="[[ authorizationToken ]]" size="5" preview=""></appsco-company-group-contacts>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageGroupContacts">Manage</paper-button>
                    </div>
                </paper-card>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-manage-group-components-page'; }

  static get properties() {
      return {
          group: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          authorizationToken: {
              type: String,
              value: ''
          },

          groupRolesApi: {
              type: String
          },

          groupContactsApi: {
              type: String
          },

          groupResourcesApi: {
              type: String
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

          animationConfig: {
              type: Object
          }
      };
  }

  static get observers() {
      return [
          '_updateScreen(tabletScreen, mediumScreen)'
      ];
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': [{
              name: 'cascaded-animation',
              animation: 'fade-in-animation',
              nodes: dom(this.root).querySelectorAll('paper-card'),
              nodeDelay: 50,
              timing: {
                  delay: 200,
                  duration: 100
              }
          }],
          'exit': [{
              name: 'hero-animation',
              id: 'hero',
              fromPage: this
          }, {
              name: 'fade-out-animation',
              node: this,
              timing: {
                  duration: 500
              }
          }]
      };

      beforeNextRender(this, function() {
          if (this.tabletScreen || this.mediumScreen) {
              this.updateStyles();
          }
      });
  }

  loadPage() {
      this._loadRoles();
      this._loadContacts();
      this._loadResources();
  }

  addGroupRoles(roles) {
      this.$.appscoCompanyGroupRoles.addGroupItems(roles);
  }

  addGroupContacts(contacts) {
      this.$.appscoCompanyGroupContacts.addGroupItems(contacts);
  }

  addGroupResources(resources) {
      this.$.appscoCompanyGroupResources.addGroupItems(resources);
  }

  removeGroupRoles(roles) {
      this.$.appscoCompanyGroupRoles.removeGroupItems(roles);
  }

  removeGroupContacts(contacts) {
      this.$.appscoCompanyGroupContacts.removeGroupItems(contacts);
  }

  removeGroupResources(resources) {
      this.$.appscoCompanyGroupResources.removeGroupItems(resources);
  }

  _loadRoles() {
      this.$.appscoCompanyGroupRoles.loadItems();
  }

  _loadContacts() {
      this.$.appscoCompanyGroupContacts.loadItems();
  }

  _loadResources() {
      this.$.appscoCompanyGroupResources.loadItems();
  }

  _updateScreen(tablet, medium) {
      this.updateStyles();
  }

  _setSharedElement(target) {
      while (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
          target = target.parentNode;
      }

      this.sharedElements = {
          'hero': target
      };
  }

  _onManageGroupRoles(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-group-roles', { bubbles: true, composed: true }));
  }

  _onManageGroupContacts(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-group-contacts', { bubbles: true, composed: true }));
  }

  _onManageGroupResources(event) {
      this._setSharedElement(event.target);
      this.dispatchEvent(new CustomEvent('manage-group-resources', { bubbles: true, composed: true }));
  }
}
window.customElements.define(AppscoManageGroupComponentsPage.is, AppscoManageGroupComponentsPage);
