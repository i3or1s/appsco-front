import '@polymer/polymer/polymer-legacy.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import Popper from "popper.js";

/**
 * @polymerBehavior Polymer.AppscoTutorialBehaviour
 */
export const AppscoTutorialBehaviour = {
    properties: {
        status: {
            type: String,
            default: 'PENDING',
            observer: '_enumStatus'
        },

        step: {
            type: Number,
            value: 0,
            notify: true,
            observer: "_stepChanged"
        },

        maxSteps: {
            type: Number,
            value: 0
        },

        name: {
            type: String,
            value: 'anon'
        },

        currentStep: {
            type: Object,
            value: function() { return {}; },
            observer: '_currentStepChanged'
        },

        popperStep: {
            type: Object,
            value: function() { return {}; }
        },

        tutorialId: {
            type: String,
            value: 'anon'
        },

        addedListeners: {
            type: Array,
            value: function() { return []; }
        },

        startedInSession: {
            type: Boolean,
            value: false
        }
    },

    init: function() {
        this.maxSteps = dom(this.root).querySelectorAll('.step').length;
    },

    _buildPopperStep: function(doneBuildingPopperHandler){
        dom(this.root).querySelectorAll('.step').forEach(function(item, index){
            if(this.step !== index+1) return;

            if(typeof this['step'+(index+1)] === "function") {
                this['step'+(index+1)](index, item, doneBuildingPopperHandler);
                doneBuildingPopperHandler();
                // Post step fire
                if(typeof this['postStep'+(index+1)] === "function") {
                    this['postStep'+(index+1)]();
                }
            } else {
                this.handleStep(index, item, doneBuildingPopperHandler);
            }
        }.bind(this));
    },

    handleStep: function(index, item, doneBuildingPopperHandler) {
        const popperConfig = this.getPopperConfig();
        const options = popperConfig['step' + (index + 1)];
        if(options) {
            const interval = setInterval(function () {
                if (this._querySelector(options.coverTarget) &&
                    this._querySelector(options.reference)
                ) {
                    clearInterval(interval);
                    this._createPopper(index + 1, item, options);
                    doneBuildingPopperHandler();
                    // Post step fire
                    if (typeof this['postStep' + (index + 1)] === "function") {
                        this['postStep' + (index + 1)]();
                    }
                }
            }.bind(this), 200);
        }
    },

    step2: function(index, item, doneBuildingPopperHandler) {
        this.handleStep(index, item, doneBuildingPopperHandler);
        setTimeout(function(){
            // Is firefox
            if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                this.popperStep[index + 1].popper.popper.style.left = "200px";
            }
        }.bind(this), 300);
    },


    _createPopper: function(index, elem, options) {
        const cover = this.buildCover(this._querySelector(options.coverTarget), function () {
            this.reset();
        }.bind(this));
        Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;
        this.popperStep[index] = {
            popper: new Popper(this._querySelector(options.reference), elem, options.popperOptions),
            cover: cover,
            elem: elem,
            options: options,
            reference: this._querySelector(options.reference)
        };
        if (options.popperListenerBuilder && typeof(options.popperListenerBuilder) === 'function') {
            options.popperListenerBuilder(this);
            return;
        }
        const me = this,
            listener = function () {
                me.nextStep();
                me._querySelector(options.reference).removeEventListener('click', listener);
            };
        this._querySelector(options.reference).addEventListener('click', listener);
        this.registerAddedListener(this._querySelector(options.reference), 'click', listener);
    },

    _stepChanged: function(newValue, oldValue) {
        this.dispatchEvent(new CustomEvent('tutorial-step-changed', {
            bubbles: true,
            composed: true,
            detail: {
                id: this.id,
                step: newValue
            }
        }));
        this._buildPopperStep(function(){
            if(this.popperStep && this.popperStep[newValue]) {
                this.currentStep = this.popperStep[newValue];
            }
        }.bind(this));
    },

    _currentStepChanged: function() {
        if(this.step > 0) {
            this.showStep();
        }
    },

    _enumStatus: function(newValue, oldValue) {
        if(['PENDING', 'IN_PROGRESS', 'DONE'].indexOf(newValue) === -1) {
            this.status = oldValue;
        }
        if(this.status === 'DONE' && this.startedInSession) {
            if (typeof(this.afterTutorialDone) === 'function') {
                this.afterTutorialDone();
            }

            this.dispatchEvent(new CustomEvent('tutorial-done', {
                bubbles: true,
                composed: true,
                detail: {
                    tutorial: this
                }
            }));
        }
    },

    getPopperConfig: function() {
        return {};
    },

    incrementStep: function() {
        if(this.maxSteps === this.step) {
            return;
        }
        if(this.step > 0 ) {
            this.status = 'IN_PROGRESS';
        }
        this.step++;
    },

    nextStep: function() {
        if(this.step < this.maxSteps) {
            this.hideStep();
            this.incrementStep();
        } else {
            this.reset();
        }
    },

    showStep: function(){
        if(this.currentStep) {
            this.startedInSession = true;
            this.currentStep.elem.hidden = false;
            this.currentStep.cover.show();
        }
    },

    hideStep: function() {
        if(this.step > 0 && this.step <= this.maxSteps) {
            this.currentStep.elem.hidden = true;
            this.currentStep.cover.destroy();
            this.currentStep.popper.destroy();
        }
    },

    reset: function(){
        for(const index in this.popperStep) {
            if(this.popperStep.hasOwnProperty(index)) {
                this.popperStep[index].elem.hidden = true;
                this.popperStep[index].cover.destroy();
                this.popperStep[index].popper.destroy();
            }
        }
        this.set('popperStep', {});
        this.addedListeners.forEach(function(listenerInfo) {
            if (listenerInfo.element) {
                listenerInfo.element.removeEventListener(listenerInfo.eventName, listenerInfo.listener);
            }
        });
        if(this.step === this.maxSteps) {
            this.status = 'DONE';
        }
        this.step = 0;
    },

    getId: function() {
        return this.tutorialId;
    },

    isDone: function() {
        return this.status === 'DONE';
    },

    registerAddedListener: function(element, eventName, listener) {
        this.addedListeners.push({
            element: element,
            listener: listener,
            eventName: eventName
        });
    },

    _querySelector: function(selectors) {
        if (!Array.isArray(selectors)) {
            return document.querySelector(selectors);
        }
        let element = document.querySelector('appsco-app');
        for (let x = 0; x < selectors.length; x++) {
            if (!element.shadowRoot) {
                return null;
            }
            element = element.shadowRoot.querySelector(selectors[x]);
            if (null === element) {
                return null;
            }
        }
        return element;
    }
};
