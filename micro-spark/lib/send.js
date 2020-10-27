/**
 +---------------------------------------------------------------+
 | Request client ip address detector                            |
 +---------------------------------------------------------------+
 | This program is Licensed under MIT license with conditions    |
 | only requiring preservation of copyright and license notices. |
 | Licensed works, modifications, and larger works may be        |
 | distributed under different terms and without source code.    |
 | For more see <https://opensource.org/licenses/MIT>            |
 +---------------------------------------------------------------+
 | @author Ai Chen                                               |
 | @copyright (c) 2020, cloudseat.net                            |
 +---------------------------------------------------------------+
 */

// Add send method to standard response object
module.exports = (req, res) => {
    res.send = (code, data) => {
        if (data === undefined) {
            data = code
            code = 200
        }
        // the standard response supported string/buffer only
        if (typeof data !== 'string' && !Buffer.isBuffer(data)) {
            data = JSON.stringify(data)
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
        }
        res.statusCode = code
        res.end(data)
    }

    res.redirect = (code, url) => {
        if (url === undefined) {
            url = code
            code = 301
        }
        res.writeHead(code, {
            Location: url
        })
        res.end()
    }
}
