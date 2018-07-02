const token = process.env.BALDRICK_SLACK_TOKEN
const { WebClient, RTMClient } = require('@slack/client')
const rtm = new RTMClient(token, {})
const slack = new WebClient(token)
const jenkins = require('./lib/handler/jenkins')
const config = require('./lib/config')

// Might be a better way of doing this?
slack.auth.test()
  .then((res) => {
    config.setBotId(res.user_id)
    config.setBotName(res.user)
  })

rtm.on('channel_joined', (message) => {
  slack.chat.postMessage({channel: message.channel.id, text: config.getChannelJoinedMsg(), as_user: true})
    .then((res) => { })
    .catch(console.error)
})

rtm.on('message', (message) => {
  // We need to know the bot id before we start processing messages
  if (!config.isBotIdSet()) {
    return
  }

  // If the bot is the sender of the message, ignore (for now)
  if (message.user === config.getBotId()) {
    return
  }

  var botMention = new RegExp(config.getBotId())
  if (!(botMention.test(message.text) || message.channel.substring(0, 1) === 'D')) {
    return
  }

  if (message.type === 'message' && /jenkins/i.test(message.text)) {
    jenkins.handleMessage(message)
      .then(data => {
        if (data && data.text) {
          slack.chat.postMessage({channel: message.channel, text: data.text, attachments: data.attachments, as_user: true})
            .then((res) => { })
            .catch(console.error)
        }
      })
      .catch((err) => {
        slack.chat.postMessage({channel: message.channel, text: err.message, as_user: true})
          .then((res) => { })
          .catch(console.error)
      })
  }
})

rtm.start()
