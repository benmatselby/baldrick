const config = {
  botId: null,
  botName: null,

  getBodId () {
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
  }
}

module.exports = config
