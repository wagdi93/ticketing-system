var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ticketsRouter = require('./routes/tickets');


const mongoClient = require("mongodb").MongoClient;
const client = new mongoClient("mongodb+srv://USERNAME:PASSWORD@ticketingsystem-a9go6.mongodb.net/test?retryWrites=true&w=majority");
var app = express();

let DB = null;

app.use(async (req, res, next) => {
    try {
        if (DB) {
            req.db = DB;
        } else {
            await client.connect();
            DB = client.db('mwaproject'); //we can write any db name
            req.db = DB;
        }
        next()
    } catch (error) {
        console.log(error)
    }

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tickets', ticketsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))

module.exports = app;
