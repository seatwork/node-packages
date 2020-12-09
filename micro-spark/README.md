# Micro-spark

Micro-spark is a fast, lightweight, independent HTTP microserver. It's only about 25kB and does not have any extra dependencies.

## Installation
```bash
npm install micro-spark
```

## Usage

### Get started
```js
const app = require('micro-spark')
app.start() 

app.get('/:name', (req, res) => {
    res.send('hello, ' + req.params.name)
})
```

### App Methods
- start([port], [callback])
- serve(staticFilesRoot)

- get(path, handler)
- post(path, handler)
- put(path, handler)
- del(path, handler)
- head(path, handler)
- patch(path, handler)
- opt(path, handler)
- all(path, handler)

- use(middleware)
```js
app.use((req, res) => {
    // do something
})
```

- cors(options)
```js
app.cors({
    allowCredentials: true,
    allowOrigins: ['*'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    allowHeaders: ['Authorization', 'Accept', 'Content-Type'],
    exposeHeaders: [],
    maxAge: 3600 * 24
})
// or use default options
// app.cors()
```

- engine(templateRoot, helpers)
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

### App Properties
- server (Original server instance)

### Request Properties
- req.cookies
- req.ip
- req.protocol
- req.body
- req.params
- req.query

### Response Methods
- res.setCookie(key, value, options)
- res.send([status], data)
- res.render(template, data)
- res.serve(staticFilePath)

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
