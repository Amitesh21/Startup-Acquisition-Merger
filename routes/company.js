/*

var mysql = require('./mysql');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/cmpe239_proj";

var tweetStats = require('./twitterSearch');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

exports.getStatsCompany = function (req, res) {
	
	console.log(req.body.id);
		
	if(req.body.id == "1" && localStorage.getItem('set')==1){
		 comp = localStorage.getItem('compFirst');
	}
	else if(req.body.id == "2" && localStorage.getItem('set')==1){
        comp = localStorage.getItem('compSecond');
    }
	else{
		res.send({"status":"400","msg":"something went wrong, please try again"});
	}	
		 
        var getStats = "select * from mytable1 where Company_Name=";
        getStats+="'"+comp+"'";
        var polarity = [];
        tweetStats.getTweets1(comp, function (err, result, twits) {
            if (err) {

                throw err;
            }

            polarity = result;
            var tweets = twits;
            console.log("hello pol..." + polarity);
            mysql.fetchData(getStats, function (err, rows) {
                if (rows.length < 3) {
                	res.render('index', {error: "Error"});
                    console.log(err);
                }
                else {
                    console.log("pol..." + polarity);
                    var comp = [];
                    var comp2 = [];
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].Company_Name === comp) {
                            comp.push(rows[i]);
                        }

                    }

                    var EV1 = [];
                    var EV2 = [];
                    //var asset_ratio1 = [];
                    //var asset_ratio2 = [];
                    var operating_MarginRatio1 = [];
                    var operating_MarginRatio2 = [];
                    var debt_equity1 = [];
                    var debt_equity2 = [];
                    var year = [];


                    for (var i = 0; i < 3; i++) {

                        var counter = 0;
                        EV1.push((comp[i].Total_Assets - comp[i].Total_Liabilities));
                        debt_equity1.push((comp[i].Total_Liabilities / EV1[i]));
                        operating_MarginRatio1.push((comp[i].EBITDA / comp[i].total_revenue));
                       
                    }
                    
                	mongo.connect(mongoURL, function(){
                		console.log('Connected to mongo at: ' + mongoURL);
                		var coll = mongo.collection('domainStack');
                		
                		coll.findOne({"companyName": comp}, function(err, companyDetails){
                			if(companyDetails){
                				
                				console.log(companyDetails.companyName);
                				localStorage.setItem('comp', comp);
                                localStorage.setItem('polarity', polarity);
                                localStorage.setItem('tweets', tweets);
                                localStorage.setItem('set', 1);
                               
                                res.send({
                                	"status":"200",
                                    "rows": rows,
                                    "company1Name":localStorage.getItem("compFirst"),
                                    "company2Name":localStorage.getItem("compSecond"),
                                    "comp1": comp,
                                    "polarity": polarity,
                                    "tweets": tweets,
                                    "finalPercent": 0,
                                    "companyDetails":companyDetails
                                });
                				
                				
                			}else{
                				var result={"status":"400","msg":"Something went wrong, Please try again"};
                			}
                			
                		});
                	});

                }
               
            });
        });


};

*/



var mysql = require('./mysql');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/cmpe239_proj";

var tweetStats = require('./twitterSearch');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

exports.getStatsCompany = function (req, res) {
	
	console.log(req.body.id);
		
	if(req.body.id == "1" && localStorage.getItem('set')==1){
		 comp = localStorage.getItem('compFirst');
        console.log("in company"+comp);
	}
	else if(req.body.id == "2" && localStorage.getItem('set')==1){
        comp = localStorage.getItem('compSecond');
    }
	else{
		res.send({"status":"400","msg":"something went wrong, please try again"});
	}	
        
        var getStats = "select * from mytable1 where Company_Name=";
        getStats+="'"+comp+"'";
        var polarity = [];
        tweetStats.getTweets1(comp, function (err, result, twits) {
            if (err) {

                throw err;
            }

            polarity = result;
            var tweets = twits;
            // console.log("hello pol..." + polarity);

            console.log("in company"+comp);
            mysql.fetchData(getStats, function (err, rows) {
                console.log("here?");
                if (rows.length < 3) {
                	res.render('index', {error: "Error"});
                    console.log(err);
                }
                else {
                    // console.log("pol..." + polarity);
                    var comp1 = [];
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].Company_Name.toLowerCase() === comp) {
                            comp1.push(rows[i]);
                        }

                    }

                    var EV1 = [];
                    var EV2 = [];
                    //var asset_ratio1 = [];
                    //var asset_ratio2 = [];
                    var operating_MarginRatio1 = [];
                    var operating_MarginRatio2 = [];
                    var debt_equity1 = [];
                    var debt_equity2 = [];
                    var year = [];


                    for (var i = 0; i < 3; i++) {

                        var counter = 0;
                        EV1.push((comp1[i].Total_Assets - comp1[i].Total_Liabilities));
                        debt_equity1.push((comp1[i].Total_Liabilities / EV1[i]));
                        operating_MarginRatio1.push((comp1[i].EBITDA / comp1[i].total_revenue));
                       
                    }
                    
                	mongo.connect(mongoURL, function(){
                		// console.log('Connected to mongo at: ' + mongoURL);
                		var coll = mongo.collection('domainStack');
                		
                		coll.findOne({"companyName": comp}, function(err, companyDetails){
                			if(companyDetails){
                				
                				// console.log(companyDetails.companyName);
                                localStorage.setItem('polarity', polarity);
                                localStorage.setItem('tweets', tweets);
                                localStorage.setItem('set', 1);
                                // console.log(comp1[0]);
                                res.send({
                                	"status":"200",
                                    "rows": rows,
                                    "company1Name":localStorage.getItem("compFirst"),
                                    "company2Name":localStorage.getItem("compSecond"),
                                    "comp1": comp1,
                                    "polarity": polarity,
                                    "tweets": tweets,
                                    "finalPercent": 0,
                                    "companyDetails":companyDetails
                                });
                				
                				
                			}else{
                				var result={"status":"400","msg":"Something went wrong, Please try again"};
                			}
                			
                		});
                	});

                }
               
            });
        });


};





