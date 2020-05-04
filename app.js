const express = require('express');
const bodyParser = require('body-parser');
const studentRouter = require('./routers/student');
const appError =  require('./utils/appError');
const globalErrorHandler = require('./controllers/errorHandler');
const cookieParser = require('cookie-parser');
const path = require('path');
const authController = require('./controllers/authenticationController');
const teacherRouter = require('./routers/teacher');


const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req, res) => {
    if (req.cookies.jwt)
    {
        res.status(200).redirect('/student/homepage');
    }
    else{
        res.status(200).redirect('/login');
    }
})

app.get('/login', (req, res) => {
    res.status(200).render('login',{
        title: 'Login'
    })
    
})

app.post('/login', authController.login);

app.use('/student', studentRouter);
app.use('/teachers', teacherRouter)

app.get('/logout', authController.logout)


app.all('*', (req, res, next) => {
    next(new appError(404, 'invalid URL'));
});

app.use(globalErrorHandler);

module.exports = app;