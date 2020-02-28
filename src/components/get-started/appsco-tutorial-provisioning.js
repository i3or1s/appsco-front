import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import { AppscoTutorialBehaviour } from './appsco-tutorial-behaviour.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoTutorialProvisioning extends mixinBehaviors([
    AppscoTutorialBehaviour,
    AppscoCoverBehaviour
], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
            }
            :host .step{
                z-index: 9000;
                background-color: var(--header-background-color);
                color: var(--header-text-color);
                border: 1px solid rgba(0,0,0,0.3);

                padding: 10px;
                @apply --shadow-elevation-8dp;
                margin-left:10px;
            }
            .flex-horizontal {
                @apply --layout-horizontal;
            }
            .empty {
                @apply --layout-flex;
            }
            :host #step-1 a.knowledge-base-link {
                text-decoration: none;
                color: inherit;

            }
        </style>
        <div id="step-1" class="step" hidden="">
            <p style="padding: 10px;">
                Provisioning refers to adding integrations with the other systems in order to automate <br>
                onboarding and offboarding of users and contacts while providing better control <br>
                over access rights and resource security. <br>
                <br>
                AppsCo supports integrations with several systems and, depending on your company needs, <br>
                you can set up integrations from external systems to AppsCo or the other way around. <br>
                <br>
                Setting up integration rules allows you to automate adding, <br>
                modifying and removing users and clients and their access rights to different systems. <br>
                Refer to the linked articles to learn more.

            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_readMore">Read more</paper-button>
                    <paper-button on-tap="_nextStep">Close</paper-button>
                </div>
            </div>
        </div>

        <div id="step-2" class="step" hidden="">
            <p>
                Setting up Provisioning is an advanced feature.<br>
                You might need help to complete this process.<br>
                Open the company menu to get started.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_readMore">Read more</paper-button>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-3" class="step" hidden="">
            <p>You can add integrations here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-4" class="step" hidden="">
            <p>
                To create a new integration, click on ADD.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-5" class="step" hidden="">
            <p>Choose a system you wish to create an integration with.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-6" class="step" hidden="">
            <p>
                Fill in the necessary information to configure an integration and click ADD.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-7" class="step" hidden="">
            <p>You have seen how to add an integration.<br>
                The next step is to configure integration rules and webhooks, <br>
                once the integration is added.  <br>
                Refer to the linked articles to learn more.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_readMore">Read more</paper-button>
                    <paper-button on-tap="_nextStep">Done</paper-button>
                </div>
            </div>
        </div>
`;
  }

  static get is() { return 'appsco-tutorial-provisioning'; }

  static get properties() {
      return {
          page: {
              type: String
          },

          tutorialTitle: {
              type: String,
              notify: true
          }
      };
  }

  ready() {
      super.ready();

      this.tutorialId = 'provisioning';
      this.tutorialTitle = 'Provisioning';
      this.description = 'Add integrations with other systems';
      this.icon = 'icons:icons:compare-arrows';
      this.readme = 'https://support.appsco.com/hc/en-gb/sections/360002084391-Provisioning';
  }

  connectedCallback() {
      super.connectedCallback();

      this.tutorialId = 'provisioning';
      this.tutorialTitle = 'Provisioning';
      this.description = 'Add integrations with other systems';
      this.icon = 'icons:icons:compare-arrows';
      this.readme = 'https://support.appsco.com/hc/en-gb/sections/360002084391-Provisioning';

      afterNextRender(this, function() {
          this.init();
      });
  }

  pageChanged() {
      if(this.page !== 'provisioning' && this.step === 3) {
          this.reset();
      }
  }

  _readMore() {
      window.open(this.readme, '_blank');
  }

  getPopperConfig() {
      return {
          step1: {
              reference: 'body',
              coverTarget: '* /deep/ appsco-tutorial-provisioning /deep/ #step-1',
              popperOptions: {
                  placement: 'right-start'
              }
          },
          step2: {
              reference: '* /deep/ #menuBurger',
              coverTarget: '* /deep/ #menuBurger',
              popperOptions: {
                  placement: 'right-start'
              }
          },
          step3: {
              reference: '* /deep/ #menuProvisioningText',
              coverTarget: '* /deep/ #menuContainer',
              popperOptions: {
                  placement: 'right-start'
              }
          },
          step4: {
              reference: '* /deep/ appsco-provisioning-actions /deep/ paper-button.add-action',
              coverTarget: '* /deep/ appsco-provisioning-actions /deep/ paper-button.add-action',
              popperOptions: {
                  placement: 'left-start'
              }
          },
          step5: {
              reference: '* /deep/ appsco-add-integration /deep/ appsco-available-integration-item /deep/ div.item',
              coverTarget: '* /deep/ appsco-add-integration /deep/ appsco-available-integration-item  /deep/ div.item',
              popperOptions: {
                  placement: 'left-start'
              }
          },
          step6: {
              reference: '* /deep/ appsco-add-integration /deep/ paper-button#addAction',
              coverTarget: '* /deep/ appsco-add-integration /deep/ paper-dialog',
              popperOptions: {
                  placement: 'left-start'
              },
              popperListenerBuilder: function(tutorial) {
                  let dialog = tutorial._querySelector('* /deep/ appsco-add-integration /deep/ paper-dialog'),
                      cancelButton = tutorial._querySelector('* /deep/ appsco-add-integration /deep/ paper-button[dialog-dismiss]'),
                      addButton = tutorial._querySelector('* /deep/ appsco-add-integration /deep/ paper-button#addAction'),
                      cancelListener,
                      addListener;

                  cancelListener = function() {
                      cancelButton.removeEventListener('click', cancelListener);
                      addButton.removeEventListener('click', addListener);
                      dialog.removeAttribute('no-cancel-on-outside-click');
                      dialog.removeAttribute('no-cancel-on-esc-key');
                      tutorial.reset();
                  };

                  addListener = function() {
                      cancelButton.removeEventListener('click', cancelListener);
                      addButton.removeEventListener('click', addListener);
                      dialog.removeAttribute('no-cancel-on-outside-click');
                      dialog.removeAttribute('no-cancel-on-esc-key');

                      dialog.close();
                      tutorial.nextStep();
                  };

                  cancelButton.addEventListener('click', cancelListener);
                  addButton.addEventListener('click', addListener);
              }
          },
          step7: {
              reference: '* /deep/ #menuBurger',
              coverTarget: '* /deep/ #menuBurger',
              popperOptions: {
                  placement: 'left-start'
              }
          }
      };
  }

  start() {
      this.step = 0;
      this.nextStep();
  }

  step2(index, item, doneBuildingPopperHandler) {
      this.handleStep(index, item, doneBuildingPopperHandler);
  }

  step3(index, item, doneBuildingPopperHandler) {
      this.handleStep(index, item, doneBuildingPopperHandler);
      setTimeout(function(){
          // Is firefox
          if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
              this.popperStep[index + 1].popper.popper.style.left = "200px";
          }
      }.bind(this), 300);
  }

  step4(index, item, doneBuildingPopperHandler) {
      setTimeout(function() {
          this.handleStep(index, item, doneBuildingPopperHandler);
      }.bind(this), 400);
  }

  step5(index, item, doneBuildingPopperHandler) {
      setTimeout(function() {
          this
              ._querySelector('* /deep/ appsco-add-integration /deep/ paper-dialog')
              .setAttribute('no-cancel-on-outside-click', true);
          this
              ._querySelector('* /deep/ appsco-add-integration /deep/ paper-dialog')
              .setAttribute('no-cancel-on-esc-key', true);
          this.handleStep(index, item, doneBuildingPopperHandler);
      }.bind(this), 700);
  }

  step6(index, item, doneBuildingPopperHandler) {
      setTimeout(function() {
          this.handleStep(index, item, doneBuildingPopperHandler);
      }.bind(this), 500);
  }

  step7(index, item, doneBuildingPopperHandler) {
      setTimeout(function() {
          this.handleStep(index, item, doneBuildingPopperHandler);
      }.bind(this), 500);
  }

  _nextStep() {
      this.currentStep.reference.click();
  }
}
window.customElements.define(AppscoTutorialProvisioning.is, AppscoTutorialProvisioning);
