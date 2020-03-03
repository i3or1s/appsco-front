import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/image-icons.js';
import '@polymer/iron-icons/av-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountLogItem extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: none;
                padding: 20px 16px 10px 6px;
                border-top: 1px solid var(--divider-color);
                line-height: 1.4;
                position: relative;

            @apply --account-log-item;
            }
            :host .item {
            @apply --layout-horizontal;
            @apply --layout-center;
            @apply --log-item;
            }
            :host .item-container {
                overflow: hidden;
            @apply --layout-vertical;
            @apply --layout-flex;
            }
            :host .basic-info {
            @apply --layout-horizontal;
            @apply --layout-center;
            }
            :host .additional-info {
                margin-top: 10px;
                font-size: 12px;
                opacity: 0.8;
            @apply --layout-vertical;
            @apply --log-item-additional-info;
            }
            :host .item-image {
                width: 32px;
                height: 32px;
                margin-right: 10px;
            @apply --layout-flex-none;
            @apply --log-item-image;
            }
            :host .item-image::shadow #sizedImgDiv {
            @apply --log-item-image-contain;
            }
            :host .item-icon {
                width: 28px;
                height: 28px;
                margin-left: 2px;
                margin-right: 12px;
            @apply --layout-flex-none;
            @apply --log-item-icon;
            }
            :host .item-date {
                font-size: 11px;
                position: absolute;
                top: 5px;
                right: 6px;
                opacity: 0.5;
            @apply --log-item-date;
            }
            :host .item-message {
                @apply --text-wrap-break;
            @apply --log-item-message;
            }
            :host([short-view]) .additional-info {
                display: none;
            }
        </style>

        <div class="item">
            <div class="item-date">[[ _dateFormat(item.date) ]]</div>

            <div class="item-container">
                <div class="basic-info">

                    <template is="dom-if" if="[[ item.image ]]">
                        <iron-image src="[[ item.image ]]" sizing="contain" class="item-image"></iron-image>
                    </template>

                    <template is="dom-if" if="[[ item.icon ]]">
                        <iron-icon icon="[[ item.icon ]]" class="item-icon"></iron-icon>
                    </template>

                    <template is="dom-if" if="[[ _useDefaultIcon ]]">
                        <iron-icon icon="list" class="item-icon"></iron-icon>
                    </template>

                    <div class="item-message">[[ item.message ]]</div>
                </div>

                <div class="additional-info">
                    IP address: [[ item.address ]]
                </div>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-account-log-item'; }

    static get properties() {
        return {
            item: {
                type: Object
            },

            shortView: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _useDefaultIcon: {
                type: Boolean,
                computed: '_shouldUseDefaultIcon(item)'
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 200
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 100
                }
            }
        };
        beforeNextRender(this, function() {
            this.style.display = 'block';
        });

        afterNextRender(this, function() {
            this.playAnimation('entry');
        });
    }

    _dateFormat(value) {
        if (value) {
            const options = {
                weekday: "long", year: "numeric", month: "short",
                day: "numeric", hour: "2-digit", minute: "2-digit"
            };

            return (new Date(value)).toLocaleDateString('en', options);
        }
    }

    _shouldUseDefaultIcon(item) {
        return !item.image && !item.icon;
    }
}
window.customElements.define(AppscoAccountLogItem.is, AppscoAccountLogItem);
