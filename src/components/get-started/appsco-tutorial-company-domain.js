import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import { AppscoTutorialBehaviour } from './appsco-tutorial-behaviour.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";

class AppscoTutorialCompanyDomain extends mixinBehaviors([
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
            <p>Verifying the company domain is an advanced feature.<br>
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

        <div id="step-2" class="step" hidden="">
            <p>You can add the company domain here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-3" class="step" hidden="">
            <p>Go to Domains to add and verify the company domain.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-4" class="step" hidden="" style="position: absolute">
            <p>To add your company domain, click here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-5" class="step" hidden="">
            <p>Enter your company domain and click ADD.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-6" class="step" hidden="">
            <p>Once the domain is added, you will have to verify the ownership. <br>
                Refer to the linked articles on the welcome page to learn more. <br>
                Click on Get token to continue with the tutorial.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-7" class="step" hidden="">
            <p>Copy and paste the verification token to your DNS as a TXT record. <br>
                Once this step is completed, you can verify the domain. <br>
                Refer to the linked articles on the welcome page to read more. <br>
                Click on NEXT to continue with the tutorial.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-8" class="step" hidden="">
            <p> If you completed the previous step, click on VERIFY to verify your domain. <br>
                It may take up to 24 hours before DNS is refreshed and your domain verified.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-9" class="step" hidden="">
            <p>You have seen how to verify your company domain. <br>
                Refer to the linked articles to learn more. <br>
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

    static get is() { return 'appsco-tutorial-company-domain'; }

    static get properties() {
        return {
            page: {
                type: String
            },

            companyDomainsLoaded: {
                type: Boolean,
                notify: true
            }
        };
    }

    constructor() {
        super();

        this.tutorialId = 'company_domain';
        this.tutorialTitle = 'Company domain';
        this.description = 'Verify your company\'s domain';
        this.icon = 'icons:settings';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360000109091-How-to-add-a-company-domain-';
    }

    ready() {
        super.ready();

        this.tutorialId = 'company_domain';
        this.tutorialTitle = 'Company domain';
        this.description = 'Verify your company\'s domain';
        this.icon = 'icons:settings';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360000109091-How-to-add-a-company-domain-';

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
                reference: [ '#appscoCompanyPage', '#appscoCompanyComponentsPage', '#companySettingsDomainsCardButton' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyComponentsPage', '#companySettingsDomainsCard' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step4: {
                reference: [ '#appscoCompanyPageActions', '#companySettingsAddDomain' ],
                coverTarget: [ '#appscoCompanyPageActions', '#companySettingsAddDomain' ],
                popperOptions: {
                    placement: 'left-start'
                }
            },
            step5: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyAddDomain', '#companyDomainDialogAddButton' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyAddDomain', '#addCompanyDomainDialog' ],
                popperOptions: {
                    placement: 'bottom'
                },
                popperListenerBuilder: function(tutorial) {
                    const cancelButton = tutorial._querySelector([ '#appscoCompanyPage', '#appscoCompanyAddDomain',  '#companyDomainDialogCancelButton' ]),
                        addButton = tutorial._querySelector([ '#appscoCompanyPage', '#appscoCompanyAddDomain',  '#companyDomainDialogAddButton' ]),
                        cancelListener = function () {
                            cancelButton.removeEventListener('click', cancelListener);

                            tutorial
                                ._querySelector([ '#appscoCompanyPage', '#appscoCompanyAddDomain',  '#addCompanyDomainDialog' ])
                                .removeAttribute('no-cancel-on-outside-click');
                            tutorial
                                ._querySelector([ '#appscoCompanyPage', '#appscoCompanyAddDomain',  '#addCompanyDomainDialog' ])
                                .removeAttribute('no-cancel-on-esc-key');

                            tutorial.reset();
                        },
                        addListener = function() {};

                    cancelButton.addEventListener('click', cancelListener);
                    addButton.addEventListener('click', addListener);

                    tutorial.registerAddedListener(cancelButton, 'click', cancelListener);
                    tutorial.registerAddedListener(addButton, 'click', addListener);
                }
            },
            step6: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyDomainsPage', '#appscoCompanyDomains', 'appsco-company-domain-item', 'paper-button.appsco-company-domain-item-get-token' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyDomainsPage', '#appscoCompanyDomains', 'appsco-company-domain-item', 'paper-button.appsco-company-domain-item-get-token' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step7: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyDomainToken', '#companyTokenCopyButton' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyDomainToken', '#companyTokenCopyButton' ],
                popperOptions: {
                    placement: 'right-start'
                },
                popperListenerBuilder: function(tutorial) {
                    const copyButton = tutorial._querySelector([ '#appscoCompanyPage', '#appscoCompanyDomainToken', '#companyTokenCopyButton' ]),
                        closeButton = tutorial._querySelector([ '#appscoCompanyPage', '#appscoCompanyDomainToken', '#companyTokenCloseButton' ]),
                        closeListener = function () {
                            tutorial
                                ._querySelector([ '#appscoCompanyPage', '#appscoCompanyDomainToken', '#companyTokenCloseButton' ])
                                .removeEventListener('click', closeListener);
                            tutorial.reset();
                        },
                        copyListener = function () {
                            closeButton.removeEventListener('click', closeListener);
                            closeButton.click();
                            tutorial.nextStep();
                        };

                    closeButton.addEventListener('click', closeListener);
                    copyButton.addEventListener('click', copyListener);

                    tutorial.registerAddedListener(closeButton, 'click', closeListener);
                    tutorial.registerAddedListener(copyButton, 'click', copyListener);
                }
            },
            step8: {
                reference: [ '#appscoCompanyPage', '#appscoCompanyDomainsPage', '#appscoCompanyDomains', 'appsco-company-domain-item', 'paper-button.appsco-company-domain-item-verify-token' ],
                coverTarget: [ '#appscoCompanyPage', '#appscoCompanyDomainsPage', '#appscoCompanyDomains', 'appsco-company-domain-item', 'paper-button.appsco-company-domain-item-verify-token' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step9: {
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
            if (this.page !== 'company') {
                return;
            }
            if (!element || this.page !== 'company' || !this.companyDomainsLoaded) {
                setTimeout(handleFunction, 200);
                return;
            }
            element.scrollTop = 0;
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this);
        setTimeout(handleFunction, 300);
    }

    step4(index, item, doneBuildingPopperHandler) {
        const handleFunction = function () {
            const element = this._querySelector([ '#appscoCompanyPageActions', '#companySettingsAddDomain' ]);
            if (this.page !== 'company') {
                return;
            }
            if (!element || this.page !== 'company' || element.display === 'none') {
                setTimeout(handleFunction, 200);
                return;
            }
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this);
        setTimeout(handleFunction, 50);
    }

    step5(index, item, doneBuildingPopperHandler) {
        setTimeout(function() {
            let dialog = this._querySelector([ '#appscoCompanyPage', '#appscoCompanyAddDomain', '#addCompanyDomainDialog' ]),
                initialHeight = dialog.clientHeight,
                sizer = function () {
                    const dialog = this._querySelector([ '#appscoCompanyPage', '#appscoCompanyAddDomain', '#addCompanyDomainDialog' ]);
                    if (!dialog || this.page !== 'company' || this.step !== 5 || dialog.style.display === 'none') {
                        return;
                    }

                    if (dialog.clientHeight !== initialHeight) {
                        this.popperStep[index + 1].cover.destroy();
                        this.popperStep[index + 1].cover = this.buildCover(dialog);
                        this.popperStep[index + 1].cover.show();
                        initialHeight = dialog.clientHeight;
                    }

                    setTimeout(sizer, 100);
                }.bind(this);
            dialog.setAttribute('no-cancel-on-outside-click', true);
            dialog.setAttribute('no-cancel-on-esc-key', true);
            this.handleStep(index, item, doneBuildingPopperHandler);
            sizer();
        }.bind(this), 500);
    }

    step7(index, item, doneBuildingPopperHandler) {
        setTimeout(function() {
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this), 800);
    }

    start() {
        this.step = 0;
        this.nextStep();
    }

    _nextStep() {
        this.currentStep.reference.click();
    }

    domainAdded(domain) {
        this
            ._querySelector([ '#appscoCompanyPage', '#appscoCompanyAddDomain', '#addCompanyDomainDialog' ])
            .removeAttribute('no-cancel-on-outside-click');

        this
            ._querySelector([ '#appscoCompanyPage', '#appscoCompanyAddDomain', '#addCompanyDomainDialog' ])
            .removeAttribute('no-cancel-on-esc-key');

        if (this.step !== 5) {
            return;
        }

        setTimeout(function() {
            this.nextStep();
        }.bind(this), 800);
    }
}
window.customElements.define(AppscoTutorialCompanyDomain.is, AppscoTutorialCompanyDomain);
