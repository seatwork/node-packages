# Google Drive Index

## Installation
```
npm install godrive
```

## Init
```js
const GoogleDrive = require('godrive')
const gd = new GoogleDrive({
  root_id: '',          // google drive folder id, default 'root',
  client_id: '',        // google drive api client_id
  client_secret: '',    // google drive api client_secret
  refresh_token: '',    // google drive api refresh_token
})
```

## Methods
```js
await gd.getMetadata(path)
await gd.getObjects(id)
await gd.getRawContent(id, range)
```

## Properties
```js
gd.folderType
```
