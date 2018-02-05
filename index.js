const _ = require('underscore')
const token = process.env.BALDRICK_SLACK_TOKEN
const { WebClient, RtmClient, RTM_EVENTS } = require('@slack/client')
const rtm = new RtmClient(token, {
  dataStore: false,
  useRtmConnect: true
})
const slack = new WebClient(token)
const jenkins = require('jenkins')({ baseUrl: process.env.BALDRICK_JENKINS_URL })

console.log('Jenkins: ' + process.env.BALDRICK_JENKINS_URL)

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (message.type === 'message' && /jenkins list/i.test(message.text)) {
    var channel = message.channel
    var keywords = message.text.split(' ')
    var onlyGood = false
    var onlyBad = false

    if (!_.isEmpty(_.intersection(keywords, ['success', 'good']))) {
      onlyGood = true
    }

    if (!_.isEmpty(_.intersection(keywords, ['failed', 'broken', 'bad']))) {
      onlyBad = true
    }

    jenkins.job.list(function (err, data) {
      if (err) {
        slack.chat.postMessage(channel, 'Whoopsie daisy... Unable to get a list of Jenkins jobs')
            .then((res) => { })
            .catch(console.error)
        return
      }

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
        attachments: attachments.slice(0, 100), // Should be a config item
        as_user: true
      }

      slack.chat.postMessage(channel, 'Jenkins jobs', message)
                .then((res) => { })
                .catch(console.error)
    })
  }
})

rtm.start()
