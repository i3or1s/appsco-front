import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-request.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoRoleSaveClientData extends mixinBehaviors([NeonAnimationRunnerBehavior, Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
                @apply --appsco-role-save-client-data;
            }
        </style>
`;
    }

    static get is() { return 'appsco-role-save-client-data'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            delay: {
                type: Number,
                value: 0
            },

            saveApi: {
                type: String
            },

            _device: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _deviceInfoSent: {
                type: Boolean,
                value: false
            },

            _requestReady: {
                type: Boolean,
                computed: '_computeRequestReadyState(account, saveApi, _headers)',
                observer: '_readyStateChanged'
            }
        };
    }

    _computeRequestReadyState(account, saveApi, headers) {
        for (const key in account) {
            return (saveApi && headers);
        }

        return false;
    }

    _readyStateChanged(state) {
        if (state && !this._deviceInfoSent) {
            setTimeout(this._sendClientData.bind(this), this.delay);
        }
    }

    _sendClientData() {
        this._deviceInfoSent = true;
        const client = new ClientJS(),
            request = document.createElement('iron-request'),
            options = {
                url: this.saveApi,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            },
            accountName = this.account.name ? this.account.name : '',
            unavailable = 'unavailable'
        ;

        let fingerprint = client.getCustomFingerprint([
            client.getUserAgent(),
            client.getScreenPrint(),
            client.getPlugins(),
            client.isLocalStorage(),
            client.isSessionStorage(),
            client.getTimeZone(),
            client.getLanguage(),
            client.getSystemLanguage(),
            client.isCookie(),
            client.getCanvasPrint()
        ]);

        options.body = ('byod[name]=' + encodeURIComponent(fingerprint ?
            (accountName + ' ' + fingerprint) : accountName)) +
            '&byod[device]=' + (client.getDevice() ? encodeURIComponent(client.getDevice()) : unavailable) +
            '&byod[device_type]=' + encodeURIComponent(client.getDeviceType() ? client.getDeviceType() : 'desktop') +
            '&byod[device_vendor]=' + (client.getDeviceVendor() ? encodeURIComponent(client.getDeviceVendor()) : unavailable) +
            '&byod[user_agent]=' + (client.getUserAgent() ? encodeURIComponent(client.getUserAgent()) : unavailable) +
            '&byod[browser]=' + (client.getBrowser() ? encodeURIComponent(client.getBrowser()) : unavailable) +
            '&byod[browser_version]=' + (client.getBrowserVersion() ? encodeURIComponent(client.getBrowserVersion()) : unavailable) +
            '&byod[browser_fingerprint]=' + (fingerprint ? encodeURIComponent(fingerprint) : unavailable) +
            '&byod[operating_system]=' + (client.getOS() ? encodeURIComponent(client.getOS()) : unavailable) +
            '&byod[operating_system_version]=' + (client.getOSVersion() ? encodeURIComponent(client.getOSVersion()) : unavailable);

        request.send(options).then(function () {
            if (200 === request.status) {
                this.set('_device', request.response);
            }
        }.bind(this));
    }
}
window.customElements.define(AppscoRoleSaveClientData.is, AppscoRoleSaveClientData);
