/**
 +---------------------------------------------------------------+
 | Micro-spark http server framework                             |
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
const { parse } = require('url')
const http = require('http')
const pkg = require('./package')
const cors = require('./lib/cors')

/**
 * Spark application boot class
 */
class Spark {
    constructor() {
        this.middlewares = []
        this.routers = []
        this._createServer()

        this.use(require('./lib/cookie'))
        this.use(require('./lib/ip'))
        this.use(require('./lib/protocol'))
        this.use(require('./lib/raw-body'))
        this.use(require('./lib/send'))
        this.use(require('./lib/serve'))

        this.get = this._method('GET')
        this.post = this._method('POST')
        this.put = this._method('PUT')
        this.del = this._method('DELETE')
        this.head = this._method('HEAD')
        this.patch = this._method('PATCH')
        this.opt = this._method('OPTION')
        this.all = this._method()
    }

    // Start HTTP server
    start(port = 6060, callback) {
        this.server.listen(port, () => {
            console.log(`\x1b[90mMicro-spark ^${pkg.version} - ${pkg.url}\x1b[0m`)
            console.log(`> \x1b[32mReady!\x1b[0m Running at \x1b[4m\x1b[36mhttp://localhost:${port}\x1b[0m`)
            callback && callback(port)
        })
    }

    listen(port, callback) {
        this.start(port, callback)
        console.log('\x1b[33m[WARNING]\x1b[0m', 'The "listen" method is deprecated, please use "start" instead.')
    }

    use(middleware) {
        this.middlewares.push(middleware)
    }

    _method(method) {
        return (path, handler) => this.routers.push({ method, path, handler })
    }

    cors(options) {
        this.use(cors(options))
    }

    engine(templateRoot, helpers) {
        const engine = require('./lib/engine')
        this.use(engine(templateRoot, helpers))
    }

    serve(path) {
        path = path || '/'
        const slash = path.endsWith('/') ? '' : '/'
        this._method('GET')(path + slash + '.+')
    }

    // Create HTTP server
    _createServer() {
        this.server = http.Server(async (req, res) => {
            try {
                // Executes all middlewares
                for (let middleware of this.middlewares) {
                    await middleware(req, res)
                }

                // Handle request with router
                const result = await this._route(req, res)
                if (result !== undefined && !res.headersSent &&
                    !(result instanceof http.ServerResponse)) {
                    res.send(result)
                }
            } catch (e) {
                console.error('\x1b[31m[ERROR]\x1b[0m', req.method, req.url, e.stack || e)
                res.send(e.status || 500, e.message || e)
            }
        })
    }

    // Route by request method and url
    async _route(req, res) {
        for (let router of this.routers) {
            if (!router.method || req.method === router.method) {
                const parsed = parse(req.url, true)
                const params = this._findPath(parsed.pathname, router.path)

                if (params) {
                    req.params = params
                    req.query = parsed.query
                    return router.handler ? await router.handler(req, res) : res.serve()
                }
            }
        }
        console.log('\x1b[33m[WARNING]\x1b[0m', 'Route not found: ' + req.url)
        res.send(404, 'Route not found: ' + req.url)
    }

    // Find route path by url
    _findPath(url, pattern) {
        const PATH_REGEX = '[a-zA-Z0-9_@\\-\\.]+'
        pattern = pattern.replace(new RegExp(':(' + PATH_REGEX + ')', 'g'), '(?<$1>' + PATH_REGEX + ')')
        const result = url.match('^' + pattern + '$')
        return result ? result.groups || Array.from(result).slice(1) : null
    }
}

// Catch async exceptions
process.on('unhandledRejection', e => {
    console.error('\x1b[31m[ERROR]\x1b[0m', e.stack || e)
})

// Catch other exceptions
process.on('uncaughtException', e => {
    console.error('\x1b[31m[ERROR]\x1b[0m', e.stack || e)
})

module.exports = new Spark()
