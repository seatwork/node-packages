/**
 +---------------------------------------------------------------+
 | A simple CORS middleware                                      |
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
const parse = require('url').parse
const defaultOptions = {
    allowCredentials: true,
    allowOrigins: ['*'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    allowHeaders: ['Authorization', 'Accept', 'Content-Type'],
    exposeHeaders: [],
    maxAge: 60 * 60 * 24 // 24 hours
}

// Check if the request origin exists in options
const checkOrigin = (origins, origin = '') => {
    const hostname = parse(origin).hostname
    if (hostname) {
        for (let i = 0; i < origins.length; i++) {
            if (origins[i] === '*') return '*'
            if (hostname.endsWith(origins[i])) return origin
        }
    }
}

// Overwrite options and handle CORS
module.exports = options => (req, res) => {
    const o = Object.assign(defaultOptions, options)
    const origin = checkOrigin(o.allowOrigins, req.headers.origin)

    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Access-Control-Allow-Credentials', o.allowCredentials)
        res.setHeader('Access-Control-Allow-Methods', o.allowMethods.join(','))
        res.setHeader('Access-Control-Allow-Headers', o.allowHeaders.join(','))
        res.setHeader('Access-Control-Max-Age', String(o.maxAge))

        if (o.exposeHeaders.length) {
            res.setHeader('Access-Control-Expose-Headers', o.exposeHeaders.join(','))
        }
        if (req.method === 'OPTIONS') {
            res.send(200, null)
        }
    }
}
