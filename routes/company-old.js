/**
 * Created by Siddharth on 4/28/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var compSchema = new Schema({
    name: String,
    technologies: Array
});

module.exports = mongoose.model('Technologies',compSchema);