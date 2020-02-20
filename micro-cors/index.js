/**
 +---------------------------------------------------------------+
 | A simple CORS middleware for Zeit's Micro                     |
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
const url = require('url')

// Default options
const DEFAULT_OPTIONS = {
    allowCredentials: true,
    allowOrigins: ['*'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Authorization', 'Accept', 'Content-Type'],
    exposeHeaders: [],
    maxAge: 60 * 60 * 24 // 24 hours
}

// Check if the request origin exists in option
const checkOrigin = (origins, origin = '') => {
    const hostname = url.parse(origin).hostname
    if (hostname) {
        for (let i = 0; i < origins.length; i++) {
            if (origins[i] === '*') return '*'
            if (hostname.endsWith(origins[i])) return origin
        }
    }
}

/**
 * Set CORS parameters by config.json or default
 */
module.exports = options => next => (req, res) => {
    const o = Object.assign(DEFAULT_OPTIONS, options)
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
    }
    return next(req, res)
}
