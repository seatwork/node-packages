# Micro-body

A tiny middleware to parse request body for [Vercel Micro Framework](https://github.com/vercel/micro), but also works well with all standard [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object.

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
