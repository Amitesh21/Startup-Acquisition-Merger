/**
 * Created by Siddharth on 4/28/2016.
 */

var mongo = require('./mongo');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
var apr = {};
var rules = [];

function getFrequencies(data) {
    var map = {},
        len = data.length,
        l,
        result = [];
    for(var i=0; i<len; i++) {
        var one = data[i];
        l = one.length;
        for(var j=0; j<l; j++) {
            var v = one[j];
            if (v in map) {
                map[v]++;
            }
            else {
                map[v] = 1;
            }
        }
    }

    console.log(map);
    for(key in map){
        if(map[key]>1)
            result.push(key);
    }
    return result;

}

function subset(one, two) {
    one.sort();
    two.sort();
    var i,j;
    for(i=0,j=0;i<one.length && j<two.length;) {
        if (one[i]<two[j]) {
            ++i;
        } else if (one[i]==two[j]) {
            ++i; ++j;
        } else {
            return false;
        }
    }

    return j == two.length;
}

function doApriori(temp1, temp2, techs) {
    temp1 = temp1.concat(temp2);
    console.log("temps: " + temp1);
    console.log("techs: ");
    for(var i = 0; i<techs.length; i++) {
        if(subset(techs[i],temp1)){
            console.log(techs[i]);
            if(temp1 in apr) {
                apr[temp1]++;
            }
            else {
                apr[temp1] = 1;
            }
        }
    }
}

function splitApr() {
    for(key in apr) {
        values = key.split(",");
        rules.push({'technologies': values, 'count':apr[key]});
    }
}

exports.getApriori = function (req, res) {
    var techs = [],
        len,
        frequencies = [],
        temp1 = [],
        temp2 = [];
    mongo.fetchData(function (err, comps) {
        len = comps.length;
        for(var i=0; i<len; i++) {
            techs.push(comps[i].technologies);
        }
        frequencies = getFrequencies(techs, comps);
        len = frequencies.length;
        for(var k=0; k<len; k++) {
            for(i=k; i<len; i++) {
                temp1.push(frequencies[i]);
                for(var j=i+1; j<len;j++) {
                    // console.log("k: "+ k + " i: "+ i + " j: " + j);
                    if(j<len) {
                        temp2.push(frequencies[j]);
                        doApriori(temp1, temp2, techs);
                        temp2 = [];
                    }
                }
            }
            temp1 = [];
            len = frequencies.length;
        }
        console.log(apr);
        splitApr();
        console.log(rules);
        mongo.postData(rules);
    });

    res.render('apriori');
};
