/**
 +---------------------------------------------------------------+
 | A smart router middleware for ZEIT's Micro                    |
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

const match = (url, pattern) => {
    const reg = '[a-zA-Z0-9_-]+'
    pattern = pattern.replace(new RegExp(':(' + reg + ')', 'g'), '(?<$1>' + reg + ')') + '$'
    const result = url.match(pattern)
    return result ? result.groups || Array.from(result).slice(1) : null
}

const method = method => (path, handler) => {
    if (!path) throw new Error('Router path is required')
    if (!handler) throw new Error('Router handler is required')

    return (req, res) => {
        if (req.method === method) {
            const parsed = url.parse(req.url, true)
            const params = match(parsed.pathname, path)
            if (params) {
                return handler(Object.assign(req, {
                    query: parsed.query,
                    params: params
                }), res)
            }
        }
    }
}

const route = funcs => async (req, res) => {
    for (const fn of funcs) {
        const result = await fn(req, res)
        if (result || res.headersSent) return result
    }
    return null
}

module.exports = {
    match: match,
    route: (...fn) => route(fn),
    get: method('GET'),
    post: method('POST'),
    put: method('PUT'),
    del: method('DELETE'),
}
