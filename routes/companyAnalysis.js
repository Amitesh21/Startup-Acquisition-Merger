/**
 * Created by Siddharth on 5/2/2016.
 */
var mysql = require('./mysql');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

exports.getStats = function (req, res) {

    var compName;
    if(req.params.id==1)
        compName = localStorage.getItem('compFirst');
    else
        compName = localStorage.getItem('compSecond');

    var getStats = "select * from mytable1 where Company_Name='" + compName + "'";
    mysql.fetchData(getStats, function (err, rows) {
        if (rows.length < 3) {

            res.render('index', {error: "Error"});
            console.log(err);

        }
        else {
            var comp1 = [];
            var i;
            var comp2 = localStorage.getItem('compSecond');
            for (i = 0; i < rows.length; i++) {
                    comp1.push(rows[i]);
            }

            var EV1 = [];
            // var EV2 = [];

            var operating_MarginRatio1 = [];
            // var operating_MarginRatio2 = [];
            var debt_equity1 = [];
            // var debt_equity2 = [];
            var year = [];


            for (i = 0; i < 3; i++) {
                
                EV1.push((comp1[i].Total_Assets - comp1[i].Total_Liabilities));

                debt_equity1.push((comp1[i].Total_Liabilities / EV1[i]));
                
                operating_MarginRatio1.push((comp1[i].EBITDA / comp1[i].total_revenue));

                console.log("value Total_Current_Assets 1.." + comp1[i].Total_Current_Assets);
                
                console.log("Company 1: " + JSON.stringify(comp1));


            }
            
            console.log(comp1);
            res.render('company', {
                data: rows,
                comp1: comp1,
                comp2 : comp2
            });
        }

    });

};