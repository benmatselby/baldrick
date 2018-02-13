/* global describe it */
var assert = require('assert')
var config = require('../../lib/config')

describe('Config', function () {
  it('should be able set and get the bot id', function () {
    config.setBotId('9812321')
    assert.equal(config.getBotId(), '9812321')
  })
  it('should know if the bot id has been set', function () {
    config.setBotId('9812321')
    assert.equal(config.isBotIdSet(), true)
  })
  it('should be able to set and get the bot name', function () {
    config.setBotName('dave')
    assert.equal(config.getBotName(), 'dave')
  })
  it('should be able to return the channel joined message', function () {
    config.setBotName('dave')
    assert.equal(config.getChannelJoinedMsg(), 'Thank you very much, my lord.')
  })
})
