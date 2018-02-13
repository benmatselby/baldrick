const token = process.env.BALDRICK_SLACK_TOKEN
const { WebClient, RtmClient, RTM_EVENTS } = require('@slack/client')
const rtm = new RtmClient(token, {
  dataStore: false,
  useRtmConnect: true
})
const slack = new WebClient(token)
const jenkins = require('./lib/jenkins')
const config = require('./lib/config')

// Might be a better way of doing this?
slack.auth.test()
  .then((res) => {
    config.setBotId(res.user_id)
    config.setBotName(res.user)
  })

rtm.on(RTM_EVENTS.CHANNEL_JOINED, (message) => {
  slack.chat.postMessage(message.channel.id, config.getChannelJoinedMsg(), {as_user: true})
    .then((res) => { })
    .catch(console.error)
})

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (!config.isBotIdSet()) {
    return
  }

  if (message.type === 'message' &&
    /jenkins/i.test(message.text) &&
    message.user !== config.getBotId()) {
    jenkins.handleMessage(message)
      .then(data => {
        if (data && data.text) {
          slack.chat.postMessage(message.channel, data.text, data)
            .then((res) => { })
            .catch(console.error)
        }
      })
     .catch((err) => (
        slack.chat.postMessage(message.channel, err.message, {as_user: true})
          .then((res) => { })
          .catch(console.error(err))
     ))
  }
})

rtm.start()
