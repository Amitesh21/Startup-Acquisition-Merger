/**
 * Created by Siddharth on 4/30/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ruleSchema = new Schema({
    technologies: Array,
    count : Number
});

module.exports = mongoose.model('Rules',ruleSchema);