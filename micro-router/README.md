A smart router middleware for [Zeit's Micro](https://github.com/zeit/micro), but also works well with all standard [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) and [http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) objects.

## Installation

```bash
npm install @cloudseat/micro-router
```

## Usage

```js
const { route, get, post, put, del } = require('@cloudseat/micro-router')

const hello = (req, res) => {
    res.end('hello')
}
const bye = (req, res) => {
    res.end('bye')
}

module.exports = route(
    get('/', hello),
    post('/:token', bye),
    // ...
)
```
