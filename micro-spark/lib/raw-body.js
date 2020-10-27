/**
 +---------------------------------------------------------------+
 | Request raw body parser                                       |
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
const queryString = require("querystring")

function tryParseJson(data) {
    try {
        return JSON.parse(data)
    } catch (e) {
        return data
    }
}

function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const buffer = []
        req.on('data', chunk => {
            buffer.push(chunk)
        })
        req.on('error', err => {
            reject(err)
        })
        req.on('end', () => {
            let data = Buffer.concat(buffer).toString('utf8')
            const contentType = req.headers['content-type']

            if (contentType) {
                if (contentType.indexOf('application/json') >= 0) {
                    data = tryParseJson(data)
                } else
                if (contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
                    data = queryString.parse(data)
                }
            }
            resolve(data)
        })
    })
}

module.exports = async (req, res) => {
    req.body = await getRawBody(req)
}
