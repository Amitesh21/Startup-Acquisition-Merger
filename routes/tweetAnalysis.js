/**
 * Created by Siddharth on 4/27/2016.
 */
var mysql = require('./mysql');
var tweetStats = require('./twitterSearch');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

exports.getStats = function (req, res) {

    var compFirst = localStorage.getItem('compFirst');
    var compSecond = localStorage.getItem('compSecond');
    var polarity = [];
    tweetStats.getTweets1(compFirst, function (err, result, twits) {
        if (err) {

            throw err;
        }

        polarity = result;
        var tweets = twits;
        console.log("hello pol..." + polarity);

        tweetStats.getTweets1(compSecond, function (err, result1, twits1) {

            if (err) {

                throw err;
            }

            tweets = tweets.concat(twits1);
            console.log("tweetAnalysis sid");
            console.log("tweetAnalysis1"+polarity[0]+" "+polarity[1]+" "+polarity[2]);
            console.log("tweetAnalysis1"+result1[0]+" "+result1[1]+" "+result1[2]);
            polarity[0] = parseInt(result1[0]) + parseInt(polarity[0]);
            polarity[1] = parseInt(result1[1]) + parseInt(polarity[1]);
            polarity[2] = parseInt(result1[2]) + parseInt(polarity[2]);
            console.log("tweetAnalysis2"+polarity[0]+" "+polarity[1]+" "+polarity[2]);

            res.render('sentiment', {
                polarity: polarity,
                tweets: tweets,
                compFirst: compFirst,
                compSecond: compSecond
            });

        });

    });

};