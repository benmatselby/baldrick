function Job (job) {
  this.job = job
}

Job.prototype.getName = function () {
  if (this.job.url) {
    return this.job.url
      .replace(new RegExp('.+?/job'), '')
      .replace(new RegExp('^/|/$', 'g'), '')
  } else {
    return this.job.name
  }
}

Job.prototype.getColor = function () {
  var color = '#d8d8d8'
  switch (this.job.color) {
    case 'red':
      color = 'danger'
      break
    case 'blue':
      color = 'good'
      break
  }
  return color
}

Job.prototype.getUrl = function () {
  if (!this.job.url) {
    return ''
  }

  return this.job.url
}

module.exports = Job
