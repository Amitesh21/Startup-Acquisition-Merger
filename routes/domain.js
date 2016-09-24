/**
 * Created by Siddharth on 5/3/2016.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var compSchema = new Schema({
    name: String,
    technologies: Array
});

module.exports = mongoose.model('Technologies',compSchema);