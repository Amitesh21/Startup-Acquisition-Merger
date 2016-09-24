var mysql = require('./mysql');
var tweetStats = require('./twitterSearch');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

exports.getStats = function (req, res) {

   

    var compFirst,
        compSecond;

    var assets_combined_1 = 0,
        liability_combined_1 = 0,
        profit_combined_1 = 0,
        ebitda_combined_1 = 0,
        cash_combined_1 = 0,
        assets_combined_2 = 0,
        liability_combined_2 = 0,
        profit_combined_2 = 0,
        ebitda_combined_2 = 0,
        cash_combined_2 = 0;

    if(localStorage.getItem('set')==1){
        compFirst = localStorage.getItem('compFirst');
        compSecond = localStorage.getItem('compSecond');
    }
    else {
        compFirst = req.param("company1").toLowerCase().trim();
        compSecond = req.param("company2").toLowerCase().trim();
    }
        
        var getStats = "select * from mytable1 where Company_Name='" + compFirst + "' OR Company_Name='" + compSecond + "'";
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
                console.log("tweetAnalysis1" + polarity[0] + " " + polarity[1] + " " + polarity[2]);
                console.log("tweetAnalysis1" + result1[0] + " " + result1[1] + " " + result1[2]);
                polarity[0] = parseInt(result1[0]) + parseInt(polarity[0]);
                polarity[1] = parseInt(result1[1]) + parseInt(polarity[1]);
                polarity[2] = parseInt(result1[2]) + parseInt(polarity[2]);
                console.log("tweetAnalysis2" + polarity[0] + " " + polarity[1] + " " + polarity[2]);

                mysql.fetchData(getStats, function (err, rows) {
                    if (rows.length < 6) {

                        res.render('index', {error: "Error"});
                        console.log(err);

                    }
                    else {
                        console.log("pol..." + polarity);
                        var comp1 = [];
                        var comp2 = [];
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i].Company_Name.toLowerCase() === compFirst) {
                                comp1.push(rows[i]);
                            }
                            else if (rows[i].Company_Name.toLowerCase() === compSecond) {
                                comp2.push(rows[i]);
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

                            assets_combined_1 += comp1[i].Total_Current_Assets;
                            liability_combined_1 += comp1[i].Total_Liabilities;
                            profit_combined_1 += comp1[i].Gross_Margin;
                            ebitda_combined_1 += comp1[i].EBITDA;
                            cash_combined_1 += comp1[i].Cash_and_Cash_Equivalents;
                            assets_combined_2 += comp2[i].Total_Current_Assets;
                            liability_combined_2 += comp2[i].Total_Liabilities;
                            profit_combined_2 += comp2[i].Gross_Margin;
                            ebitda_combined_2 += comp2[i].EBITDA;
                            cash_combined_2 += comp2[i].Cash_and_Cash_Equivalents;

                            var counter = 0;
                            if (comp1.sector == comp2.sector) {
                                console.log("in sector");
                                counter = counter + 1;
                                console.log(counter);
                            }

                            console.log("at Total_Assets :" + comp2[i]);
                            console.log("at Total_Liabilities :" + comp2[i].Total_Liabilities);

                            EV1.push((comp1[i].Total_Assets - comp1[i].Total_Liabilities));

                            EV2.push((comp2[i].Total_Assets - comp2[i].Total_Liabilities));
                            console.log("at EV 2 :" + EV2[i]);

                            debt_equity1.push((comp1[i].Total_Liabilities / EV1[i]));
                            debt_equity2.push((comp2[i].Total_Liabilities / EV2[i]));
                            //asset_ratio1.push((comp1[i].Total_Assets / comp1[i].Total_Current_Assets));
                            //asset_ratio2.push((comp2[i].Total_Assets / comp2[i].Total_Current_Assets));
                            operating_MarginRatio1.push((comp1[i].EBITDA / comp1[i].total_revenue));
                            operating_MarginRatio2.push((comp2[i].EBITDA / comp2[i].total_revenue));

                            if (EV1[i] > 2 * EV2[i]) {
                                counter = counter + 1;
                                console.log("in EV.." + counter);
                            }
                            if (debt_equity1[i] > 2 * debt_equity2[i]) {
                                counter = counter + 1;
                                console.log("in debt_equity.." + counter);

                            }
                            //if (asset_ratio1[i] > 3 * asset_ratio2[i]) {
                            //    counter = counter + 1;
                            //    console.log("in asset_ratio.." + counter);
                            //}
                            if (operating_MarginRatio1[i] > operating_MarginRatio2[i]) {
                                counter = counter + 1;
                                console.log("in operating_MarginRatio1.." + counter);


                            }
                            if (comp1[i].Total_Current_Assets > (3 * comp2[i].Total_Current_Assets)) {
                                console.log("in asset");
                                counter = counter + 1;
                                console.log(counter);
                            }
                            if (comp1[i].Total_Liabilities > (2 * comp2[i].Total_Liabilities)) {
                                console.log("in gross");
                                console.log("in total");
                                counter = counter + 1;
                                console.log(counter);
                            }
                            if (comp1[i].gross_profit > 3 * comp2[i].gross_profit) {
                                counter = counter + 1;
                                console.log(counter);
                            }
                            if (comp1[i].Share_Values > comp2[i].Share_Values) {
                                console.log("in share");
                                counter = counter + 1;
                                console.log(counter);
                            }
                            if (comp1[i].Number_of_Employees > comp2[i].Number_of_Employees) {
                                console.log("in full");
                                counter = counter + 1;
                                console.log(counter);
                            }
                            if (comp1[i].Gross_Margin > 3 * comp2[i].Gross_Margin) {
                                console.log("in gross margin");
                                counter = counter + 1;
                                console.log(counter);
                            }
                            if (comp1[i].Cash_and_Cash_Equivalents > 2 * comp2[i].Cash_and_Cash_Equivalents) {
                                console.log("in cash");
                                counter = counter + 1;
                                console.log(counter);
                            }
                            year.push(Math.round((counter / 11) * 100));


                        }
                        console.log("y1: " + year[0] + " y2: " + year[1] + " y3: " + year[2]);
                        var finalPercent = parseInt(((year[0] + year[1] + year[2]) / 3));
                        console.log("final percent: " + finalPercent);

                        //console.log(JSON.stringify(rows));
                        localStorage.setItem('compFirst', compFirst);
                        localStorage.setItem('compSecond', compSecond);
                        localStorage.setItem('polarity', polarity);
                        localStorage.setItem('tweets', tweets);
                        localStorage.setItem('set', 1);

                        comp1.assets_combined = assets_combined_1;
                        comp1.liability_combined = liability_combined_1;
                        comp1.profit_combined = profit_combined_1;
                        comp1.ebitda_combined = ebitda_combined_1;
                        comp1.cash_combined = cash_combined_1;
                        comp2.assets_combined = assets_combined_2;
                        comp2.liability_combined = liability_combined_2;
                        comp2.profit_combined = profit_combined_2;
                        comp2.ebitda_combined = ebitda_combined_2;
                        comp2.cash_combined = cash_combined_2;

                        var strat = localStorage.getItem('sentimentResult');
                        if(strat) {
                            finalPercent = finalPercent+parseInt(strat);
                            finalPercent = finalPercent/2;
                        }
                        else
                            finalPercent = finalPercent;

                        res.render('stats', {
                            data: rows,
                            comp1: comp1,
                            comp2: comp2,
                            polarity: polarity,
                            tweets: tweets,
                            finalPercent: finalPercent
                        });
                    }
                    // render or error

                });
            });




        });


};



