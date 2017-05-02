/**
 * SenderSMS.pl library implementation
 */

const oauth = require('simple-oauth2');
const methods = require('./methods');
const request = require('request');

class SenderSMS {
  /**
   * @param config: { clientId, clientSecret, accessTokenUri }
   */
  constructor(config) {
    Object.assign(this, config, methods);
    this.checkConfig();
    this.oauth = oauth.create(this.credentials);
    this.client = this.connect();
  }

  /**
   * Getter return credentials for oauth
   */
  get credentials() {
    return {
      client: {
        id: this.clientId,
        secret: this.clientSecret
      },
      auth: {
        tokenHost: this.accessTokenUri
      }
    };
  }

  /**
   * getter returns token for oauth
   */
  get tokenConfig() {
    return {
      username: this.username,
      password: this.password,
      scope: 'read write',
      grant_type: 'password' // eslint-disable-line camelcase
    };
  }
  /**
   * Method checks config
   */
  checkConfig() {
    const ifNotExistsThrow = item => {
      if (!this.hasOwnProperty(item)) throw new Error(`${item} is required`);
    };

    ['username',
      'password',
      'accessTokenUri',
      'clientId',
      'clientSecret',
      'apiUrl'].forEach(ifNotExistsThrow);
  }

  connect() {
    return this.oauth.ownerPassword
      .getToken(this.tokenConfig)
      .then((result) => this.token = this.oauth.accessToken.create(result))
      .catch((error) => console.error('Access Token error', error.message));
  }

  checkToken() {
    if (this.token.expired()) {
      return this.token
        .refresh()
        .then((result) => this.token = result);
    }
    return Promise.resolve(this.token);
  }

  /**
   * Get instance of connection
   */
  get connection() {
    return this.client
      .then(() => this.checkToken());
  }

  request(o) {
    console.info('sending request with params', o);
    return this.connection
      .then(() => this.promisifyRequest(o))
      .catch(err => console.error(err.message));
  }

  promisifyRequest(o) {
    const { token_type, access_token } = this.token.token;  // eslint-disable-line camelcase

    return new Promise((resolve, reject) => {
      request({
        url: `${this.apiUrl}${o.uri}`,
        method: o.method || 'GET',
        qs: o.qs || {},
        auth: {
          [token_type]: access_token  // eslint-disable-line camelcase
        }
      }, function(err, res) {
        err ? reject(err) : resolve(res);
      });
    });
  }
}

module.exports = SenderSMS;