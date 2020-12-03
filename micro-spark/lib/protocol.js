function getProtocol(req) {
    let proto = req.connection.encrypted ? 'https' : 'http'
    proto = req.headers['x-forwarded-proto'] || proto // only do this if you trust the proxy
    return proto.split(/\s*,\s*/)[0]
}

module.exports = (req, res) => {
    req.protocol = getProtocol(req)
}
