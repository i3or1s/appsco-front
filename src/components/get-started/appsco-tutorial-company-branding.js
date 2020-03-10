import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import { AppscoTutorialBehaviour } from './appsco-tutorial-behaviour.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoTutorialCompanyBranding extends mixinBehaviors([
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
            <p>You can find the company branding here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-3" class="step" hidden="">
            <p>Adjust your company branding here.</p>
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
            <p>Your company branding is now set up.<br>
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

    static get is() { return 'appsco-tutorial-company-branding'; }

    static get properties() {
        return {
            page: {
                type: String
            }
        };
    }

    ready() {
        super.ready();

        this.tutorialId = 'company_branding';
        this.tutorialTitle = 'Company branding';
        this.description = ' Upload logo and set company branding';
        this.icon = 'icons:settings';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360000109512-Company-Branding';
    }

    connectedCallback() {
        super.connectedCallback();

        this.tutorialId = 'company_branding';
        this.tutorialTitle = 'Company branding';
        this.description = ' Upload logo and set company branding';
        this.icon = 'icons:settings';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360000109512-Company-Branding';

        afterNextRender(this, function() {
            this.init();
        });
    }

    _readMore() {
        window.open(this.readme, '_blank');
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

    getPopperConfig() {
        return {
            step1: {
                reference: [ '#menuBurger' ],
                coverTarget: [ '#menuBurger' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step2: {
                reference: [ '#menuCompanySettingsText' ],
                coverTarget: [ '#menuContainer' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step3: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyComponentsPage', '#companySettingsBrandingCardBtn' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyComponentsPage', '#companySettingsBrandingCard' ],
                popperOptions: {
                    placement: 'bottom'
                }
            },
            step4: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyBrandSettingsPage', '#appscoCompanyBrandSettings', '#companyBrandSettingsSaveBtn' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyBrandSettingsPage', '#companyBrandSettings' ],
                popperOptions: {
                    placement: 'left-start'
                }
            },
            step5: {
                reference: [ '#menuBurger' ],
                coverTarget: [ '#menuBurger' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
        };
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
window.customElements.define(AppscoTutorialCompanyBranding.is, AppscoTutorialCompanyBranding);
