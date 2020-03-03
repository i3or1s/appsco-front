import '@polymer/polymer/polymer-legacy.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="webkit-scrollbar-style">
    <template>
        <style>
            ::-webkit-scrollbar {
                height: 10px;
                overflow: visible;
                width: 10px;
            }
            ::-webkit-scrollbar-button {
                height: 0;
                width: 0;
            }
            ::-webkit-scrollbar-corner {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background-color: rgba(0,0,0,.2);
                background-clip: padding-box;
                border: 1px solid transparent;
                min-height: 28px;
                padding: 100px 0 0;
                -webkit-box-shadow: inset 1px 1px 0 rgba(0,0,0,.1),inset 0 -1px 0 rgba(0,0,0,.07);
                box-shadow: inset 1px 1px 0 rgba(0,0,0,.1),inset 0 -1px 0 rgba(0,0,0,.07);
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
