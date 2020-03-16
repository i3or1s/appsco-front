import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import { AppscoTutorialBehaviour } from './appsco-tutorial-behaviour.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";

class AppscoTutorialBrandedLogin extends mixinBehaviors([
    AppscoTutorialBehaviour,
    AppscoCoverBehaviour
], DisableUpgradeMixin(PolymerElement)) {
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
            <p>You can find the branded login options here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-3" class="step" hidden="">
            <p>Customize the login form for your company and add your own branding here.<br>
                </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-4" class="step" hidden="" style="position: absolute">
            <p>Click SAVE once you are done.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep5">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-5" class="step" hidden="">
            <p>Your company branded login is now set up.<br>
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

    static get is() { return 'appsco-tutorial-branded-login'; }

    static get properties() {
        return {
            page: {
                type: String
            }
        };
    }

    constructor() {
        super();

        this.tutorialId = 'branded_login';
        this.tutorialTitle = 'Branded login';
        this.description = 'Set customized login for your company';
        this.icon = 'icons:settings';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360014981992-Branded-login';
    }

    ready() {
        super.ready();

        this.tutorialId = 'branded_login';
        this.tutorialTitle = 'Branded login';
        this.description = 'Set customized login for your company';
        this.icon = 'icons:settings';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360014981992-Branded-login';

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
                reference: [ '#appscoCompanyPage', '#appscoCompanyComponentsPage', '#companySettingsBrandedLoginCardBtn' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyComponentsPage', '#companySettingsBrandedLoginCard' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step4: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyBrandedLoginPage', '#submitBrandedLoginForm' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyBrandedLoginPage', '#brandedLoginCard' ],
                popperOptions: {
                    placement: 'left'
                }
            },
            step5: {
                reference: [ '#menuBurger' ],
                coverTarget: [ '#menuBurger' ],
                popperOptions: {
                    placement: 'right-start'
                }
            }
        };
    }

    step3(index, item, doneBuildingPopperHandler) {
        const handleFunction = function () {
            const element = this._querySelector([ '#appscoCompanyPage', '#appscoCompanyComponentsPage' ]);
            if (!element || this.page !== 'company') {
                setTimeout(handleFunction, 200);
                return;
            }
            element.scrollTop = element.scrollHeight;
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this);
        handleFunction();
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
window.customElements.define(AppscoTutorialBrandedLogin.is, AppscoTutorialBrandedLogin);
