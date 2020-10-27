# x-digest

Message digests, ciphers and PKI for Node.js.

## Installation

```bash
npm install x-digest
```

## Usage

```js
const digest = require('x-digest')
const text = 'hello world! 你好，世界！'
const secret = 'i am a secret'

console.log('random =', digest.random(32))
console.log('md5 =', digest.md5(text))
console.log('sha1 =', digest.sha1(text))
console.log('hmac =', digest.hmac(text, secret))

const aesEncrypted = digest.aesEncrypt(text, secret)
console.log('aes encrypted =', aesEncrypted)
console.log('aes decrypted =', digest.aesDecrypt(aesEncrypted, secret))

const keyPair = digest.generateKeyPair(secret)
console.log(keyPair.publicKey)
console.log(keyPair.privateKey)

const encrypted = digest.publicEncrypt(text, keyPair.publicKey)
console.log('public encrypted =', encrypted)
console.log('private decrypted =', digest.privateDecrypt(encrypted, keyPair.privateKey, secret))
```
