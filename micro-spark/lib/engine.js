/**
 +---------------------------------------------------------------+
 | A middleware for art-template engine                          |
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
const template = require('art-template')

template.defaults.debug = false
template.defaults.minimize = true
template.defaults.htmlMinifierOptions = {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    ignoreCustomFragments: []
}

module.exports = (base, helpers) => {
    base = base || ''
    base = base.startsWith('/') ? base.substr(1) : base
    template.defaults.root = path.resolve(base)
    template.defaults.extname = '.html'

    helpers = helpers || {}
    for (let name in helpers) {
        template.defaults.imports[name] = helpers[name]
    }

    return (req, res) => {
        res.render = (page, data) => res.send(template(page, data))
    }
}
