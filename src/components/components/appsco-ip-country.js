import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-request.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIPCountry extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
            }
        </style>
        [[ _country ]]
`;
    }

    static get is() { return 'appsco-ip-country'; }

    static get properties() {
        return {
            ip: {
                type: String,
                value: function () {
                    return '';
                },
                observer: "_calculateCountry"
            },

            _country: {
                type: String
            },

            _cache: {
                type: Array,
                value: []
            }
        };
    }

    ready() {
        super.ready();

        if(this._isLocalStorageSupported()) {
            this._cache = JSON.parse(this._getStoredValue('appsco-ip-country-cache'));
        }
    }

    /**
     * @private
     */
    _calculateCountry() {
        if(this._cache && this._cache[this.ip]) {
            this._country = this._cache[this.ip];
            return;
        }
        const request = document.createElement('iron-request'),
            options = {
                url: 'https://appsco.com/public/geoip?ip=' + this.ip,
                method: 'GET',
                handleAs: 'json'
            };

        request.send(options).then(function() {
            if (200 === parseInt(request.status)) {
                this._country = request.response.geoplugin_countryName;
                this._cache[this.ip] = this._country;
                if(this._isLocalStorageSupported()) {
                    const _cache = JSON.parse(this._getStoredValue('appsco-ip-country-cache'));
                    if(!_cache[this.ip]) {
                        _cache[this.ip] = this._country;
                        this._storeValue('appsco-ip-country-cache', JSON.stringify(_cache));
                    }
                }
            }

        }.bind(this));
    }

    _isLocalStorageSupported () {
        return window.localStorage
            && typeof(window.localStorage.setItem) === 'function'
            && typeof(window.localStorage.getItem) === 'function'
            && typeof(window.localStorage.removeItem) === 'function';
    }

    _storeValue(key, value) {
        if (this._isLocalStorageSupported()) {
            window.localStorage.setItem(key, value);
        } else {
            const secure_cookie = Boolean(Number(this.cookieSecure)) === true ? ';secure' : '';
            document.cookie = key + '=' + value + secure_cookie;
        }
    }

    _getStoredValue(key) {
        return this._isLocalStorageSupported() ? window.localStorage.getItem(key) : this._getCookie(key);
    }
}
window.customElements.define(AppscoIPCountry.is, AppscoIPCountry);
