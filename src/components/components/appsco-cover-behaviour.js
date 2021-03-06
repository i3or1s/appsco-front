import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior Polymer.AppscoCoverBehaviour
 */
export const AppscoCoverBehaviour = {
    buildCover: function(elem, onclick) {
        const cover = document.createElement('div');
        const rect = elem ? elem.getBoundingClientRect() : {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0
        };
        const response = "position: fixed ;z-index: 8000 ;top: 0 ;right: 0 ;bottom: 0 ;left: 0 ;background-color: rgba(0,0,0,0.5);";

        const topCover = document.createElement('div');
        topCover.setAttribute('style', response);
        topCover.style.bottom = 'calc(100vh - '+rect.top+"px)";

        const rightCover = document.createElement('div');
        rightCover.setAttribute('style', response);
        rightCover.style.top = rect.top+"px";
        rightCover.style.left = (rect.left+rect.width)+"px";
        rightCover.style.bottom =  'calc(100vh - '+(rect.top+rect.height)+"px)";

        const bottomCover = document.createElement('div');
        bottomCover.setAttribute('style', response);
        bottomCover.style.top =  (rect.top+rect.height)+"px";

        const leftCover = document.createElement('div');
        leftCover.setAttribute('style', response);
        leftCover.style.top = rect.top+"px";
        leftCover.style.right = 'calc(100vw - '+rect.left+"px)";
        leftCover.style.bottom =  'calc(100vh - '+(rect.top+rect.height)+"px)";

        topCover.addEventListener('click', onclick);
        rightCover.addEventListener('click', onclick);
        bottomCover.addEventListener('click', onclick);
        leftCover.addEventListener('click', onclick);

        cover.setAttribute('hidden', true);
        cover.appendChild(topCover);
        cover.appendChild(rightCover);
        cover.appendChild(bottomCover);
        cover.appendChild(leftCover);

        document.querySelector('body').appendChild(cover);

        return {
            show: function(){ cover.removeAttribute('hidden'); },
            hide: function(){ cover.setAttribute('hidden', true); },
            destroy: function(){
                if(cover.parentElement) {
                    cover.parentElement.removeChild(cover);
                }
            }
        };
    }
};
