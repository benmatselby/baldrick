/* global describe it */
var assert = require('assert')
var Job = require('../../lib/jenkins-job')

describe('Jenkins Job', function () {
  describe('Name', function () {
    it('should be able to get you a decent name from the url if present', function () {
      var job = new Job({
        'url': 'https://ci.jenkins.org/job/build-job/job/job-name/'
      })

      assert.equal(job.getName(), 'build-job/job/job-name')
    })
    it('should default back to jenkins name if no url present', function () {
      var job = new Job({
        'name': 'just-a-name'
      })

      assert.equal(job.getName(), 'just-a-name')
    })
  })
  describe('Url', function () {
    it('should return url if present', function () {
      var job = new Job({
        'url': 'https://ci.jenkins.org/job/build-job/job/job-name/'
      })

      assert.equal(job.getUrl(), 'https://ci.jenkins.org/job/build-job/job/job-name/')
    })
    it('should return an empty url if present from jenkins api', function () {
      var job = new Job({})

      assert.equal(job.getUrl(), '')
    })
  })
  describe('Color', function () {
    it('should return "danger" for bad builds', function () {
      var job = new Job({
        'color': 'red'
      })

      assert.equal(job.getColor(), 'danger')
    })
    it('should return "good" for good builds', function () {
      var job = new Job({
        'color': 'blue'
      })

      assert.equal(job.getColor(), 'good')
    })
    it('should return "#d8d8d8" for non descript builds', function () {
      var job = new Job({
        'color': ''
      })

      assert.equal(job.getColor(), '#d8d8d8')
    })
  })
})
