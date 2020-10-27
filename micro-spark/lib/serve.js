/**
 +---------------------------------------------------------------+
 | A middleware for static serve                                 |
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

// Handle static resources
module.exports = (req, res) => {
    res.serve = rewrite => {
        let url = rewrite || req.url || ''
        url = url.startsWith('/') ? url.substr(1) : url
        const filename = path.resolve(url)
        const extname = path.extname(filename).substr(1)

        if (!fs.existsSync(filename)) {
            console.log('\x1b[33m[WARNING]\x1b[0m', 'File Not Found: ' + filename)
            return res.send(404, 'File Not Found: ' + filename)
        }

        const stat = fs.statSync(filename)
        if (!stat.isFile()) {
            console.log('\x1b[33m[WARNING]\x1b[0m', 'Invalid File: ' + filename)
            return res.send(406, 'Invalid File: ' + filename)
        }

        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
        res.setHeader('Last-Modified', new Date(stat.mtime).toGMTString())
        if (mimeTypes[extname]) {
            res.setHeader('Content-Type', mimeTypes[extname])
        }

        const stream = fs.createReadStream(filename)
        if (req.headers['accept-encoding'] &&
            req.headers['accept-encoding'].indexOf('gzip') >= 0 &&
            (extname === 'js' || extname === 'css' || extname === 'html')) {
            res.setHeader('Content-Encoding', 'gzip')
            const gzip = zlib.createGzip()
            stream.pipe(gzip).pipe(res)
        } else {
            stream.pipe(res)
        }
    }
}
