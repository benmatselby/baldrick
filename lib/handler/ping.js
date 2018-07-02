const os = require('os')

/**
 * Simple ping handler
 */
const ping = {
  /**
   * This is the router for ping
   *
   * @param {Object} message See https://api.slack.com/methods/chat.postMessage
   */
  handleMessage (message) {
    var response = {
      text: 'pong from ' + os.hostname()
    }

    return Promise.resolve(response)
  }
}

module.exports = ping
