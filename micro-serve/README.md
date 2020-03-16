A static serve middleware for ZEIT's Micro.

## Installation

```bash
npm install @cloudseat/micro-serve
```

## Usage

```js
const serve = require('@cloudseat/micro-serve')

// without rewrites
module.exports = serve

// with rewrites
module.exports = (req, res) => {
    return serve(req, res, {
        '/a': '/pages/a.html',
        '/b': '/pages/b.html'
    })
}
```
