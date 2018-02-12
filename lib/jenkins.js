const _ = require('underscore')
const jenkinsClient = require('jenkins')({
  baseUrl: process.env.BALDRICK_JENKINS_URL,
  promisify: true,
  crumbIssuer: true
})

/**
 * Jenkins integration
 */
const jenkins = {
  /**
   * This is the router to all jenkins commands
   *
   * @param {Object} message See https://api.slack.com/methods/chat.postMessage
   */
  handleMessage (message) {
    if (/list/i.test(message.text)) {
      return this.getList(message)
        .then((data) => { return Promise.resolve(data) })
        .catch((err) => { return Promise.reject(err) })
    }

    if (/build/i.test(message.text)) {
      return this.buildJob(message)
        .then((data) => { return Promise.resolve(data) })
        .catch((err) => { return Promise.reject(err) })
    }
    return Promise.resolve()
  },

  /**
   * This retrieves a list of jenkins jobs
   *
   * @param {Object} message
   */
  getList (message) {
    var keywords = message.text.split(' ')
    var onlyGood = false
    var onlyBad = false

    if (!_.isEmpty(_.intersection(keywords, ['success', 'good']))) {
      onlyGood = true
    }

    if (!_.isEmpty(_.intersection(keywords, ['failed', 'broken', 'bad']))) {
      onlyBad = true
    }

    return jenkinsClient.job.list()
      .then((data) => {
        var attachments = []

        _.each(data, function (job) {
          var color = '#d8d8d8'
          switch (job.color) {
            case 'red':
              color = 'danger'
              break
            case 'blue':
              color = 'good'
              break
          }

          if (job.color !== 'red' && onlyBad) {
            return
          }

          if (job.color !== 'blue' && onlyGood) {
            return
          }

          attachments.push({
            fallback: job.name,
            text: '<' + job.url + '|' + job.name + '>',
            color: color
          })
        })

        var message = {
          text: 'List',
          attachments: attachments.slice(0, 100), // Should be a config item
          as_user: true
        }

        return Promise.resolve(message)
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },

  /**
   * Build a jenkins job
   *
   * @param {Object} message
   */
  buildJob (message) {
    var jobName = message.text.replace('jenkins build', '')
    var payload = {
      name: jobName.trim()
    }
    return jenkinsClient.job.build(payload)
      .then((data) => {
        var message = {
          text: 'Queued job: ' + jobName + ' #' + data,
          as_user: true
        }
        return Promise.resolve(message)
      })
      .catch((err) => { return Promise.reject(err) })
  }
}

module.exports = jenkins
