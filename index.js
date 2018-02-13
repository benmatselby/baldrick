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
  // We need to know the bot id before we start processing messages
  if (!config.isBotIdSet()) {
    return
  }

  var botMention = new RegExp('/' + config.getBotId() + '/')
  if (!(botMention.test(message.text) || message.channel.substring(0, 1) === 'D')) {
    return
  }

  // If the bot is the sender of the message, ignore (for now)
  if (message.user === config.getBotId()) {
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
