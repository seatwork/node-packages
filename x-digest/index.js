/**
 +---------------------------------------------------------------+
 | Message digests, ciphers and PKI for Node.js                  |
 +---------------------------------------------------------------+
 | This program is Licensed under MIT license with conditions    |
 | only requiring preservation of copyright and license notices. |
 | Licensed works, modifications, and larger works may be        |
 | distributed under different terms and without source code.    |
 | For more see <https://opensource.org/licenses/MIT>            |
 +---------------------------------------------------------------+
 | @author Ai Chen                                               |
 | @copyright (c) 2020, cloudseat.net                            |
 +---------------------------------------------------------------+
 */
const crypto = require('crypto')

module.exports = {
    /**
     * 产生指定长度的随机字符串
     * @param int length 字符串长度
     * @return string
     */
    random(length) {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex')
    },

    /**
     * md5 散列
     * @param string value
     * @return string 32位散列码
     */
    md5(value) {
        return crypto.createHash('md5').update(value, 'utf-8').digest('hex')
    },

    /**
     * sha1 散列
     * @param string value
     * @return string 40位散列码
     */
    sha1(value) {
        return crypto.createHash('sha1').update(value, 'utf-8').digest('hex')
    },

    /**
     * hmac 散列（相当于带密钥的 sha1）
     * @param string value
     * @param string secret
     * @return string 40位散列码
     */
    hmac(value, secret) {
        return crypto.createHmac('sha1', secret).update(value).digest('hex')
    },

    /**
     * AES 对称加密
     * @param string text 待加密的文本
     * @param string secret 密钥
     * @return string 加密后的 base64 字符串
     */
    aesEncrypt(text, secret) {
        // 对于 aes 算法来说 iv 总是16位
        const IV_LENGTH = 16
        const iv = crypto.randomBytes(IV_LENGTH)
        // 密钥必须为 32 位，所以散列一次以达到所需长度
        secret = this.md5(secret)

        const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv)
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final()
        ])
        // 前置保留 IV 用于解密
        return iv.toString('base64') + '.' + encrypted.toString('base64')
    },

    /**
     * AES 对称解密
     * @param string encrypted 待解密的文本
     * @param string secret 密钥
     * @return string 解密后的文本（失败返回false）
     */
    aesDecrypt(encrypted, secret) {
        // 从密文中获取 IV 前缀
        const parts = encrypted.split('.', 2)
        const iv = Buffer.from(parts.shift(), 'base64')
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.md5(secret), iv)
        try {
            return decipher.update(parts.shift(), 'base64', 'utf8') + decipher.final()
        } catch (e) {
            return false
        }
    },

    /**
     * 生成 PKI 公钥/私钥对
     * @param string passphrase 密钥
     * @retrun object { publicKey, privateKey }
     */
    generateKeyPair(passphrase) {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048, // 模数的位数，即密钥的位数，2048 或以上一般是安全的
            publicExponent: 0x10001, // 指数值，必须为奇数，默认值为 0x10001，即 65537
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8', // 用于存储私钥信息的标准语法标准
                format: 'pem', // base64 编码的 DER 证书格式
                cipher: 'aes-256-cbc', // 加密算法和操作模式
                passphrase
            }
        })
    },

    /**
     * 使用公钥加密数据
     * @param string text 要加密的文本
     * @param string publicKey 公钥
     * @retrun string 加密后的数据
     */
    publicEncrypt(text, publicKey) {
        return crypto.publicEncrypt({
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING // 填充方式，需与解密一致
            },
            Buffer.from(text)
        ).toString('base64')
    },

    /**
     * 使用私钥解密数据
     * @param string encrypted 要解密的文本
     * @param string privateKey 私钥
     * @param string passphrase 生成密钥对时所用密码
     * @retrun string 解密后的数据（失败返回false）
     */
    privateDecrypt(encrypted, privateKey, passphrase) {
        try {
            return crypto.privateDecrypt({
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                    passphrase
                },
                Buffer.from(encrypted, 'base64')
            ).toString()
        } catch (e) {
            return false
        }
    }

}
