# Baldrick

A slack bot that can do stuff for the team

## What we can do

- `jenkins list [broken|bad|failed|good|success]` - Displays a list of jenkins jobs
- `jenkins build [job name]` - Build a Jenkins job
- `jenkins job [job name]` - Get some overview of the job
- `jenkins view [view name]` - Display a list of jenkins jobs from the view

## Configuration

```shell
export BALDRICK_SLACK_TOKEN='slack-token'
export BALDRICK_JENKINS_URL='https://jenkins.url'
```

## Installation

You can check this out from git and run that way, or in a docker container

### Git

```shell
git clone git@github.com:benmatselby/baldrick.git
cd baldrick
make clean install
node index.js
```

### Docker

```bash
$ docker run \
    -d \
    --rm \
    -eBALDRICK_SLACK_TOKEN \
    -eBALDRICK_JENKINS_URL \
    benmatselby/baldrick
```
