import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import { AppscoTutorialBehaviour } from './appsco-tutorial-behaviour.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoTutorialAddCompanyUser extends mixinBehaviors([
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
            <p>You can find the company directory here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-3" class="step" hidden="">
            <p>Add new users to the directory here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-4" class="step" hidden="" style="position: absolute">
            <p>Fill in the user information and  <br>
                click ADD to add the user to the directory.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep5">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-5" class="step" hidden="">
            <p>You have seen how to add users to the company directory. <br>
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

    static get is() { return 'appsco-tutorial-add-company-user'; }

    static get properties() {
        return {
            page: {
                type: String
            },

            directoryPageLoaded: {
                type: Boolean,
                value: false,
                notify: true
            }
        };
    }

    ready() {
        super.ready();

        this.tutorialId = 'directory';
        this.tutorialTitle = 'Directory';
        this.description = 'Add company users to directory';
        this.icon = 'icons:social:person';
        this.readme = 'https://support.appsco.com/hc/en-gb/sections/360002084191-Users-and-licences-';
    }

    connectedCallback() {
        super.connectedCallback();

        this.tutorialId = 'directory';
        this.tutorialTitle = 'Directory';
        this.description = 'Add company users to directory';
        this.icon = 'icons:social:person';
        this.readme = 'https://support.appsco.com/hc/en-gb/sections/360002084191-Users-and-licences-';
        afterNextRender(this, function() {
            this.init();
        });
    }

    _readMore() {
        window.open(this.readme, '_blank');
    }

    pageChanged() {
        if(this.page !== 'directory' && this.step === 2) {
            this.reset();
        }
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
                reference: '* /deep/ #menuCompanyDirectoryText',
                coverTarget: '* /deep/ #menuContainer',
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step3: {
                reference: '* /deep/ #addAccountAction',
                coverTarget: '* /deep/ #addAccountAction',
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step4: {
                reference: '* /deep/ #addAccountDialogButton',
                coverTarget: '* /deep/ #addAccountDialog',
                popperOptions: {
                    placement: 'bottom'
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
        let attempts = 0,
            handleFunction = function () {
                attempts++;
                if (attempts > 100) {
                    return;
                }
                const element = this._querySelector('* /deep/ #addAccountAction');
                if (!element || this.page !== 'directory' || !this.directoryPageLoaded) {
                    setTimeout(handleFunction, 200);
                    return;
                }
                this.handleStep(index, item, doneBuildingPopperHandler);
            }.bind(this);
        handleFunction();
    }

    step4(index, item, doneBuildingPopperHandler) {
        setTimeout(function() {
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this), 550);
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
window.customElements.define(AppscoTutorialAddCompanyUser.is, AppscoTutorialAddCompanyUser);
