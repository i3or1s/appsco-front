import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '../../components/appsco-list-item-styles.js';
import '../../components/appsco-date-format.js';
import '../../components/appsco-ip-country.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountDevicesItem extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                padding-bottom: 10px;
            }
            :host .item {
                cursor: default;
                height: 100px;
            }
            :host .item-info {
                padding: 0;
                @apply --layout-horizontal;
                width: 100%;
                align-items: center;
            }
            :host .info-additional {
                font-size: 12px;
                opacity: 0.8;
                width: 500px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .browser-hash {
                font-size: 11px;
                position: absolute;
                top: 5px;
                right: 6px;
                opacity: 0.5;
            }
            :host .item-title {
                padding-bottom: 5px;
            }
            .value {
                font-weight: bold;
            }
            .resources-container {
                padding: 20px;
                @apply --layout-vertical;
                @apply --layout-center;
                background-color: var(--collapsible-content-background-color);
            }
            .resource-list {
                width: 100%;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-wrap;
            }
            .full-width {
                width: 100%;
            }
            table > thead > tr > td {
                font-weight: 700;
                font-size: 16px;
            }
            table > tbody > tr > td {
                border-top: 1px dashed var(--header-background-color);
            }
            .icon-container {
                margin-left: 10px;
            }
            .icon-container, .icon {
                height: 80px;
            }
            .icon {
                margin-right: 20px;
            }
        </style>

        <div class="item">
            <div class="browser-hash">Browser fingerprint: [[ device.browserFingerprint ]]</div>

            <div class="item-info item-basic-info resource-list">
                <div class="icon-container">
                    <img src="[[ _deviceImg ]]" alt="[[ _deviceName ]]" class="icon">
                </div>
                <div>
                    <span class="info-label item-title">[[ _deviceName ]]</span>
                    <template is="dom-if" if="[[ _isADevice ]]">
                        <div class="info-additional">
                            Device: <span class="value">[[ device.device ]]</span>
                            Device vendor: <span class="value">[[ device.vendor ]]</span>
                        </div>
                    </template>
                    <template is="dom-if" if="[[ _showTrustedIPs ]]">
                        <div class="info-additional">
                            2FA trusted IP list: <span class="value">[[ device.trustedIpList ]]</span>
                        </div>
                    </template>

                    <div class="info-additional">
                        Browser: <span class="value">[[ device.browser ]]</span>
                        Browser version: <span class="value">[[ device.browserVersion ]]</span>
                    </div>
                    <div class="info-additional">
                        Operating system: <span class="value">[[ device.operatingSystem ]]</span>
                    </div>
                </div>
            </div>

            <div class="actions">
                <template is="dom-if" if="[[ !_approved ]]">
                    <paper-button on-tap="_onApproveAction">Approve</paper-button>
                </template>

                <template is="dom-if" if="[[ _approved ]]">
                    <paper-button on-tap="_onDisapproveAction">Disapprove</paper-button>
                </template>

                <paper-button on-tap="_onShowResources" hidden\$="[[ _resourcesVisible ]]">Show</paper-button>
                <paper-button on-tap="_onHideResources" hidden\$="[[ !_resourcesVisible ]]">Hide</paper-button>
            </div>
        </div>

        <iron-collapse id="resources">
            <div class="resources-container">
                <div class="resource-list">
                    <table class="full-width">
                        <thead>
                            <tr>
                                <td>Browser</td>
                                <td>Last login</td>
                                <td>Location</td>
                                <td>IP-address</td>
                            </tr>
                        </thead>
                        <tbody>
                        <template is="dom-repeat" items="[[ devices ]]" rendered-item-count="{{ renderedCount }}">
                            <tr>
                                <td>[[ item.browser ]]</td>
                                <td><appsco-date-format date="[[ item.lastLogin.date ]]" options="[[ dateOptions ]]"></appsco-date-format></td>
                                <td><appsco-ip-country ip="[[ item.ipList.0 ]]"></appsco-ip-country></td>
                                <td>[[ item.ipList.0 ]]</td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </iron-collapse>
`;
    }

    static get is() { return 'appsco-account-devices-item'; }

    static get properties() {
        return {
            device: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            devices: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _deviceName: {
                type: String,
                computed: "_computeDeviceName(device)"
            },

            _deviceImg: {
                type: String,
                computed: "_computeDeviceImg(device)"
            },

            _isADevice: {
                type: Boolean,
                computed: "_computeIsADevice(device)"
            },

            dateOptions: {
                type: Object,
                value: {year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric"}
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _resourcesVisible: {
                type: Boolean,
                value: false
            },

            _approved: {
                type: Boolean,
                computed: '_computeApproved(device)'
            },

            _showTrustedIPs: {
                type: Boolean,
                computed: '_computeShowTrustedIPs(device)'
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

    _computeApproved(device) {
        return device.approved;
    }

    _computeShowTrustedIPs(device) {
        return device && device.trustedIpList && device.trustedIpList.length > 0;
    }

    _computeIsADevice(device) {
        return device.vendor !== "unavailable";
    }

    _computeDeviceName(device) {
        if(this._computeIsADevice(device)) {
            return device.browser + " on " + device.vendor + " " + device.device;
        }

        return device.browser + " on " + device.operatingSystem;
    }

    _computeDeviceImg(device) {
        if (this._computeIsADevice(device)) {
            // It is a mobile
            if ('android' === device.operatingSystem.toLowerCase())
                return '/images/devices/mobile-android.png';
            if ('windows' === device.operatingSystem.toLowerCase())
                return '/images/devices/mobile-windows.png';
            return '/images/devices/mobile-ios.png';
        }
        else {
            // It is a desktop
            if ('windows' === device.operatingSystem.toLowerCase())
                return '/images/devices/desktop-windows.png';
            if ('mac' === device.operatingSystem.toLowerCase())
                return '/images/devices/desktop-mac.png';
            if ('linux' === device.operatingSystem.toLowerCase())
                return '/images/devices/desktop-linux.png';
            return '/images/devices/desktop-windows.png';
        }
    }

    _onApproveAction(event) {
        this.device.approved = true;
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('approve-device', {
            bubbles: true,
            composed: true,
            detail: {
                device: this.device,
                account: this.account
            }
        }));
    }

    _onDisapproveAction(event) {
        this.device.approved = false;
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('disapprove-device', {
            bubbles: true,
            composed: true,
            detail: {
                device: this.device,
                account: this.account
            }
        }));
    }

    _onShowResources() {
        this.$.resources.show();
        this._resourcesVisible = true;
    }

    _onHideResources() {
        this.$.resources.hide();
        this._resourcesVisible = false;
    }
}
window.customElements.define(AppscoAccountDevicesItem.is, AppscoAccountDevicesItem);
