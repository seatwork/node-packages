A super lightweight HTTP / HTTPS client can be used in any Node.js project. Although it's not as powerful as request / axios / superagent, it is sufficient for common development scenarios, such as calling third-party APIs and obtaining remote pictures.

## Installation

```bash
npm install x-quest
```

## Usage

```js
const http = require('x-quest')

const result = await http.get(url[, options])
const result = await http.post(url[, data][, options])
const result = await http.put(url[, data][, options])
const result = await http.del(url[, options])
const result = await http.request(options)
```

## Parameters

* **`url`** - Request url. Supports http/https protocol.
* **`data`** - Send data. Supports `string`, `json object`, `buffer`, `arraybuffer`and `stream`.
* **`options`**
  * **`method`** - `GET`(default), `POST`, `PUT`, `DELETE`.
  * **`headers`** - The `Content-Type` defaults to `application/json`.
  * **`responseType`** - Supports `arraybuffer`, `stream` or `null`.
