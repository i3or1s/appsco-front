import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="shared-styles">
    <template>
        <style>
            html, :host > * {
                --paper-progress-active-color: var(--app-primary-color-dark);
                --paper-tabs-selection-bar-color: var(--app-primary-color-dark);
                --paper-tab-ink: transparent;

                --paper-tabs: {
                    height: 38px;
                    margin-top: 20px;
                    color: var(--primary-text-color);
                };

                --paper-tabs-pages: {
                    margin-top: 10px;
                    height: 100%;
                };

                --paper-tabs-content-style: {
                    margin-right: -10px;
                    padding-right: 10px;
                    overflow: auto;
                };

                --info-box: {
                     padding: 10px;
                     margin: 10px 0;
                     background-color: rgba(57, 194, 215, 0.1);
                     color: #279FBC;
                     border-radius: 3px;
                 };

                --paper-dialog-appsco-loader: {
                     margin: 0 !important;
                     padding: 0 !important;
                 };

                --paper-listbox: {
                     min-width: 200px;
                     padding: 0;
                     border-radius: 2px;
                 };

                --paper-item: {
                     min-height: 40px;
                     font-size: 14px;
                     cursor: pointer;
                     color: var(--primary-text-color);
                 };
                --paper-item-selected: {
                     color: var(--primary-text-color);
                     background-color: var(--body-background-color);
                 };
                --paper-item-focused: {
                     background-color: var(--body-background-color);
                 };
                --paper-item-focused-before: {
                     background-color: var(--body-background-color);
                 };
                --paper-item-hover: {
                     background-color: var(--body-background-color);
                 };

                --paper-icon-button: {
                     padding: 0;
                     width: 24px;
                     height: 24px;
                     margin-right: 6px;
                     color: var(--primary-text-color);
                 };

                --application-details-icon-button: {
                     padding: 4px;
                     width: 24px;
                     height: 24px;
                 };

                --appsco-copy-action: {
                    padding: 4px;
                    width: 24px;
                    height: 24px;
                    margin: 0;
                 };

                --paper-progress-height: 2px;

                --paper-dialog-scrollable-child: {
                     padding-bottom: 10px;
                 };
                --paper-dialog-button: {
                     padding: 4px 8px;
                     color: var(--primary-text-color);
                 };
                --paper-dialog-confirm-button: {
                     font-weight: 500;
                 };

                --appsco-page-global-action-color: var(--app-primary-color-dark);
                --appsco-page-global: {
                    padding-left: 10px;
                    padding-right: 0;
                    margin-left: 10px;
                    margin-right: 0;
                    border-left: 1px solid var(--divider-color);
                    text-align: right;
                };

                --manage-page-global-actions: {
                    @apply --layout-horizontal;
                    @apply --layout-center;
                    @apply --layout-end-justified;
                    padding-right: 6px;
                };

                --text-wrap-break: {
                    overflow: hidden;
                    word-wrap: break-word;
                };

                --text-no-wrap: {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                };

                --appsco-list-item: {
                    color: var(--primary-text-color);
                 };

                --appsco-list-item-message: {
                    @apply --text-wrap-break;
                };

                --application-title: {
                    @apply --text-wrap-break;
                };

                --appsco-account-info: {
                     color: var(--primary-text-color);
                 };

                --account-initials-background-color: var(--body-background-color);
                --subscriber-initials-background-color: var(--body-background-color-darker);

                --resource-color: var(--primary-text-color);

                --appsco-list-item-icon: {
                     border-radius: 50%;
                 };
                --log-item-image-contain: {
                     border-radius: 50%;
                 };

                --applications-progress-bar: {
                     display: none;
                 };

                --appsco-list-progress-bar: {
                     display: none;
                 };

                --accounts-progress-bar: {
                     display: none;
                 };

                --invitations-progress-bar: {
                     display: none;
                 };

                --list-container: {
                    padding-top: 0;
                };

                --add-item-action: {
                    @apply --primary-button;
                    min-width: 100px;
                };

                --import-action: {
                    @apply --primary-button;
                };

                --export-action: {
                    @apply --primary-button;
                };

                --paper-tooltip-background: var(--app-primary-color-dark);
                --paper-tooltip: {
                    padding: 5px;
                };

                --full-page: {
                     display: block;
                     height: 100%;
                     overflow: hidden;
                     position: relative;
                     font-size: 14px;
                     color: var(--primary-text-color);
                 };

                --full-page-paper-card: {
                     width: 100%;
                     height: 100%;
                     background-color: #ffffff;
                     overflow-y: auto;
                 };

                --full-page-paper-card-header-text: {
                    padding-bottom: 16px;
                    padding-top: 16px;
                    padding-left: 16px;
                    padding-right: 16px;
                };

                --page-paper-card-header-text: {
                    padding-bottom: 8px;
                    padding-top: 8px;
                    padding-left: 16px;
                    padding-right: 16px;
                };


                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };

                --paper-card-header-color: var(--primary-text-color);

                --page-close-action: {
                     color: var(--app-secondary-color);
                     position: absolute;
                     top: 10px;
                     right: 10px;
                     width: 24px;
                     height: 24px;
                 };

                --paper-button: {
                     padding: 6px 12px;
                     font-weight: 500;
                };

                --paper-button-disabled: {
                    opacity: 0.6;
                };

                --primary-button: {
                     display: block;
                     font-size: 12px;
                     margin: 0;
                     background-color: var(--brand-color);
                     border: 1px solid var(--brand-color);
                     color: var(--brand-text-color);
                     border-radius: var(--border-radius-base);
                     text-align: center;
                 };

                --form-action: {
                    @apply --primary-button;
                    padding: 4px 8px;
                    margin-top: 20px;
                    display: inline-block;
                 };

                --secondary-button: {
                     background-color: var(--app-secondary-color);
                     border: 1px solid var(--app-secondary-color);
                     color: #ffffff;
                 };

                --danger-button: {
                     background-color: var(--app-danger-color);
                     border-color: var(--app-danger-color);
                     color: #ffffff;
                 };

                --primary-button-active: {
                     @apply --shadow-elevation-2dp;
                     background-color: var(--success-color);
                     border-color: transparent;
                 };

                --load-more-button: {
                     display: block;
                     width: 120px;
                     margin: 10px auto 0;
                     text-align: center;
                     color: var(--primary-text-color);
                 };

                --link-button: {
                     color: var(--app-primary-color-dark);
                 };

                --info-message: {
                     @apply --paper-font-body1;
                     color: var(--primary-text-color);
                     font-style: normal;
                 };

                --paper-input-color: var(--secondary-text-color);
                --paper-input-focused-color: var(--app-primary-color-dark);

                --paper-input-container-label-focus: {
                    color: var(--secondary-text-color);
                };

                --paper-input-container-underline: {
                     border-bottom: 1px solid var(--divider-color);
                 };
                --paper-input-container-underline-focus: {
                     border-bottom: 1px solid var(--app-primary-color-dark);
                 };

                --paper-input-prefix-icon-fill-color: var(--secondary-text-color);
                --paper-input-focused-prefix-icon-fill-color: var(--app-primary-color-dark);

                --paper-input-suffix: {
                    opacity: 0.5;
                };
                --paper-input-suffix-icon-fill-color: var(--secondary-text-color);
                --paper-input-focused-suffix-icon-fill-color: var(--app-primary-color-dark);

                --vaadin-date-picker-overlay: {
                     max-height: 280px;
                     color: var(--primary-text-color);
                 };
                --vaadin-date-picker-footer: {
                     line-height: 14px;
                     box-shadow: none;
                     border-top: 1px solid var(--divider-color);
                     color: var(--primary-text-color);
                 };
                --vaadin-date-picker-calendar-title: {
                     padding-top: 20px;
                 };
                --vaadin-date-picker-calendar-weekday-cell: {
                     padding: 4px 0;
                 };
                --vaadin-date-picker-calendar-cell: {
                     padding: 4px 0;
                 };
                --vaadin-date-picker-calendar-cell-today: {
                     color: var(--primary-text-color);
                 };

                --paper-toggle-button-checked-button-color: var(--app-primary-color-dark);
                --paper-toggle-button-checked-bar-color: var(--divider-color);
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

/* shared styles for all views */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
;
