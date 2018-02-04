const _ = require('underscore');
const { WebClient, RtmClient, RTM_EVENTS } = require('@slack/client');
const token = process.env.BALDRICK_SLACK_TOKEN;

const rtm = new RtmClient(token, {
  dataStore: false,
  useRtmConnect: true,
});

const slack = new WebClient(token);
const jenkins = require('jenkins')({ baseUrl: process.env.BALDRICK_JENKINS_URL });

console.log('Jenkins: '+process.env.BALDRICK_JENKINS_URL);

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    if (message.type === 'message' && /jenkins list/i.test(message.text)) {
        var channel = message.channel;


        jenkins.job.list(function(err, data) {
            if (err) {
                slack.chat.postMessage(channel, 'Whoopsie daisy... Unable to get a list of Jenkins jobs')
                    .then((res) => {})
                    .catch(console.error);
                return;
            }

            var attachments = [],
                counter = 0;

            _.each(data, function(job) {
                if (counter > 30) {
                    return false;
                }

                switch (job.color) {
                    case "red":
                        color = "danger";
                        break;
                    case "blue":
                        color = "good";
                        break;
                    default:
                        color = "#d8d8d8";
                        break;
                }

                attachments.push({
                    fallback: job.name,
                    text: "<" + job.url + "|" + job.name + ">",
                    color: color
                });
                counter++;
            });

            var message = {
                attachments: attachments,
                as_user: true
            }

            slack.chat.postMessage(channel, 'Jenkins jobs', message)
                .then((res) => {})
                .catch(console.error);
        });
    }
});

rtm.start();
