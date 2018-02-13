const config = {
  botId: null,
  botName: null,
  // Needs moving to a config file
  channelJoinedMsg: 'Thank you very much, my lord.',

  getBotId () {
    return this.botId
  },

  setBotId (botId) {
    this.botId = botId
  },

  isBotIdSet () {
    return this.botId !== null
  },

  getBotName () {
    return this.botName
  },

  setBotName (botName) {
    this.botName = botName
  },

  getChannelJoinedMsg () {
    return this.channelJoinedMsg
  }
}

module.exports = config
