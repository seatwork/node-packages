# x-ip

A simple util to determine request client ip address. It could works well with all standard [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) and [http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) objects.

## Installation

```bash
npm install x-ip
```

## Usage

```js
const getIp = require('x-ip')

module.exports = (req, res) => {
    res.end(getIp(req))
}
```
