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
        res.writeHead(code, { Location: url })
        res.end()
    }
}
