# Micro-cors

A simple CORS middleware for [Vercel Micro Framework](https://github.com/vercel/micro), but also works well with all standard [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) and [http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) objects.

## Installation

```bash
npm install @cloudseat/micro-cors
```

## Usage

```js
const cors = require('@cloudseat/micro-cors')

module.exports = cors()((req, res) => {
    res.end('hello')
})
```

or sets some options:

```js
const cors = require('@cloudseat/micro-cors')
const options = {
    allowCredentials: true, // default
    allowOrigins: ['a.com', 'b.com'], // default ['*']
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // default
    allowHeaders: ['Authorization', 'Accept', 'Content-Type'], // default
    exposeHeaders: [], // default
    maxAge: 60 * 60 * 24 // defaults to 24 hours
}

module.exports = cors(options)((req, res) => {
    res.end('hello')
})
```
