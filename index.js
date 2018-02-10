const token = process.env.BALDRICK_SLACK_TOKEN
const { WebClient, RtmClient, RTM_EVENTS } = require('@slack/client')
const rtm = new RtmClient(token, {
  dataStore: false,
  useRtmConnect: true
})
const slack = new WebClient(token)
const jenkins = require('./lib/jenkins')

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (message.type === 'message' && /jenkins/i.test(message.text)) {
    jenkins.handleMessage(message)
      .then(data => (
        slack.chat.postMessage(message.channel, data.text, data)
          .then((res) => { })
          .catch(console.error)
     ))
     .catch(() => (
        slack.chat.postMessage(message.channel, 'Something went wrong with the space time continuum', {as_user: true})
          .then((res) => { })
          .catch(console.error)
     ))
  }
})

rtm.start()
