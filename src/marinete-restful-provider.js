/**
 * Send request.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api private
 */
function request(options, callback) {
    var http = new XMLHttpRequest;

    http.onreadystatechange = function () {
        if (http.readyState == 4)
            if (callback)
                callback(http.responseText);
    };

    http.open(options.method, options.url, true);

    for (var header in options.headers)
        http.setRequestHeader(header, options.headers[header]);

    http.send(options.json);
}

/**
 * `MarineteRestfulProvider` constructor.
 *
 * @param {Object} config
 * @api public
 */
function MarineteRestfulProvider(config) {
    this.config = config || {
        rootUrl: '',
        app: {
            id: '',
            key: ''
        }
    };
}

/**
* Logs the error
*
* @param {Object} error
* @param {Function} callback
* @api public
*/
MarineteRestfulProvider.prototype.error = function (error, callback) {
    if (!this.config.rootUrl) throw new Error('There is no rootUrl in the config.');
    if (!this.config.app) throw new Error('There is no app in the config.');
    if (!this.config.app.id) throw new Error('Can\'t find app.id property.');
    if (!this.config.app.key) throw new Error('Can\'t find app.key property.');

    var uri = this.config.rootUrl + '/error';

    var options = {
        url: uri,
        method: 'POST',
        headers: {
            'marinetappid': this.config.app.id,
            'marinetappkey': this.config.app.key,
            'Content-Type': 'application/json'
        },
        json: error
    };

    request(options, callback);
};

window.onerror = function (message, file, line, col, error) {
    var provider = new MarineteRestfulProvider({
        rootUrl: 'http://localhost:3000',
        app: {
            id: '540a26f033026ce20a07ec33',
            key: 'ac0c0afe317621c1dfae6645bcf7d855b9ecf40f1162952ee3676edbba79f80b'
        }
    });

    provider.error({
        message: message,
        exception: error.stack
    });
};