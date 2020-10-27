# Micro-spark

Micro-spark is a fast, lightweight, independent HTTP microserver. It's only less than 30kB and does not have any extra dependencies.

## Installation

```bash
npm install micro-spark
```

## Usage

### Get started

```js
const app = require('micro-spark')
app.listen() 
// or app.listen(6060)

app.get('/api/:name', (req, res) => {
    console.log(req.ip)
    console.log(req.body)
    res.send(200, 'hello, ' + req.params.name)
})
// or app.post, app.put, app.del, app.head, app.patch, app.opt
```

### Use CORS

```js
app.cors({
    allowCredentials: true,
    allowOrigins: ['*'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    allowHeaders: ['Authorization', 'Accept', 'Content-Type'],
    exposeHeaders: [],
    maxAge: 60 * 60 * 24
})
// or use default options
// app.cors()
```

### Use middleware

```js
app.use((req, res) => {
    // do something
})
```

### Serve static resources

```js
// set resources root
app.serve('/public')

// or assign specific files
app.get('/(.+).(js|css|jpg|png)')

// or rewrite route to specific file
app.get('/:page', (req, res) => {
    res.serve('/public/' + req.params.page + '.html')
})
```

### Use template engine
Depends on [art-template](https://www.npmjs.com/package/art-template)).

```js
// set template root
// the template file must end with ".html"
app.engine('/templates')
app.get('/:page', (req, res) => {
    res.render(req.params.page, {
        title: 'hello'
    })
})
```

### Original server instance

```js
app.server
```
