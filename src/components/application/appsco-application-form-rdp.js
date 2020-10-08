import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import { AppscoApplicationFormBehavior } from './appsco-application-form-behavior.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationFormRdp extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
    static get template() {
        return html`
        <paper-input id="screen-mode" 
            label="Screen mode" 
            value="[[ claims.screenMode ]]" 
            name\$="[[ claimsNamePrefix ]][screenMode]"
            error-message="Please enter screen mode" 
            data-field="" required=""></paper-input>
        <paper-input id="desktop-width" 
            label="Desktop Width" 
            value="[[ claims.desktopWidth ]]" 
            name\$="[[ claimsNamePrefix ]][desktopWidth]"
            error-message="Please enter desktop width" 
            data-field="" required=""></paper-input>
        <paper-input id="desktop-height" 
            label="Desktop Height" 
            value="[[ claims.desktopHeight ]]" 
            name\$="[[ claimsNamePrefix ]][desktopHeight]"
            error-message="Please enter desktop height" 
            data-field="" required=""></paper-input>
        <paper-input id="session" 
            label="Session" 
            value="[[ claims.session ]]" 
            name\$="[[ claimsNamePrefix ]][session]"
            error-message="Please enter session value" 
            data-field="" required=""></paper-input>
        <paper-input id="winposstr" 
            label="Window position" 
            value="[[ claims.winposstr ]]" 
            name\$="[[ claimsNamePrefix ]][winposstr]"
            error-message="Please enter window position (winposstr)" 
            data-field="" required=""></paper-input>
        <paper-input id="compression" 
            label="Compression" 
            value="[[ claims.compression ]]" 
            name\$="[[ claimsNamePrefix ]][compression]"
            error-message="Please enter compression" 
            data-field="" required=""></paper-input>
        <paper-input id="keyboardhook" 
            label="Keyboard Hook" 
            value="[[ claims.keyboardhook ]]" 
            name\$="[[ claimsNamePrefix ]][keyboardhook]"
            error-message="Please enter keyboard hook" 
            data-field="" required=""></paper-input>
        <paper-input id="username" 
            label="Username" 
            value="[[ claims.username ]]" 
            name\$="[[ claimsNamePrefix ]][username]"
            error-message="Please enter username" 
            data-field="" required=""></paper-input>
        <paper-input id="domain" 
            label="Domain" 
            value="[[ claims.domain ]]" 
            name\$="[[ claimsNamePrefix ]][domain]"
            error-message="Please enter domain" 
            data-field="" required=""></paper-input>
        <paper-input id="displayconnectionbar" 
            label="Display connection bar" 
            value="[[ claims.displayconnectionbar ]]" 
            name\$="[[ claimsNamePrefix ]][displayconnectionbar]"
            error-message="Please enter value for display connection bar" 
            data-field="" required=""></paper-input>
        <paper-input id="disable-wallpaper" 
            label="Disable wallpaper" 
            value="[[ claims.disableWallpaper ]]" 
            name\$="[[ claimsNamePrefix ]][disableWallpaper]"
            error-message="Please enter value for disable wallpaper" 
            data-field="" required=""></paper-input>
        <paper-input id="disable-full-window-drag" 
            label="Disable full window drag" 
            value="[[ claims.disableFullWindowDrag ]]" 
            name\$="[[ claimsNamePrefix ]][disableFullWindowDrag]"
            error-message="Please enter value for disable wallpaper" 
            data-field="" required=""></paper-input>
        <paper-input id="allow-desktop-composition" 
            label="Allow desktop composition" 
            value="[[ claims.allowDesktopComposition ]]" 
            name\$="[[ claimsNamePrefix ]][allowDesktopComposition]"
            error-message="Please enter value for allow desktop composition" 
            data-field="" required=""></paper-input>
        <paper-input id="allow-font-smoothing" 
            label="Allow font smoothing" 
            value="[[ claims.allowFontSmoothing ]]" 
            name\$="[[ claimsNamePrefix ]][allowFontSmoothing]"
            error-message="Please enter value for allow font smoothing" 
            data-field="" required=""></paper-input>
        <paper-input id="disable-menu-anims" 
            label="Disable menu animations" 
            value="[[ claims.disableMenuAnims ]]" 
            name\$="[[ claimsNamePrefix ]][disableMenuAnims]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="disable-themes" 
            label="Disable themes" 
            value="[[ claims.disableThemes ]]" 
            name\$="[[ claimsNamePrefix ]][disableThemes]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="disable-cursor-setting" 
            label="Disable cursor setting" 
            value="[[ claims.disableCursorSetting ]]" 
            name\$="[[ claimsNamePrefix ]][disableCursorSetting]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="bitmapcachepersistenable" 
            label="Bitmap caching" 
            value="[[ claims.bitmapcachepersistenable ]]" 
            name\$="[[ claimsNamePrefix ]][bitmapcachepersistenable]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="full-address" 
            label="Remote computer name or IP address (and optional port)" 
            value="[[ claims.fullAddress ]]" 
            name\$="[[ claimsNamePrefix ]][fullAddress]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="audiomode" 
            label="Remote computer sounds" 
            value="[[ claims.audiomode ]]" 
            name\$="[[ claimsNamePrefix ]][audiomode]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="audiomode" 
            label="Remote computer sounds" 
            value="[[ claims.audiomode ]]" 
            name\$="[[ claimsNamePrefix ]][audiomode]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="redirectprinters" 
            label="Will printers be available in remote session" 
            value="[[ claims.redirectprinters ]]" 
            name\$="[[ claimsNamePrefix ]][redirectprinters]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="redirectcomports" 
            label="Should serial ports be available" 
            value="[[ claims.redirectcomports ]]" 
            name\$="[[ claimsNamePrefix ]][redirectcomports]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="redirectsmartcards" 
            label="Should smart card be available" 
            value="[[ claims.redirectsmartcards ]]" 
            name\$="[[ claimsNamePrefix ]][redirectsmartcards]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="redirectclipboard" 
            label="Should clipboard be available" 
            value="[[ claims.redirectclipboard ]]" 
            name\$="[[ claimsNamePrefix ]][redirectclipboard]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="redirectposdevices" 
            label="Should pos device be available" 
            value="[[ claims.redirectposdevices ]]" 
            name\$="[[ claimsNamePrefix ]][redirectposdevices]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="autoreconnection-enabled" 
            label="Should client computer automatically reconnect" 
            value="[[ claims.autoreconnectionEnabled ]]" 
            name\$="[[ claimsNamePrefix ]][autoreconnectionEnabled]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="authentication-level" 
            label="What should happen when server authentication fails" 
            value="[[ claims.authenticationLevel ]]" 
            name\$="[[ claimsNamePrefix ]][authenticationLevel]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="prompt-for-credentials" 
            label="Will Remote Desktop Connection prompt for credentials when connecting" 
            value="[[ claims.promptForCredentials ]]" 
            name\$="[[ claimsNamePrefix ]][promptForCredentials]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="negotiate-security-layer" 
            label="Determines whether the level of security is negotiated or not" 
            value="[[ claims.negotiateSecurityLayer ]]" 
            name\$="[[ claimsNamePrefix ]][negotiateSecurityLayer]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="remoteapplicationmode" 
            label="Remote application mode" 
            value="[[ claims.remoteapplicationmode ]]" 
            name\$="[[ claimsNamePrefix ]][remoteapplicationmode]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="alternate-shell" 
            label="Specify a program to be started automatically" 
            value="[[ claims.alternateShell ]]" 
            name\$="[[ claimsNamePrefix ]][alternateShell]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="shell-working-directory" 
            label="The working directory on the remote computer to be used if an alternate shell is specified" 
            value="[[ claims.shellWorkingDirectory ]]" 
            name\$="[[ claimsNamePrefix ]][shellWorkingDirectory]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="gatewayhostname" 
            label="Specifies the hostname of the RD Gateway" 
            value="[[ claims.gatewayhostname ]]" 
            name\$="[[ claimsNamePrefix ]][gatewayhostname]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="gatewayusagemethod" 
            label="Specifies if and how to use a Remote Desktop Gateway (RD Gateway) server" 
            value="[[ claims.gatewayusagemethod ]]" 
            name\$="[[ claimsNamePrefix ]][gatewayusagemethod]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="gatewaycredentialssource" 
            label="Specifies the credentials that should be used to validate the connection with the RD Gateway" 
            value="[[ claims.gatewaycredentialssource ]]" 
            name\$="[[ claimsNamePrefix ]][gatewaycredentialssource]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="gatewayprofileusagemethod" 
            label="Determines the RD Gateway authentication method to be used" 
            value="[[ claims.gatewayprofileusagemethod ]]" 
            name\$="[[ claimsNamePrefix ]][gatewayprofileusagemethod]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="promptcredentialonce" 
            label="Should RDC use the same credentials for both the RD Gateway and the remote computer" 
            value="[[ claims.promptcredentialonce ]]" 
            name\$="[[ claimsNamePrefix ]][promptcredentialonce]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
        <paper-input id="drivestoredirect" 
            label="Determines which local disk drives on the client computer will be redirected" 
            value="[[ claims.drivestoredirect ]]" 
            name\$="[[ claimsNamePrefix ]][drivestoredirect]"
            error-message="Please enter value" 
            data-field="" required=""></paper-input>
`;
    }

    static get is() { return 'appsco-application-form-rdp'; }

    static get properties() {
        return {
            claims: {
                type: Object,
                value: {
                    screenMode: 'screen mode id:i:2',
                    desktopWidth: 'desktopwidth:i:1024',
                    desktopHeight: 'desktopheight:i:768',
                    session: 'session bpp:i:32',
                    winposstr: 'winposstr:s:0,1,0,0,800,600',
                    compression: 'compression:i:1',
                    keyboardhook: 'keyboardhook:i:2',
                    username: 'username:s:ASP\NOR123',
                    domain: 'domain:s:ASP',
                    displayconnectionbar: 'displayconnectionbar:i:1',
                    disableWallpaper: 'disable wallpaper:i:0',
                    disableFullWindowDrag: 'disable full window drag:i:0',
                    allowDesktopComposition: 'allow desktop composition:i:1',
                    allowFontSmoothing: 'allow font smoothing:i:1',
                    disableMenuAnims: 'disable menu anims:i:0',
                    disableThemes: 'disable themes:i:0',
                    disableCursorSetting: 'disable cursor setting:i:0',
                    bitmapcachepersistenable: 'bitmapcachepersistenable:i:1',
                    fullAddress: 'full address:s:asp-ts11.asp.local',
                    audiomode: 'audiomode:i:0',
                    redirectprinters: 'redirectprinters:i:1',
                    redirectcomports: 'redirectcomports:i:0',
                    redirectsmartcards: 'redirectsmartcards:i:1',
                    redirectclipboard: 'redirectclipboard:i:1',
                    redirectposdevices: 'redirectposdevices:i:0',
                    autoreconnectionEnabled: 'autoreconnection enabled:i:1',
                    authenticationLevel: 'authentication level:i:0',
                    promptForCredentials: 'prompt for credentials:i:0',
                    negotiateSecurityLayer: 'negotiate security layer:i:1',
                    remoteapplicationmode: 'remoteapplicationmode:i:0',
                    alternateShell: 'alternate shell:s:',
                    shellWorkingDirectory: 'shell working directory:s:',
                    gatewayhostname: 'gatewayhostname:s:gateway.johnet.no',
                    gatewayusagemethod: 'gatewayusagemethod:i:2',
                    gatewaycredentialssource: 'gatewaycredentialssource:i:0',
                    gatewayprofileusagemethod: 'gatewayprofileusagemethod:i:1',
                    promptcredentialonce: 'promptcredentialonce:i:1',
                    drivestoredirect: 'drivestoredirect:s:C:;'
                }
            },
            claimsNamePrefix: {
                type: String,
                value: "claims_rdp"
            }
        };
    }
}
window.customElements.define(AppscoApplicationFormRdp.is, AppscoApplicationFormRdp);
