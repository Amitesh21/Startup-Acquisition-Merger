/**
 * Created by Siddharth on 4/28/2016.
 */
var mongoose = require('mongoose');
var ejs = require('ejs');
var Company = require('./company-old');
var Rules = require('./rules');
var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

var data = {};
var techsData = {};
var techsNames = [];
var techsCounts = [];

exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */

 exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
  
};

exports.fetchData = function (callback) {
    if(mongoose.connection.readyState!=1)
         mongoose.connect('mongodb://localhost/cmpe239_proj');
    var companySchema = Company;
    
    var companies = [],
        count;

    companySchema.count({}, function (err, cnt) {
        if(err) throw err;

        count = cnt;
        companySchema.find({}, {'_id':0,'__v':0}, function (err, comps) {
            if(err) throw err;

            comps.forEach(function (comp) {
                companies.push(comp);
                if(companies.length==count) {
                    callback(false, companies);
                    mongoose.connection.close();
                }
            });
        });
    });



};

exports.postData = function (rules, callback) {
    if(mongoose.connection.readyState!=1)
         mongoose.connect('mongodb://localhost/cmpe239_proj');
    var rulesSchema = Rules;

    rulesSchema.collection.insert(rules, onInsert);

    function onInsert(err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log(docs);
        }
    }
};

exports.getStats = function (res,compFirst, compSecond, callback) {
    if(mongoose.connection.readyState!=1)
        mongoose.connect('mongodb://localhost/cmpe239_proj');
    var companySchema = Company;
    var rulesSchema;
    var techs1 = [];
    var techs2 = [];
    var techs = [];
    var count;
    var mapData = [];
    var mapKeys = [];


    
    companySchema.find({ name: compFirst }, function(err, comp) {
        if (err) throw err;

        console.log(comp);
        techs1 = comp[0].technologies;
        //
        companySchema.find({ name: compSecond }, function(err, comp) {
            if (err) throw err;

            console.log(comp);
            techs2 = comp[0].technologies;

            rulesSchema = Rules;
            rulesSchema.count({}, function (err, cnt) {
                if(err) throw err;

                count = cnt;
                rulesSchema.find({}, {'_id':0}, function (err, tecs) {
                    if(err) throw err;

                    tecs.forEach(function (tech) {
                        techs.push(tech);
                        if(techs.length==count) {
                            var result = getResult(techs, techs1, techs2);
                            callback(1);
                            console.log(data);
                            for(key in data) {
                                if(data[key]>0) {
                                    mapKeys.push(key);
                                    mapData.push(data[key]);
                                }
                            }
                            techsNames = [];
                            techsCounts =[];
                            localStorage.setItem('sentimentResult',result);
                            for(key in techsData) {
                                techsNames.push(key);
                                techsCounts.push(techsData[key]);
                            }

                            console.log("techs:" + techsNames );
                            res.render('strategy', {
                                result : result,
                                techs : techs,
                                techs1 : techs1,
                                techs2 : techs2,
                                comp1: compFirst,
                                comp2: compSecond,
                                keys : mapKeys,
                                data : mapData,
                                techsNames:techsNames,
                                techsCounts: techsCounts
                            });
                            mongoose.connection.close();
                        }
                    });
                });
            });
        });
    });
};

function getResult(techs, techs1, techs2) {
    console.log("data:\n" + techs1 + "\n" + techs2);
    var results = 0;
    var out = 0;
    if(techs1.length>techs2.length)
        techs1 = removeDuplicates(techs1, techs2);
    else
        techs2 = removeDuplicates(techs2, techs1);

    console.log("data: "+ techs1 + "\n" + techs2);
    if(techs2.length==0)
        results = doCompare(techs1, techs);
    else  {
        getCombos(techs1, techs2);
        console.log(data);
        for(key in data) {
            out = doCompare(data[key],techs);
            data[key] = out;
            results += out;
            console.log("results: " + results);
        }
    }

    results = results/23; //to be changed
    console.log(results*100);
    return results*100;
}

function doCompare(techs1, techs) {
    techs1.sort();
    var temp;
    console.log("data:\n" + techs1);
    for(var i=0; i<techs.length; i++) {
        temp = techs[i].technologies;
        temp.sort();
        if(matchThem(techs1, temp))
            return techs[i].count;
    }
    return 0;
}

function getCombos(techs1, techs2) {
    var len1 = techs1.length,
        len2 = techs2.length;
    if(len1==0||len2==0)
        return;
    temp = techs1.concat(techs2);
    data[temp] = temp;
    if(len1==1&&len2==1) {

    } else if(len1==1) {
        getCombos(techs1, techs2.slice(len2/2));
        getCombos(techs1, techs2.slice(0,len2/2));
    } else {
        getCombos(techs1.slice(len1/2), techs2);
        getCombos(techs1.slice(0,len1/2), techs2);
    }
}

function removeDuplicates(techs1, techs2) {
    var result = [];
    techs1.sort(); techs2.sort();
    for(var j=0; j< techs1.length; j++) {
        for(var i=0; i<techs2.length; i++) {
            if(j<techs1.length) {
                if(techs2[i]==techs1[j]) {
                    console.log("duplicate removed: " + techs1[j]);
                    techsData[techs1[j]] = [1,1];
                    j++;
                }
            }
        }
        if(j<techs1.length) {
            techsData[techs1[j]] = [0,1];
            result.push(techs1[j]);
        }
    }
    return result;
}

function matchThem(one, two) {
    two.sort();
    var i,j;
    if(one.length!=two.length)
        return false;
    for(i=0,j=0;i<one.length && j<two.length;) {
        if (one[i]==two[j]) {
            ++i; ++j;
        } else {
            return false;
        }
    }


    return ((two.length-one.length)==0);
}

exports.fetchRules = function () {

    if(mongoose.connection.readyState!=1)
        mongoose.connect('mongodb://localhost/cmpe239_proj');
    var rulesSchema = Rules;

    var rules = [],
        count;

    rulesSchema.count({}, function (err, cnt) {
        if(err) throw err;

        count = cnt;
        rulesSchema.find({}, {'_id':0}, function (err, rls) {
            if(err) throw err;

            rls.forEach(function (rls) {
                rules.push(rls);
                if(rules.length==count) {
                    return rules;
                    mongoose.connection.close();
                }
            });
        });
    });
};
