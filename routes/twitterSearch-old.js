var util = require('util'),
    twit = require('twit'),
    sentimentAnalysis = require('./twitterSentimentAnalysis.js');

var config = {
    consumer_key: 'WhYExrBdjaQKyArMvJhxjHiHt',
    consumer_secret: 'WZ81G6ADuk2RJgGRVMsRZMGgJcUudbC7W2xdhTTx1Miqbhr68y',
    access_token: '2433226039-ALNzRIdqRR3StA2GZSXyPDuMJMhp5rm604BWktz',
    access_token_secret: 'nwUXQJsFraf4wd2SB8ls3BKQiB5uAWVEWO1Ea6cLk9ifB'
};


exports.getTweets = function getTweets(comp1, comp2, callback) {
        var twitterClient = new twit(config);
        //console.log(JSON.stringify(twitterClient));
        //var response = [], dbData = []; // to store the tweets and sentiment
        var tweets = [];
        var positive = 0;
        var negative = 0;
        var neutral = 0;
        var tweetsPolarity = [];
        var twitQuery = comp1 + " " + comp2;
        twitterClient.get('search/tweets', {q: twitQuery, count: 50}, function (err, data) {
                var totalTweets = data.statuses;
                // console.log(JSON.stringify(totalTweets));
                for (var i = 0; i < totalTweets.length; i++) {
                    totalTweets[i].text = totalTweets[i].text.replace(/^RT/, "");
                    totalTweets[i].text = totalTweets[i].text.replace(/^ReTw/, "");
                    //totalTweets[i].text = totalTweets[i].text.replace(/@\\w+/g, "");
                    //totalTweets[i].text = totalTweets[i].text.replace(/[[:punct:]]/g, "");
                    //totalTweets[i].text = totalTweets[i].text.replace(/[[:digit:]]/g, "");
                    //totalTweets[i].text = totalTweets[i].text.replace(/http\\w+/g, "");
                    //totalTweets[i].text = totalTweets[i].text.replace(/[ \t]{2,}/g, "");
                    //totalTweets[i].text = totalTweets[i].text.replace(/^\\s+|\\s+$/g, "");

                    tweets.push(totalTweets[i].text);
                    console.log(sentimentAnalysis(tweets[i]));
                    if (sentimentAnalysis(tweets[i]) >= 2) {
                        positive++;
                    }
                    else if (sentimentAnalysis(tweets[i]) >= 0 && sentimentAnalysis(tweets[i]) < 2) {
                        neutral++;
                    }
                    else {
                        negative++;
                    }
                }
                tweetsPolarity.push(positive);
                tweetsPolarity.push(negative);
                tweetsPolarity.push(neutral);
                // console.log(tweets);
                console.log("positive: " + positive + ", negative: " + negative + ", neutral: " + neutral);
                callback(err, tweetsPolarity, tweets);
            }
        );


};