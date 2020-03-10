import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import { AppscoTutorialBehaviour } from './appsco-tutorial-behaviour.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoTutorialResources extends mixinBehaviors([
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
            <p>You can find and add the company applications here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-3" class="step" hidden="">
            <p>Add an application here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep3">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-4" class="step" hidden="" style="position: absolute">
            <p>There are several types of resources you can add.  <br>
                Refer to the linked articles on the welcome page to learn more. <br>
                For the purpose of this tutorial, select an Application.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-5" class="step" hidden="">
            <p>As an example, search for Facebook  <br>
                and click on the box once it appears.
            </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
            </div>
        </div>

        <div id="step-6" class="step" hidden="">
            <p>Fill in username and password to configure the application and click ADD.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>
        <div id="step-7" class="step" hidden="">
            <p>You have seen how to add an application to the company resources. <br>
                Open the company menu to continue with the Get started tutorial. </p>
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

    static get is() { return 'appsco-tutorial-resources'; }

    static get properties() {
        return {
            page: {
                type: String
            },

            resourcesPageLoaded: {
                type: Boolean,
                value: false,
                notify: true
            }

        };
    }

    ready() {
        super.ready();

        this.tutorialId = 'resources';
        this.tutorialTitle = 'Resources';
        this.description = 'Add company applications';
        this.icon = 'icons:list';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360000230491-How-to-add-resources-to-company-';
    }

    connectedCallback() {
        super.connectedCallback();

        this.tutorialId = 'resources';
        this.tutorialTitle = 'Resources';
        this.description = 'Add company applications';
        this.icon = 'icons:list';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360000230491-How-to-add-resources-to-company-';

        afterNextRender(this, function() {
            this.init();
        });
    }

    _readMore() {
        window.open(this.readme, '_blank');
    }

    pageChanged() {
        if(this.page !== 'resources' && this.step === 2) {
            this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).removeAttribute(
                'no-cancel-on-outside-click'
            );
            this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).removeAttribute(
                'no-cancel-on-esc-key'
            );
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
                reference: [ '#menuCompanyResourcesText' ],
                coverTarget: [ '#menuContainer' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step3: {
                reference: [ '#appscoResourcesPageActions', '#appscoApplicationsActions', '#addItemAction' ],
                coverTarget: [ '#appscoResourcesPageActions', '#appscoApplicationsActions', '#addItemAction' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step4: {
                reference: [ '#appscoResourcesPageActions', '#appscoApplicationsActions', '#resourcesActionList > paper-item:nth-child(2)' ],
                coverTarget: [ '#appscoResourcesPageActions', '#appscoApplicationsActions', '#resourcesActionList > paper-item:nth-child(2)' ],
                popperOptions: {
                    placement: 'left-start'
                }
            },
            step5: {
                reference: [ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ],
                coverTarget: [ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ],
                popperOptions: {
                    placement: 'right'
                },
                popperListenerBuilder: function(tutorial) {
                    // attach listener that will stop tutorial if user clicks 'cancel' in add resource dialog
                    const cancelListener = function () {
                        tutorial._querySelector(
                            [
                                '#appscoResourcesPage',
                                '#appscoCompanyApplicationsAdd',
                                '#addApplicationDialog .buttons paper-button[dialog-dismiss]'
                            ]
                        ).removeEventListener('click', cancelListener);
                        tutorial._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).removeAttribute('no-cancel-on-outside-click');
                        tutorial._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).removeAttribute('no-cancel-on-esc-key');
                        tutorial.reset();
                    };
                    tutorial._querySelector(
                        [ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog .buttons paper-button[dialog-dismiss]' ]
                    ).addEventListener('click', cancelListener);
                }
            },
            step6: {
                reference: [ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog #addApplicationAction' ],
                coverTarget: [ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ],
                popperOptions: {
                    placement: 'right'
                },
                popperListenerBuilder: function(tutorial) {
                    let confirmHandler;
                    let confirmListener = function () {
                        tutorial._querySelector(
                            [ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog #addApplicationAction' ]
                        ).addEventListener('click', confirmListener);

                        if (confirmHandler) {
                            return;
                        }

                        confirmHandler = function () {
                            const dialog = tutorial._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]);

                            if (!dialog || dialog.style.display === 'none' || dialog.getAttribute('aria-hidden')) {
                                if (tutorial.step === 6) {
                                    tutorial.nextStep();
                                    return;
                                }

                                tutorial._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).removeAttribute('no-cancel-on-outside-click');
                                tutorial._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).removeAttribute('no-cancel-on-esc-key');
                                tutorial.reset();
                                return;
                            }
                            setTimeout(confirmHandler, 50);
                        };

                        confirmHandler();
                    };
                    confirmHandler = null;

                    tutorial._querySelector(
                        [ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog #addApplicationAction' ]
                    ).addEventListener('click', confirmListener);
                }
            },
            step7: {
                reference: [ '#menuBurger' ],
                coverTarget: [ '#menuBurger' ],
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
                const element = this._querySelector([ '#appscoResourcesPageActions', '#appscoApplicationsActions', '#addItemAction' ]);
                if (!element || this.page !== 'resources' || !this.resourcesPageLoaded) {
                    setTimeout(handleFunction, 200);
                    return;
                }
                setTimeout(function () {
                    this.handleStep(index, item, doneBuildingPopperHandler);
                }.bind(this), 400);

            }.bind(this);
        handleFunction();
    }

    step4(index, item, doneBuildingPopperHandler) {
        setTimeout(function() {
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this), 200);
    }

    step5(index, item, doneBuildingPopperHandler) {
        setTimeout(function() {
            let initialHeight = this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).clientHeight;
            this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).setAttribute(
                'no-cancel-on-outside-click', true
            );
            this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).setAttribute(
                'no-cancel-on-esc-key', true
            );

            this.handleStep(index, item, function() {
                doneBuildingPopperHandler();
                const checkerFunction = function () {
                    const dialog = this._querySelector([ '#appscoResourcesPage','#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]),
                        addButton = this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', ' #addApplicationDialog #addApplicationAction' ]);
                    if (!dialog || dialog.style.display === 'none') {
                        return;
                    }
                    if (addButton && addButton.style.display !== 'none') {
                        this.nextStep();
                        return;
                    }
                    if (dialog.clientHeight !== initialHeight) {
                        this.popperStep[index + 1].cover.destroy();
                        this.popperStep[index + 1].cover = this.buildCover(dialog);
                        this.popperStep[index + 1].cover.show();
                        initialHeight = this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', ' #addApplicationDialog' ]).clientHeight;
                    }
                    setTimeout(checkerFunction, 50);
                }.bind(this);
                checkerFunction();
            }.bind(this));
        }.bind(this), 700);
    }

    step6(index, item, doneBuildingPopperHandler) {
        setTimeout(function() {
            let initialHeight = this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).clientHeight;
            this.handleStep(index, item, function() {
                doneBuildingPopperHandler();
                const checkerFunction = function () {
                    const dialog = this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]);
                    if (!dialog || dialog.style.display === 'none' || index !== 5) {
                        return;
                    }
                    if (dialog.clientHeight !== initialHeight) {
                        this.popperStep[index + 1].cover.destroy();
                        this.popperStep[index + 1].cover = this.buildCover(dialog);
                        this.popperStep[index + 1].cover.show();
                        initialHeight = this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).clientHeight;
                    }
                    setTimeout(checkerFunction, 50);
                }.bind(this);
                checkerFunction();
            }.bind(this));
        }.bind(this), 300);
    }

    start() {
        this.step = 0;
        this.nextStep();
    }

    _nextStep() {
        this.currentStep.reference.click();
    }

    _nextStep3() {
        setTimeout(function() {
            this.currentStep.reference.focus();
            this.currentStep.reference.click();
        }.bind(this), 20);
    }

    _nextStep5(evt) {
        // check if user has
        setTimeout(function() {
            this.currentStep.reference.focus();
            this.currentStep.reference.click();
        }.bind(this), 20);
    }

    afterTutorialDone() {
        this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).removeAttribute(
            'no-cancel-on-outside-click'
        );
        this._querySelector([ '#appscoResourcesPage', '#appscoCompanyApplicationsAdd', '#addApplicationDialog' ]).removeAttribute(
            'no-cancel-on-esc-key'
        );
    }
}
window.customElements.define(AppscoTutorialResources.is, AppscoTutorialResources);
