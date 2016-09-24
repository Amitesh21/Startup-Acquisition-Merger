/**
 * Created by Siddharth on 4/28/2016.
 */
var mongo = require('./mongo');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

exports.getStats = function (req, res) {
    var compFirst = localStorage.getItem('compFirst');
    var compSecond = localStorage.getItem('compSecond');

    mongo.getStats(res,compFirst, compSecond, function (results) {
        console.log(results);
    });
};
