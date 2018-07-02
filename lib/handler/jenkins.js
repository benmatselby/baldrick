const _ = require('underscore')
const jenkinsUrl = process.env.BALDRICK_JENKINS_URL
const jenkinsClient = require('jenkins')({
  baseUrl: jenkinsUrl,
  promisify: true,
  crumbIssuer: true
})
var Job = require('../../lib/jenkins-job')

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

    if (/view/i.test(message.text)) {
      return this.getView(message)
        .then((data) => { return Promise.resolve(data) })
        .catch((err) => { return Promise.reject(err) })
    }

    if (/job/i.test(message.text)) {
      return this.getJob(message)
        .then((data) => { return Promise.resolve(data) })
        .catch((err) => { return Promise.reject(err) })
    }

    return Promise.resolve()
  },

  getJob (message) {
    var jobName = message.text.replace(new RegExp('^.*jenkins job'), '').trim()

    return jenkinsClient.job.get(jobName)
      .then((data) => {
        var fields = []
        var jenkinsJob = new Job(data)
        var overview = jenkinsJob.getOverview()
        _.each(overview, function (info) {
          fields.push({
            title: info.key,
            value: info.value
          })
        })
        var attachments = [
          {
            fallback: jenkinsJob.getName(),
            color: jenkinsJob.getColor(),
            fields: fields
          }
        ]

        var message = {
          text: 'Job',
          attachments: attachments
        }

        return Promise.resolve(message)
      })
      .catch((err) => { return Promise.reject(err) })
  },

  getView (message) {
    var viewName = message.text.replace(new RegExp('^.*jenkins view'), '').trim()

    return jenkinsClient.view.get(viewName)
      .then((data) => {
        var attachments = []

        _.each(data.jobs, function (job) {
          var jenkinsJob = new Job(job)
          var color = jenkinsJob.getColor()
          var name = jenkinsJob.getName()
          var url = jenkinsJob.getUrl()
          attachments.push({
            fallback: name,
            text: '<' + url + '|' + name + '>',
            color: color
          })
        }, this)

        var message = {
          text: 'View',
          attachments: attachments.slice(0, 100) // Should be a config item
        }

        return Promise.resolve(message)
      })
      .catch((err) => {
        return Promise.reject(err)
      })
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
          var jenkinsJob = new Job(job)
          var color = jenkinsJob.getColor()
          var name = jenkinsJob.getName()
          var url = jenkinsJob.getUrl()

          if (color !== 'red' && onlyBad) {
            return
          }

          if (color !== 'blue' && onlyGood) {
            return
          }

          attachments.push({
            fallback: name,
            text: '<' + url + '|' + name + '>',
            color: color
          })
        }, this)

        var message = {
          text: 'List',
          attachments: attachments.slice(0, 100) // Should be a config item
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
    var jobName = message.text.replace(new RegExp('^.*jenkins build'), '')
    var payload = {
      name: jobName.trim()
    }
    return jenkinsClient.job.build(payload)
      .then((data) => {
        var message = {
          text: 'Queued job: ' + jobName + ' #' + data
        }
        return Promise.resolve(message)
      })
      .catch((err) => { return Promise.reject(err) })
  }
}

module.exports = jenkins
