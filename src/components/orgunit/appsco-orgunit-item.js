import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoOrgUnitItem extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
            @apply --paper-font-body1;
            @apply --layout-horizontal;
            @apply --layout-justified;
                position: relative;
                width: 100%;
                height: 24px;
                line-height: 24px;
                padding-left: 4px;
                box-sizing: border-box;
                cursor: pointer;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            @apply --appsco-orgunit-item;
            }
            :host([selected]) {
                background-color: #e8e8e8;
            @apply --appsco-orgunit-item-selected;
            }
            :host *[hidden] {
                display: none;
            }
            .orgunit-name {
                max-width: 200px;
                @apply --paper-font-common-nowrap;
                @apply --orgunit-name;
            }
            :host .icon-options {
                opacity: 0;
                transition: opacity 0.1s linear;
            }
            :host(:hover) .icon-options {
                opacity: 1;
                transition: opacity 0.2s linear;
            }
            :host([_show-options]) .icon-options {
                opacity: 1;
            }
            :host .flex {
            @apply --layout-flex;
            }
            :host paper-material {
            @apply --paper-listbox;
            }
            :host .options {
                z-index: 10;
                overflow: auto;
                position: absolute;
                right: 0;
                background-color: white;
                min-width: 150px;
                display: none;
            }
            :host paper-item {
                border-bottom: 1px solid rgba(0,0,0, 0.1);
            @apply --paper-font-caption;
                min-height: 32px;
            }
            :host paper-item:last-child {
                border-bottom: 0;
            }
            :host paper-item:hover {
            @apply --paper-item-hover;
            }
        </style>

        <div class="orgunit-name flex" alt="[[ orgUnit.name ]]" on-tap="_organizationUnitTapped">
            [[ orgUnit.name ]]
        </div>

        <div>
            <iron-icon id="iconOptions" class="icon-options" icon="icons:more-vert" on-tap="_toggleOptions"></iron-icon>
            <paper-material id="options" class="options">
                <paper-item on-tap="_modify" hidden\$="[[ !modify ]]">Modify</paper-item>
                <paper-item on-tap="_add" hidden\$="[[ !add ]]">Add sub organization</paper-item>
                <paper-item on-tap="_remove" hidden\$="[[ !remove ]]">Remove</paper-item>
            </paper-material>
        </div>
`;
    }

    static get is() { return 'appsco-orgunit-item'; }

    static get properties() {
        return {
            /**
             * [OrgUnit]() that is to be rendered
             */
            orgUnit: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            modify: {
                type: Boolean,
                value: false
            },

            add: {
                type: Boolean,
                value: false
            },

            remove: {
                type: Boolean,
                value: false
            },

            selected: {
                type: Boolean,
                computed: '_computeSelected(orgUnit.*)',
                reflectToAttribute: true
            },

            _showOptions: {
                type: Boolean,
                value: false,
                reflectToAttribute: true,
                observer: '_onShowOptionsChange'
            },

            animationConfig: {
                value: function () {
                    return {

                    }
                }
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'scale-up-animation',
                node: this.$.options,
                transformOrigin: '0 0',
                axis: 'y',
                timing: {
                    duration: 200
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this.$.options,
                timing: {
                    duration: 100
                }
            }
        };

        afterNextRender(this, function () {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onAnimationFinish);
        gestures.add(document, 'tap', this._handleDocumentClick.bind(this));
    }

    /**
     * Evaluates if item is in given path.
     *
     * @param {HTMLElement} element The element to be evaluated.
     * @param {Array<HTMLElement>=} path Elements in path to be checked against item element.
     * @return {Boolean}
     *
     * @private
     */
    _isInPath(path, element) {
        path = path || [];

        for (let i = 0; i < path.length; i++) {
            if (path[i] == element) {
                return true;
            }
        }

        return false;
    }

    /**
     * Listens for click outside.
     * @private
     */
    _handleDocumentClick(event) {
        const path = dom(event).path;

        if (!this._isInPath(path, this.$.iconOptions) && !this._isInPath(path, this.$.options)) {
            this._hideOptions();
        }

    }

    _computeSelected(change) {
        return this.orgUnit && this.orgUnit.selected;
    }

    _onShowOptionsChange() {
        this._animateOptions();
    }

    _hideOptions() {
        this._showOptions = false;
    }

    _animateOptions() {
        if (this._showOptions) {
            this.$.options.style.display = 'block';
            this.playAnimation('entry');
        }
        else {
            this.playAnimation('exit');
        }

    }

    _toggleOptions() {
        this._showOptions = !this._showOptions;
    }

    _modify() {
        this._hideOptions();
        this.dispatchEvent(new CustomEvent('modify-orgunit', {
            bubbles: true,
            composed: true,
            detail: {
                orgUnit: this.orgUnit
            }
        }));
    }

    _add() {
        this._hideOptions();
        this.dispatchEvent(new CustomEvent('add-orgunit', {
            bubbles: true,
            composed: true,
            detail: {
                orgUnit: this.orgUnit
            }
        }));
    }

    _remove() {
        this._hideOptions();
        this.dispatchEvent(new CustomEvent('remove-orgunit', {
            bubbles: true,
            composed: true,
            detail: {
                orgUnit: this.orgUnit
            }
        }));
    }

    _organizationUnitTapped() {
        this.dispatchEvent(new CustomEvent('selected', {
            bubbles: true,
            composed: true,
            detail: {
                orgUnit: this.orgUnit,
                selected: !this.selected
            }
        }));
    }

    _onAnimationFinish() {
        if (!this._showOptions) {
            this.$.options.style.display = 'none';
        }
    }

    deSelect() {
        this.selected = false;
    }
}
window.customElements.define(AppscoOrgUnitItem.is, AppscoOrgUnitItem);
