/**
 +---------------------------------------------------------------+
 | A static serve middleware for ZEIT's Micro                    |
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
const path = require('path')
const fs = require('fs')
const zlib = require('zlib')
const root = process.cwd()

const mimeTypes = {
    htm: 'text/html;charset=utf-8',
    html: 'text/html;charset=utf-8',
    xml: 'text/xml;charset=utf-8',
    css: 'text/css;charset=utf-8',
    txt: 'text/plain;charset=utf-8',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    tif: 'image/tiff',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    zip: 'application/zip',
    ttf: 'font/ttf',
    woff: 'font/woff',
    woff2: 'font/woff2',
}

module.exports = (req, res, rewrites = {}) => {
    const url = rewrites[req.url] || req.url
    const filename = path.join(root, url)
    const extname = path.extname(filename).substr(1)

    try {
        if (!fs.existsSync(filename)) {
            throw new Error('PAGE NOT FOUND')
        }
        if (!fs.statSync(filename).isFile()) {
            throw new Error('FILE NOT FOUND')
        }

        res.setHeader('Cache-Control', 'max-age=604800')
        if (mimeTypes[extname]) {
            res.setHeader('Content-Type', mimeTypes[extname])
        }

        const stream = fs.createReadStream(filename)
        if (req.headers['accept-encoding'] &&
            req.headers['accept-encoding'].indexOf('gzip') >= 0 &&
            (extname === 'js' || extname === 'css' || extname === 'html')) {
            res.setHeader('Content-Encoding', 'gzip')
            const gzip = zlib.createGzip()
            return stream.pipe(gzip).pipe(res)
        }
        return stream.pipe(res)

    } catch (e) {
        res.send(`<!doctype html><head><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/><style>body{font-family:Helvetica;position:absolute;left:0;right:0;top:0;bottom:0;display:flex;justify-content:center;align-items:center}code{font-family:inherit;font-size:24px;color:#999;padding:0 20px;border-right:#ccc 1px solid}p{margin:20px}@media (max-width:640px){body{flex-direction:column}code{padding:15px 0;border-right:0;border-bottom:#ccc 1px solid}}</style></head><body><code>404</code><p>${e.message}</p></body>`)
    }
}
