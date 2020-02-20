/**
 +---------------------------------------------------------------+
 | Microserver application enhancement                           |
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
const getClientIp = require('./x-ip')
const body = require('./micro-body')
const cors = require('./micro-cors')
const { route } = require('./micro-router')

// Parse data if not the standard response supported
// standard supported is: string/buffer
const stringify = data => {
    return typeof data === 'number' || $.isJson(data) ?
        JSON.stringify(data) : data
}

// Send data with code
const send = res => (code, data) => {
    if (data === undefined) {
        data = code
        code = 200
    }
    res.statusCode = code
    res.end(stringify(data))
}

// Format current time
const now = () => {
    const date = new Date(Data.now() + 8 * 3600 * 1000)
    return date.toJSON().substr(0, 19).replace('T', ' ')
}

// Application enhancement
const app = next => async (req, res) => {
    try {
        // Add helpers to context
        req.ip = getClientIp(req)
        res.send = send(res)

        // Send the result of handler
        const result = await next(req, res)
        if (result) {
            res.send(result)
        } else {
            res.send(204, null)
        }
    } catch (err) {
        res.statusCode = 500
        res.end(err.message)
        console.error(`[${now()}]`, req.method, req.url, err.stack)
    }
}

module.exports = options => (...fn) => app(
    cors(options)(body(route(...fn)))
)
