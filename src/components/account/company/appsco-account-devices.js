import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-account-devices-item.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountDevices extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-account-devices;
            }
            :host .devices {
                @apply --layout-vertical;
                @apply --appsco-devices;
            }
            :host appsco-account-devices-item:first-of-type {
                border-top: none;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host paper-progress {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-list-progress-bar;
            }
            .info-total {
                margin-top: 10px;
            }
            .total {
                @apply --paper-font-caption;
                color: var(--secondary-text-color);
            }

        </style>

        <iron-ajax id="ironAjaxGetDevices" url="[[ devicesApi ]]" on-response="_onDeviceResponse" on-error="_handleError" headers="{{ _headers }}"></iron-ajax>

        <paper-progress id="progress" indeterminate=""></paper-progress>

        <template is="dom-if" if="{{ !preview }}">
            <div class="devices">
                <template is="dom-repeat" items="[[ _uniqueDevices ]]" rendered-item-count="{{ renderedCount }}">
                    <appsco-account-devices-item devices="[[ item ]]" device="[[ item.0 ]]" account="[[ account ]]">
                    </appsco-account-devices-item>
                </template>
            </div>
        </template>

        <template is="dom-if" if="{{ preview }}">
            <p>
                Device and security related activities tied to your account.
                Browse list of devices used to perform activity on AppsCo in the name of [[ account.account.display_name ]]
            </p>
        </template>
        <template is="dom-if" if="{{ _message }}">
            <p class="message">
                [[ _message ]]
            </p>
        </template>

        <div class="info-total">
            <div class="total">
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-account-devices'; }

    static get properties() {
        return {
            DISPLAY_DEVICE_SIZE: {
                type: Number,
                value: 3
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            devicesApi: {
                type: String
            },

            /**
             * Number of devices to load.
             */
            size: {
                type: Number
            },

            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _devices: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true,
                observer: '_devicesChanged'
            },

            _uniqueDevices: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _message: {
                type: String
            },

            _totalDevices: {
                type: Number
            },
        };
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this.dispatchEvent(new CustomEvent('component-attached', { bubbles: true, composed: true }));
        });
    }

    loadDevices() {
        this.$.progress.hidden = false;
        this.set('_devices', []);
        this.set('_uniqueDevices', []);
        this._message = '';
        this._totalDevices = 0;

        this.$.ironAjaxGetDevices.url = this._computeUrl(this.devicesApi);
        this.$.ironAjaxGetDevices.generateRequest();
    }

    approveDevice(device) {
        const _devices = JSON.parse(JSON.stringify(this._devices)),
            _length = _devices.length;

        for (let j = 0; j < _length; j++) {
            if (device.alias === _devices[j].alias) {
                this.splice('_devices', j, 1);
                break;
            }
        }

        this._totalDevices--;
    }

    _devicesChanged() {
        const uniqueDevices = [];
        for(const deviceIndex in this._devices) {
            const device = JSON.parse(JSON.stringify(this._devices[deviceIndex]));
            const key = btoa(device.browser + device.operatingSystem);
            if(!uniqueDevices[key]) {
                uniqueDevices[key] = [];
            }
            if(uniqueDevices[key].length >= this.DISPLAY_DEVICE_SIZE) continue;
            uniqueDevices[key].push(device);
        }
        for(const index in uniqueDevices) {
            uniqueDevices.push(JSON.parse(JSON.stringify(uniqueDevices[index])));
            delete uniqueDevices[index];
        }
        this.set('_uniqueDevices', []);
        this.set('_uniqueDevices', uniqueDevices);
    }

    _computeUrl(devicesApi) {
        return this.size ? devicesApi + '&limit=' + this.size : devicesApi;
    }

    _onDeviceResponse(event) {
        const response = event.detail.response;
        if (!response) {
            return false;
        }
        this._devices = response ? response.devices : [];
        this._totalDevices = response.meta.total;

        if (!this._devices.length) {
            this._message = "Account doesn't have any registered devices.";
        }
        this.$.progress.hidden = true;
    }

    _handleError(event) {
        this._message = 'We couldn\'t load devices at the moment. Please try again in a minute. If error continues contact us.';
        this.$.progress.hidden = true;
    }
}
window.customElements.define(AppscoAccountDevices.is, AppscoAccountDevices);
