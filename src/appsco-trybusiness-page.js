import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-styles/shadow.js';
import './components/page/appsco-content.js';
import './components/components/appsco-loader.js';
import './upgrade/appsco-upgrade-page-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoTrybusinessPage extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                --content-color: var(--primary-text-color);
                --info-width: 320px;
            }
            .text-center {
                text-align: center;
            }
            :host .box {
                @apply --shadow-elevation-2dp;
                background-color: #ffffff;
                padding: 30px 10px;
                margin-right: 40px;
            }
            :host .box:last-child {
                margin-right: 0 !important;
            }
            :host .box-icon {
                height: 96px;
            }
            :host .box hr {
                width: 100%;
                height: 1px;
                margin: 4px 0;
                border: none;
                background-color: var(--divider-color);
            }
            :host .box-title {
                text-align: center;
            }
            :host .box-list {
                width: 100%;
                padding-left: 40px;
                margin-top: 20px;
                margin-bottom: 10px;
                font-size: 16px;
                box-sizing: border-box;
            }
            :host .box-list .box-list {
                list-style-type: disc;
                margin-top: 5px;
                margin-bottom: 5px;
            }
            :host .box-list li {
                margin-bottom: 4px;
            }
            :host .upgrade-pricing {
                width: 100%;
                height: 100%;
                overflow-x: hidden;
                overflow-y: auto;
            }
            :host div[info] {
                height: 100%;
                color: var(--primary-text-color);
                box-sizing: border-box;
            }
            :host .upgrade-header {
                padding: 100px 20px;
                color: #ffffff;
                background: url('../images/upgrade-header-background.jpg') no-repeat;
                background-size: cover;
            }
            :host .upgrade-header .title {
                width: 50%;
                font-size: 24px;
                margin-top: 50px;
                margin-bottom: 50px;
            }
            :host .upgrade-header .content {
                font-size: 16px;
                margin-top: 0;
                margin-bottom: 0;
            }
            :host .upgrade-content {
                padding: 50px 80px;
            }
            :host .pricing-plans {
                color: #ffffff;
            }
            :host .pricing-plans, :host .pricing-header, :host .pricing {
                width: 100%;
            }
            :host .pricing-header {
                padding: 22px 10px 30px;
                background-color: var(--app-primary-color-1);
            }
            :host .pricing-header .title {
                margin: 0;
                font-size: 24px;
            }
            :host .pricing-header .content {
                margin-top: 0;
                font-size: 14px;
                text-transform: uppercase;
            }
            :host .pricing {
                background-color: var(--app-primary-color);
                position: relative;
            }
            :host .pricing-plan {
                padding: 60px 10px 34px;
                position: relative;
            }
            :host .price {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background-color: var(--app-secondary-color-1);
                font-size: 32px;
                font-weight: bold;
                letter-spacing: -2px;
                line-height: 80px;
                text-align: center;
                position: absolute;
                top: -24px;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                box-sizing: border-box;
            }
            :host .price-currency {
                font-size: 20px;
                position: absolute;
                top: 3px;
            }
            :host .annual .price {
                padding-left: 6px;
            }
            :host .annual .price-currency {
                left: 22px;
            }
            :host .monthly .price {
                padding-left: 12px;
            }
            :host .monthly .price-currency {
                left: 14px;
            }
            :host .pricing-plan .title {
                font-size: 20px;
                text-transform: uppercase;
            }
            :host .pricing-plan p {
                margin: 0;
            }
            :host .content-monthly {
                font-size: 14px;
                opacity: 0.8;
            }
            :host .content-annually {
                font-size: 14px;
            }
            :host .upgrade-info {
                margin: 30px 0;
                color: #279fbc;
                text-align: center;
            }
            :host .upgrade-info p {
                margin: 0;
            }
            :host .upgrade-info .info {
                font-size: 18px;
            }
            :host .upgrade-info .info-emphasize {
                font-size: 22px;
                font-weight: 500;
                text-transform: uppercase;
            }
            :host .info-actions {
                padding: 0;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
            }
            :host .upgrade-button {
                @apply --primary-button;
                border-radius: 0;
                font-size: 20px;
                font-weight: 500;
                padding: 14px 10px;
                background-color: var(--app-secondary-color-1);
            }
            :host .flex-horizontal {
                @apply --layout-horizontal;
            }
            :host .flex-vertical {
                @apply --layout-vertical;
                @apply --layout-center;
            }
            :host .flex {
                @apply --layout-flex;
            }
            :host([s1600-screen]) .upgrade-header {
                padding-top: 60px;
                padding-bottom: 60px;
            }
            :host([tablet-s1280-screen]) .upgrade-content {
                padding-left: 50px;
                padding-right: 50px;
            }
            :host([tablet-s1280-screen]) .box {
                margin-right: 25px;
            }
            :host([tablet-s1280-screen]) .upgrade-header {
                padding: 20px;
            }
            :host([tablet-s1280-screen]) .upgrade-header .title {
                width: 100%;
                margin-top: 20px;
            }
            :host([tablet-s1024-screen]) .upgrade-content {
                padding-left: 20px;
                padding-right: 20px;
            }
            :host([tablet-s1024-screen]) .box {
                margin-right: 20px;
            }
            :host([tablet-s920-screen]) .upgrade-content {
                @apply --layout-vertical;
                @apply --layout-center;
            }
            :host([tablet-s920-screen]) .box {
                margin-right: 0;
                margin-bottom: 20px;
            }
            :host([tablet-s920-screen]) .box {
                @apply --layout-flex-none;
                width: 64%;
                margin-right: 0;
                margin-bottom: 20px;
                box-sizing: border-box;
            }
            :host([tablet-s768-screen]) .box {
                width: 100%;
            }
            :host([mobile-screen]) {
                --info-width: 100%;
            }
            :host([mobile-screen-height]) .info-actions {
                position: relative;
            }

        </style>

        <iron-media-query query="(max-width: 1600px)" query-matches="{{ s1600Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1440px)" query-matches="{{ laptopS1440Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1280px)" query-matches="{{ tabletS1280Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1024px)" query-matches="{{ tabletS1024Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 920px)" query-matches="{{ tabletS920Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 768px)" query-matches="{{ tabletS768Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>
        <iron-media-query query="(max-height: 600px)" query-matches="{{ mobileScreenHeight }}"></iron-media-query>

        <appsco-content id="appscoContent">

            <div content="" slot="content">

                <div class="upgrade-header flex-vertical">
                    <img src="images/appsco-logo-business.png" alt="Appsco Business">

                    <h1 class="title text-center">
                        Connect and manage users, apps and directories <br> simply and securely
                    </h1>

                    <p class="content text-center">
                        Centralized control and management of user access to company resources <br>
                        with meaningful insights and reports and compliance with company policies
                    </p>
                </div>

                <div class="upgrade-content flex-horizontal">
                    <div class="box flex-vertical flex">
                        <img src="images/try-business/increase-productivity-icon.png" alt="Increase Productivity" class="box-icon">
                        <h2 class="box-title">Increase Productivity</h2>
                        <hr>
                        <ul class="box-list">
                            <li>SSO to apps</li>
                            <li>Universal Cloud Directory</li>
                            <li>Provisioning of users/groups</li>
                            <li>Easy sharing of apps/resources both internally and externally</li>
                            <li>User/group access management to apps/resources</li>
                            <li>Insights</li>
                        </ul>
                    </div>
                    <div class="box flex-vertical flex">
                        <img src="images/try-business/improve-security-icon.png" alt="Improve Security" class="box-icon">
                        <h2 class="box-title">Improve Security</h2>
                        <hr>
                        <ul class="box-list">
                            <li>Secure Announcements</li>
                            <li>Device Management</li>
                            <li>
                                Security Policies
                                <ul class="box-list">
                                    <li>Enforce 2FA</li>
                                    <li>IP whitelist</li>
                                    <li>Block TOR</li>
                                    <li>Mobile logins</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="box flex-vertical flex">
                        <img src="images/try-business/ensure-compliance-icon.png" alt="Ensure Compliance" class="box-icon">
                        <h2 class="box-title">Ensure Compliance</h2>
                        <hr>
                        <ul class="box-list">
                            <li>Cloud governance</li>
                            <li>Audit logs</li>
                            <li>
                                Reports
                                <ul class="box-list">
                                    <li>Access</li>
                                    <li>Data discovery</li>
                                    <li>Policy enforcement</li>
                                </ul>
                            </li>
                            <li>Statistics</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">

                <appsco-loader alt="Appsco is processing request" active="[[ _loader ]]" multi-color=""></appsco-loader>

                <div class="upgrade-pricing">
                    <div class="pricing-plans flex-vertical">
                        <div class="pricing-header text-center">
                            <h2 class="title">AppsCo Business</h2>
                            <p class="content">pricing plans</p>
                        </div>

                        <div class="pricing flex-horizontal">
                            <div class="pricing-plan annual flex-vertical flex">
                            <span class="price">
                                <span class="price-currency">\$</span>
                                2
                            </span>

                                <h2 class="title">Annually</h2>
                                <p class="content-monthly">\$2 per user / month</p>
                                <p class="content-annually">\$24 billed annually</p>
                            </div>

                            <div class="pricing-plan monthly flex-vertical flex">
                            <span class="price">
                                <span class="price-currency">\$</span>
                                2.5
                            </span>

                                <h2 class="title">Monthly</h2>
                                <p class="content-monthly">\$2.5 per user / month</p>
                                <p class="content-annually">billed monthly</p>
                            </div>
                        </div>
                    </div>

                    <div class="upgrade-info">
                        <p class="info">First month</p>
                        <p class="info-emphasize">Free</p>
                    </div>

                    <div class="info-actions flex-horizontal">
                        <paper-button class="upgrade-button flex" on-tap="_upgradeToBusiness">Try AppsCo Business</paper-button>
                    </div>
                </div>
            </div>

        </appsco-content>
`;
    }

    static get is() { return 'appsco-trybusiness-page'; }

    static get properties() {
        return {
            companyUpgradeApi: {
                type: String
            },

            _loader: {
                type: Boolean,
                value: false
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mobileScreenHeight: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletS768Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletS920Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletS1024Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletS1280Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            laptopS1440Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            s1600Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, mobileScreenHeight, tabletS768Screen, tabletS920Screen, tabletS1024Screen, tabletS1280Screen, laptopS1440Screen, s1600Screen)'
        ];
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };

        beforeNextRender(this, function() {
            if (this.mobileScreen || this.mobileScreenHeight || this.tabletS768Screen || this.tabletS920Screen
                || this.tabletS1024Screen || this.tabletS1280Screen || this.laptopS1440Screen || this.s1600Screen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this.$.appscoContent.showSection('info');

            this._onPageLoaded();
        });
    }

    _updateScreen(mobile, mobileScreenHeight, tabletS768Screen) {
        this.updateStyles();

        if (!mobile && !tabletS768Screen && !this.$.appscoContent.infoActive) {
            this.$.appscoContent.showSection('info');
        }
    }

    togglePricing() {
        this.$.appscoContent.toggleSection('info');
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _upgradeToBusiness() {
        var request = document.createElement('iron-request'),
            options = {
                url: this.companyUpgradeApi,
                method: 'POST',
                body: "",
                handleAs: 'json',
                headers: {
                    'Authorization': 'token ' + this.authorizationToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

        this._showLoader();

        request.send(options).then(function() {
            if (request.succeeded) {
                this.dispatchEvent(new CustomEvent('upgraded', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        account: request.response.account
                    }
                }));
            }
            this._hideLoader();
        }.bind(this), function() {
            this.dispatchEvent(new CustomEvent('upgrade-failed', {
                bubbles: true,
                composed: true,
                detail: {
                    error: request.response.code
                }
            }));
            this._hideLoader();
        }.bind(this));
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoTrybusinessPage.is, AppscoTrybusinessPage);
