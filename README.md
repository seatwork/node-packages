Integrates some super tiny middlewares and utils for [Zeit's Micro](https://github.com/zeit/micro).

## Middlewares
- [micro-body](https://github.com/seatwork/micro-middlewares/tree/master/micro-body)
- [micro-cors](https://github.com/seatwork/micro-middlewares/tree/master/micro-cors)
- [micro-router](https://github.com/seatwork/micro-middlewares/tree/master/micro-router)

## Utils
- [http-client](https://github.com/seatwork/micro-middlewares/tree/master/http-client)
- [x-ip](https://github.com/seatwork/micro-middlewares/tree/master/x-ip)

## Installation
```bash
npm install @cloudseat/micro-app
```

## Usage
```js
const app = require('@cloudseat/micro-app')
const { get, post, put, del } = require('@cloudseat/micro-router')
const cors = {
    allowOrigins: ['example.com']
}
module.exports = app(cors)(
    get('/', require('./api/index.js')),
    post('/user', require('./api/user.js')),
    // ...
)
```
