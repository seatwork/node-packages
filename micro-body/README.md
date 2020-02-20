A tiny middleware to parse request body for [Zeit's Micro](https://github.com/zeit/micro), but also works well with all standard [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object.

## Installation

```bash
npm install @cloudseat/micro-body
```

## Usage

```js
const body = require('@cloudseat/micro-body')

module.exports = body((req, res) => {
    console.log(req.body)
})
```
