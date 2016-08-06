/**
 * Created by vijeshjain on 4/23/2015.
 */
var sentiment = require('sentiment');

module.exports = function(text) {
    return sentiment(text).score;
};