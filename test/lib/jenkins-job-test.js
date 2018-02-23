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
  describe('Description', function () {
    it('should return descripton', function () {
      var job = new Job({
        'description': 'This is the description'
      })

      assert.equal(job.getDescription(), 'This is the description')
    })
  })
  describe('Health Report', function () {
    it('should build an array of health data', function () {
      var job = new Job({
        healthReport: [
          {
            description: 'Item 1'
          },
          {
            description: 'Item 2'
          }
        ]
      })

      var expected = ['Item 1', 'Item 2']
      assert.deepEqual(job.getHealthReport(), expected)
    })
  })
  describe('Overview', function () {
    it('should build a neat array with information', function () {
      var job = new Job({
        name: 'The job',
        description: 'The description',
        healthReport: [
          {
            description: 'Item 1'
          },
          {
            description: 'Item 2'
          }
        ]
      })

      var expected = [
        {
          key: 'Name',
          value: 'The job'
        },
        {
          key: 'Description',
          value: 'The description'
        },
        {
          key: 'Health',
          value: 'Item 1\nItem 2'
        }
      ]
      assert.deepEqual(job.getOverview(), expected)
    })
  })
})
