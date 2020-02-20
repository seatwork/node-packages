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
const parseUrl = require('url').parse

const method = method => (path, handler) => {
    if (!path) throw new Error('Router path is required')
    if (!handler) throw new Error('Router handler is required')

    return (req, res) => {
        if (req.method !== method) return

        const route = new UrlPattern(path)
        const parsed = parseUrl(req.url, true)
        const extend = {
            query: parsed.query,
            params: route.match(parsed.pathname)
        }
        if (extend.params) {
            return handler(Object.assign(req, extend), res)
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

class UrlPattern {
    constructor(path) {
        this.regex = 'a-zA-Z0-9_-' // 参数变量中允许使用的字符
        this.keys = [] // 临时存储解析后的键名

        // 将 path 中变量占位符全部替换成正则表达式，同时保存占位符的变量名
        // 例如 /:username/:status -> /([a-zA-Z0-9_-]+)/([a-zA-Z0-9_-]+)
        path = path.replace(new RegExp(':([' + this.regex + ']+)', 'g'), (a, k) => {
            this.keys.push(k)
            return '([' + this.regex + ']+)'
        })

        // 在完整替换后的正则表达式中增加严格起止限制
        // 末尾斜杠可有可无
        this.regex = new RegExp('^' + path + '\/?$')
    }

    match(url) {
        // 请求的 url 是否与 path 正则式匹配
        const matched = url.match(this.regex)
        if (matched) {
            const params = {}

            // 将匹配后的结果按占位符索引顺序生成参数对象
            this.keys.forEach((key, i) => {
                params[key] = matched[i + 1]
            })
            return params
        }
    }
}

module.exports = {
    route: (...fn) => route(fn),
    get: method('GET'),
    post: method('POST'),
    put: method('PUT'),
    del: method('DELETE'),
}
