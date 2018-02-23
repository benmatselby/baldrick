/* global describe it */

process.env.BALDRICK_JENKINS_URL = 'http://example.com'

var assert = require('assert')
var jenkins = require('../../lib/jenkins')
var sinon = require('sinon')

describe('Jenkins Integration', function () {
  describe('Name', function () {
    it('should not route anywhere if key words are not specified', function () {
      var message = {
        text: "something we don't handle"
      }
      sinon.stub(jenkins, 'getList')
      sinon.stub(jenkins, 'buildJob')
      sinon.stub(jenkins, 'getView')
      sinon.stub(jenkins, 'getJob')

      jenkins.handleMessage(message)

      assert.ok(jenkins.getList.notCalled)
      assert.ok(jenkins.buildJob.notCalled)
      assert.ok(jenkins.getView.notCalled)
      assert.ok(jenkins.getJob.notCalled)

      jenkins.getList.restore()
      jenkins.buildJob.restore()
      jenkins.getView.restore()
      jenkins.getJob.restore()
    })
    it('should route to getList if "list" is mentioned', function () {
      var message = {
        text: 'list them'
      }
      sinon.stub(jenkins, 'getList').returns(Promise.resolve())
      sinon.stub(jenkins, 'buildJob')
      sinon.stub(jenkins, 'getView')
      sinon.stub(jenkins, 'getJob')

      jenkins.handleMessage(message)

      assert.ok(jenkins.getList.called)
      assert.ok(jenkins.buildJob.notCalled)
      assert.ok(jenkins.getView.notCalled)
      assert.ok(jenkins.getJob.notCalled)

      jenkins.getList.restore()
      jenkins.buildJob.restore()
      jenkins.getView.restore()
      jenkins.getJob.restore()
    })
  })
})
