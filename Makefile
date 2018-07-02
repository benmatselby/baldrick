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
	mkdir -p buld/coverage

.PHONY: install
install:
	npm install

.PHONY: docker-build
docker-build:
	docker build -t benmatselby/baldrick .

.PHONY: test
test:
	./node_modules/.bin/mocha --recursive

.PHONY: test-cov
test-cov:
	./node_modules/.bin/nyc --report-dir ./build/coverage --reporter=html --reporter=text --temp-directory ./build/coverage ./node_modules/.bin/mocha --recursive

.PHONY: vet
vet:
	./node_modules/standard/bin/cmd.js
