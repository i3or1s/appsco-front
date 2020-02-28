import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import { AppscoTutorialBehaviour } from './appsco-tutorial-behaviour.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoTutorialCompanySettings extends mixinBehaviors([
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
        </style>
        <div id="step-1" class="step" hidden="">
            <p>Open the company menu to get started.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-2" class="step" hidden="">
            <p>You can find the company settings here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-3" class="step" hidden="">
            <p>Adjust your company information here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-4" class="step" hidden="">
            <p>Click SAVE once you are done.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep5">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-5" class="step" hidden="">
            <p>Your company profile is now set up.<br>
                Open the company menu to continue with the Get started tutorial.
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

  static get is() { return 'appsco-tutorial-company-settings'; }

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

      this.tutorialId = 'company_profile';
      this.tutorialTitle = 'Company settings';
      this.description = 'Populate your company profile';
      this.icon = 'icons:settings';
      this.readme = 'https://support.appsco.com/hc/en-gb/articles/208043465-Company-Settings';
  }

  connectedCallback() {
      super.connectedCallback();

      this.tutorialId = 'company_profile';
      this.tutorialTitle = 'Company settings';
      this.description = 'Populate your company profile';
      this.icon = 'icons:settings';
      this.readme = 'https://support.appsco.com/hc/en-gb/articles/208043465-Company-Settings';

      afterNextRender(this, function() {
          this.init();
      });
  }

  pageChanged() {
      if(this.page !== 'company' && this.step === 2) {
          this.reset();
      }
      if(this.page === 'company' && this.step === 2) {
          setTimeout(function(){
              this.nextStep();
          }.bind(this), 3000);
      }
  }

  _readMore () {
      window.open(this.readme, '_blank');
  }

  getPopperConfig() {
      return {
          step1: {
              reference: '* /deep/ #menuBurger',
              coverTarget: '* /deep/ #menuBurger',
              popperOptions: {
                  placement: 'right-start'
              }
          },
          step2: {
              reference: '* /deep/ #menuCompanySettingsText',
              coverTarget: '* /deep/ #menuContainer',
              popperOptions: {
                  placement: 'right-start'
              }
          },
          step3: {
              reference: '* /deep/ #companySettingsCardBtn',
              coverTarget: '* /deep/ #companySettingsCard',
              popperOptions: {
                  placement: 'bottom'
              }
          },
          step4: {
              reference: '* /deep/ #companySettingsSaveBtn',
              coverTarget: '* /deep/ #companySettingsSettings',
              popperOptions: {
                  placement: 'left-start'
              }
          },
          step5: {
              reference: '* /deep/ #menuBurger',
              coverTarget: '* /deep/ #menuBurger',
              popperOptions: {
                  placement: 'right-start'
              }
          }
      };
  }

  step3(index, item, doneBuildingPopperHandler) {
      const me = this;
      const handleFunction = function () {
          const element = me._querySelector('* /deep/ #appscoCompanyComponentsPage');
          if (!element || this.page !== 'company') {
              setTimeout(handleFunction, 200);
              return;
          }
          element.scrollTop = 0;
          this.handleStep(index, item, doneBuildingPopperHandler);
      }.bind(this);
      setTimeout(handleFunction(), 5000);
  }

  step4(index, item, doneBuildingPopperHandler) {
      // wait 400 msec for animation to finish
      setTimeout(function() {
          this.handleStep(index, item, doneBuildingPopperHandler);
      }.bind(this), 400);
  }

  start() {
      this.step = 0;
      this.nextStep();
  }

  _nextStep() {
      this.currentStep.reference.click();
  }

  _nextStep5() {
      this.nextStep();
  }
}
window.customElements.define(AppscoTutorialCompanySettings.is, AppscoTutorialCompanySettings);
