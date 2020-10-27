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
const http = require('http')
const parse = require('url').parse
const pkg = require('./package')
const cors = require('./lib/cors')
const ip = require('./lib/ip')
const rawBody = require('./lib/raw-body')
const send = require('./lib/send')
const serve = require('./lib/serve')

const middlewares = []
const routers = []

// Cache middlewares and routers
const use = fn => middlewares.push(fn)
const method = method => (path, fn) => {
    routers.push({
        method,
        path,
        fn
    })
}

// Parse url patterns (:name or regex expression)
const match = (url, pattern) => {
    const reg = '[a-zA-Z0-9_@\\-\\.]+'
    pattern = pattern.replace(new RegExp(':(' + reg + ')', 'g'), '(?<$1>' + reg + ')')
    const result = url.match('^' + pattern + '$')
    return result ? result.groups || Array.from(result).slice(1) : null
}

// Route by request method and url
const route = async (req, res) => {
    for (const router of routers) {
        if (req.method === router.method) {
            const parsed = parse(req.url, true)
            const params = match(parsed.pathname, router.path)

            if (params) {
                req.params = params
                req.query = parsed.query
                return router.fn ? await router.fn(req, res) : res.serve()
            }
        }
    }
    console.log('\x1b[33m[WARNING]\x1b[0m', 'Not Found Route: ' + req.url)
    res.send(404, 'Not Found Route: ' + req.url)
}

// Catch async exceptions
process.on('unhandledRejection', err => {
    console.error('\x1b[31m[ERROR]\x1b[0m', err.stack || err)
})

process.on('uncaughtException', err => {
    console.error('\x1b[31m[ERROR]\x1b[0m', err.stack || err)
})

/**
 +--------------------------------------------------------+
 | Create HTTP server
 +--------------------------------------------------------+
 */
const server = http.Server(async (req, res) => {
    try {
        // Executes all middlewares
        for (let i = 0; i < middlewares.length; i++) {
            await middlewares[i](req, res)
        }
        // Executes router
        const result = await route(req, res)
        if (result !== undefined && !res.headersSent &&
            !(result instanceof http.ServerResponse)) {
            res.send(result)
        }
    } catch (err) {
        console.error('\x1b[31m[ERROR]\x1b[0m', req.method, req.url, err.stack || err)
        res.send(500, err.message || err)
    }
})

/**
 +--------------------------------------------------------+
 | Exports application
 +--------------------------------------------------------+
 */
use(ip)
use(rawBody)
use(send)
use(serve)

module.exports = {
    listen(port = 6060, callback) {
        server.listen(port, () => {
            console.log(`\x1b[90mMicro-spark ^${pkg.version} - ${pkg.url}\x1b[0m`)
            console.log(`> \x1b[32mReady!\x1b[0m Running at \x1b[4m\x1b[36mhttp://127.0.0.1:${port}\x1b[0m`)
            callback && callback()
        })
    },

    cors(options) {
        use(cors(options))
    },

    serve(path) {
        path = path || '/'
        const slash = path.endsWith('/') ? '' : '/'
        method('GET')(path + slash + '.+')
    },

    engine(templateRoot, helpers) {
        const engine = require('./lib/engine')
        use(engine(templateRoot, helpers))
    },

    get: method('GET'),
    post: method('POST'),
    put: method('PUT'),
    del: method('DELETE'),
    head: method('HEAD'),
    patch: method('PATCH'),
    opt: method('OPTION'),

    use,
    server
}
