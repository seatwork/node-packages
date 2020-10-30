/**
 +---------------------------------------------------------------+
 | Google Drive Index                                            |
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
const querystring = require('querystring')
const fetch = require('node-fetch')
const googleApi = 'https://www.googleapis.com'

module.exports = class {
    /**
     * config = { root_id, client_id, client_secret, refresh_token }
     */
    constructor(config) {
        this.config = config
        this.authApi = googleApi + '/oauth2/v4/token'
        this.driveApi = googleApi + '/drive/v3/files'
        this.folderType = 'application/vnd.google-apps.folder'
        this.fileAttrs = 'id, name, mimeType, size, modifiedTime, description, iconLink, thumbnailLink, imageMediaMetadata'
        this.metaCache = {
            '/': {
                id: config.root_id || 'root',
                mimeType: this.folderType
            }
        }
    }

    async getMetadata(path) {
        path = path.startsWith('/') ? path : '/' + path
        path = path.endsWith('/') ? path : path + '/'

        if (!this.metaCache[path]) {
            let fullpath = '/'
            let metadata = this.metaCache[fullpath]
            const fragments = this._trim(path, '/').split('/')

            for (let name of fragments) {
                fullpath += name + '/'

                if (!this.metaCache[fullpath]) {
                    name = decodeURIComponent(name).replace(/\'/g, "\\'")
                    const result = await this._queryDrive({
                        q: `'${metadata.id}' in parents and name = '${name}' and trashed = false`,
                        fields: `files(${this.fileAttrs})`,
                    })
                    this.metaCache[fullpath] = result.files[0]
                }
                metadata = this.metaCache[fullpath]
                if (!metadata) break
            }
        }
        return this.metaCache[path]
    }

    async getObjects(id) {
        let pageToken
        const list = []
        const params = {
            pageSize: 1000,
            q: `'${id}' in parents and trashed = false AND name != '.password'`,
            fields: `nextPageToken, files(${this.fileAttrs})`,
            orderBy: 'folder, name'
        }

        do {
            if (pageToken) params.pageToken = pageToken
            const result = await this._queryDrive(params)
            pageToken = result.nextPageToken
            list.push(...result.files)
        } while (
            pageToken
        )
        return list
    }

    async getRawContent(id, range) {
        const response = await fetch(this.driveApi + '/' + id + '?alt=media', {
            headers: {
                Range: range || '',
                Authorization: 'Bearer ' + (await this._getAccessToken())
            }
        })
        if (response.status < 400) {
            return response.body
        }
        const result = await response.json()
        const error = new Error(result.error.message)
        error.status = response.status
        throw error
    }

    async _queryDrive(params) {
        const driveUrl = this.driveApi + '?' + querystring.stringify(params)
        const response = await fetch(driveUrl, {
            headers: {
                Authorization: 'Bearer ' + (await this._getAccessToken())
            }
        })
        const result = await response.json()
        if (result.error) {
            if (result.error.message.startsWith('User Rate Limit Exceeded')) {
                return this._queryDrive(params)
            }
            const error = new Error(result.error.message)
            error.status = response.status
            throw error
        }
        return result
    }

    async _getAccessToken() {
        if (this.config.expires && this.config.expires > Date.now()) {
            return this.config.access_token
        }
        const response = await fetch(this.authApi, {
            method: 'POST',
            body: querystring.stringify({
                client_id: this.config.client_id,
                client_secret: this.config.client_secret,
                refresh_token: this.config.refresh_token,
                grant_type: 'refresh_token'
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const result = await response.json()
        if (result.error) {
            const error = new Error(result.error_description)
            error.status = response.status
            throw error
        }
        this.config.expires = Date.now() + 3500 * 1000
        this.config.access_token = result.access_token
        return this.config.access_token
    }

    _trim(string, char) {
        return char ?
            string.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '') :
            string.replace(/^\s+|\s+$/g, '')
    }
}
