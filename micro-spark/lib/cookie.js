module.exports = (req, res) => {
    req.cookies = {}
    let cookies = req.headers.cookie
    if (cookies) {
        cookies = cookies.split(/;\s+/)
        cookies.forEach(c => {
            const i = c.indexOf('=')
            const k = c.substr(0, i)
            const v = c.substr(i + 1)
            req.cookies[k] = v
        })
    }

    res.setCookie = (key, value, options = {}) => {
        const cookies = [`${key}=${value}`]
        if (options.domain) {
            cookies.push(`domain=${options.domain}`)
        }
        if (options.maxAge) {
            cookies.push(`max-age=${options.maxAge}`)
        }
        if (options.httpOnly) {
            cookies.push(`httpOnly=true`)
        }
        res.setHeader('Set-Cookie', cookies.join('; '))
    }
}
