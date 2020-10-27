/**
 +---------------------------------------------------------------+
 | Request client ip address detector                            |
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
const IP_V4 = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/
const IP_V6 = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i

function isIp(value) {
    return IP_V4.test(value) || IP_V6.test(value)
}

function parseForwardedFor(value) {
    if (typeof value !== 'string') {
        return null
    }

    // x-forwarded-for may return multiple IP addresses in the format:
    // "client IP, proxy 1 IP, proxy 2 IP"
    // Therefore, the right-most IP address is the IP address of the most recent proxy
    // and the left-most IP address is the IP address of the originating client.
    // source: http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/x-forwarded-headers.html
    // Azure Web App's also adds a port for some reason, so we'll only use the first part (the IP)
    const forwardedIps = value.split(',').map((e) => {
        const ip = e.trim()
        if (ip.includes(':')) {
            const splitted = ip.split(':')
            // make sure we only use this if it's ipv4 (ip:port)
            if (splitted.length === 2) {
                return splitted[0]
            }
        }
        return ip
    })

    // Sometimes IP addresses in this header can be 'unknown' (http://stackoverflow.com/a/11285650).
    // Therefore taking the left-most IP address that is not unknown
    // A Squid configuration directive can also set the value to "unknown" (http://www.squid-cache.org/Doc/config/forwarded_for/)
    return forwardedIps.find(isIp)
}

/**
 * Get client ip address from request
 * @see https://github.com/pbojinov/request-ip
 */
function getClientIp(req) {
    // Server is probably behind a proxy.
    if (req.headers) {

        // Standard headers used by Amazon EC2, Heroku, and others.
        if (isIp(req.headers['x-client-ip'])) {
            return req.headers['x-client-ip']
        }

        // Load-balancers (AWS ELB) or proxies.
        const xForwardedFor = parseForwardedFor(req.headers['x-forwarded-for'])
        if (xForwardedFor && isIp(xForwardedFor)) {
            return xForwardedFor
        }

        // Cloudflare.
        // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
        // CF-Connecting-IP - applied to every request to the origin.
        if (isIp(req.headers['cf-connecting-ip'])) {
            return req.headers['cf-connecting-ip']
        }

        // Fastly and Firebase hosting header (When forwared to cloud function)
        if (isIp(req.headers['fastly-client-ip'])) {
            return req.headers['fastly-client-ip']
        }

        // Akamai and Cloudflare: True-Client-IP.
        if (isIp(req.headers['true-client-ip'])) {
            return req.headers['true-client-ip']
        }

        // Default nginx proxy/fcgi alternative to x-forwarded-for, used by some proxies.
        if (isIp(req.headers['x-real-ip'])) {
            return req.headers['x-real-ip']
        }

        // (Rackspace LB and Riverbed's Stingray)
        // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
        // https://splash.riverbed.com/docs/DOC-1926
        if (isIp(req.headers['x-cluster-client-ip'])) {
            return req.headers['x-cluster-client-ip']
        }

        if (isIp(req.headers['x-forwarded'])) {
            return req.headers['x-forwarded']
        }

        if (isIp(req.headers['forwarded-for'])) {
            return req.headers['forwarded-for']
        }

        if (isIp(req.headers.forwarded)) {
            return req.headers.forwarded
        }
    }

    // Remote address checks.
    if (req.connection) {
        if (isIp(req.connection.remoteAddress)) {
            return req.connection.remoteAddress
        }
        if (req.connection.socket && isIp(req.connection.socket.remoteAddress)) {
            return req.connection.socket.remoteAddress
        }
    }

    if (req.socket && isIp(req.socket.remoteAddress)) {
        return req.socket.remoteAddress
    }

    if (req.info && isIp(req.info.remoteAddress)) {
        return req.info.remoteAddress
    }

    // AWS Api Gateway + Lambda
    if (req.requestContext && req.requestContext.identity && isIp(req.requestContext.identity.sourceIp)) {
        return req.requestContext.identity.sourceIp
    }
    return null
}

module.exports = (req, res) => {
    req.ip = getClientIp(req)
}
