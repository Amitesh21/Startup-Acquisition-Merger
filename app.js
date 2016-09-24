var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routesBase = require('./routes/index');
var company = require('./routes/company');
var analysis = require('./routes/analysis');
var stockAnalysis = require('./routes/stockAnalysis');
var tweetAnalysis = require('./routes/tweetAnalysis');
var strategyAnalysis = require('./routes/strategyAnalysis');
var companyAnalysis = require('./routes/companyAnalysis');
var apriori = require('./routes/apriori');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use("/public", express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
    localStorage.clear();
    localStorage.setItem('set', 0);
    res.render('index');
});

app.post('/getStats', analysis.getStats);

app.get('/getStats', analysis.getStats);

app.get('/index', function (req, res) {
    res.render('stats');
});

app.get('/company1', function(req,res){
	res.render('company1');
});

app.get('/company2', function (req, res) {
    res.render('company2');
});

//app.post('/getCompanyDetails',company1.getStatsCompany1);

app.post('/getCompanyDetails',company.getStatsCompany);

app.get('/stock', stockAnalysis.getStats);

app.get('/strategy', strategyAnalysis.getStats);

app.get('/sentiment', tweetAnalysis.getStats);

app.get('/company/:id', companyAnalysis.getStats);

app.get('/apriori', apriori.getApriori);

// app.get('/technologies', apriori.getStats);

// app.get('/company1', function (req, res) {
//     res.render('company1');
// });
//
// app.get('/company2', function (req, res) {
//     res.render('company2');
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
