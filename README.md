Baldrick
========

[![Build Status](https://travis-ci.org/benmatselby/baldrick.png?branch=master)](https://travis-ci.org/benmatselby/baldrick)

A slack bot that can do stuff for the team

## Configuration

```
$ export BALDRICK_SLACK_TOKEN='slack-token'
$ export BALDRICK_JENKINS_URL='https://jenkins.url'
```

## What can we do

* `jenkins list [broken|bad|failed|good|success]` - Displays a list of Jenkins jobs
* `jenkins build [job name[` - Build a Jenkins job
