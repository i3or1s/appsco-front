import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior
 */
export const AppscoBehaviourExportReport = {

    properties: {
    },

    exportReport: function(url, method, reportPage) {
        if (typeof this._showProgressBar === 'function') {
            this._showProgressBar();
        }

        const request = document.createElement('iron-request'),
            options = {
                url: url,
                method: method.toUpperCase(),
                handleAs: 'blob',
                headers: {
                    'Authorization': 'token ' + this.authorizationToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: ''
            };

        if(options.method === 'GET') {
            options.url += '?' + this.glueStuff(reportPage.getFilters());
        }
        if(options.method === 'POST') {
            options.body += this.glueStuff(reportPage.getFilters());
        }

        request.send(options).then(function() {
            const fileReader = new FileReader();

            fileReader.onload = function(event) {
                const link = document.createElement('a');

                link.href = event.target.result;
                link.setAttribute('download', reportPage.getFileName());
                document.body.appendChild(link);

                if (link.click) {
                    link.click();
                }
                else if (document.createEvent) {
                    const clickEvent = document.createEvent('MouseEvents');

                    clickEvent.initEvent('click', true, true);
                    link.dispatchEvent(clickEvent);
                }
                document.body.removeChild(link);
            };

            fileReader.readAsDataURL(request.response);

            this.dispatchEvent(new CustomEvent(reportPage.getOnSuccessEvent(), {
                bubbles: true,
                composed: true,
                detail: {
                    response: request.response
                }
            }));
        }.bind(this), function(e) {
            this.dispatchEvent(new CustomEvent(reportPage.getOnFailEvent(), {
                bubbles: true,
                composed: true,
                detail: {
                    error: e,
                    message: reportPage.getFailMessage()
                }
            }));
        }.bind(this));
    },

    _onExportReportFinished: function() {
        if (typeof this._hideProgressBar === 'function') {
            this._hideProgressBar();
        }
    },

    _onExportReportFailed: function(event) {
        if (typeof this._hideProgressBar === 'function') {
            this._hideProgressBar();
        }
        if (typeof this._notify === 'function') {
            this._notify(event.detail.message);
        }
    },

    glueStuff: function (data) {
        let glued = '',
            glue = '';
        for (const property in data) {
            if (data.hasOwnProperty(property) === false) {
                continue;
            }
            if (Array.isArray(data[property])) {
                for (const i in data[property]) {
                    glued += glue + property + "[]=" + encodeURIComponent(data[property][i]);
                    glue = '&';
                }
                continue;
            }
            glued += glue + property + "=" + encodeURIComponent(data[property]);
            glue = '&';
        }
        return glued;
    }
};
