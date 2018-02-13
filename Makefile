explain:
	# Makefile for the baldrick chat bot
	#
	#
	### Installation
	#
	# New repo from scratch?
	#  -> $$ make clean install
	#
	#
	### Execution
	#
	# Locally:
	#   -> $$ export BALDRICK_SLACK_TOKEN='slack-token'
	#   -> $$ export BALDRICK_JENKINS_URL='https://jenkins.url'
	#   -> $$ node index.js
	#
	# Docker:
	#   -> $$ export BALDRICK_SLACK_TOKEN='slack-token'
	#   -> $$ export BALDRICK_JENKINS_URL='https://jenkins.url'
	#   -> $$ docker run -d --rm -eBALDRICK_SLACK_TOKEN -eBALDRICK_JENKINS_URL benmatselby/baldrick
	#


.PHONY: clean
clean:
	rm -fr node_modules

.PHONY: install
install:
	npm install

.PHONY: docker-build
docker-build:
	docker build -t benmatselby/baldrick .

.PHONY: test
test:
	./node_modules/.bin/mocha --recursive

.PHONY: checkstyle
checkstyle:
	./node_modules/standard/bin/cmd.js
