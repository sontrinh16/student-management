const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const connection =  require('./../connection');
const checkPassChangeAfter = require('./../utils/checkPass');
const util = require('util');


const queryFunc = util.promisify(connection.query).bind(connection);

const generateToken = (id) => {
    return  jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRED_IN
    });
}

exports.login =catchAsync( async (req, res, next) => {
    const {username, password} = req.body;
    // const user_db =  (role === 'student')? 'students' : 'teachers';
    // const user_name = (role === 'student')? 'MSV' : 'user_name';
    // const user_id = (role === 'student')? 'student_Id' : 'teacher_Id';
    //if (username === undefined || psw === undefined) return next(new appError(400, 'please provide username and password'));

    console.log(username + ',' + password);

    const query = `SELECT * FROM students WHERE MSV = '${username}' AND pass = '${password}'`;

    const users = await queryFunc(query);

    if (users.length === 0) return next(new appError(401, 'invalid username or password'));

    const user = users[0];


    //console.log(user);

    const token = generateToken(user.student_Id);

    //console.log(token);
    
    const cookieOptions = {
        expires: new Date(
            Date.now() + 24 * 60 *60 *1000
        ),
        //httpOnly: true,
        sameSite: 'None',
        secure: true
    }

    res.cookie('jwt', token, cookieOptions);

    //ALTER pass_change_at to null 

    user.pass = null;

    // res.status(200).json({
    //     status: 'success',
    //     token,
    //     data:{
    //         user
    //     }
    // })

    res.status(200).redirect('/student/homepage');
});

exports.isLogging = catchAsync( async (req, res, next) => {
    if (req.cookies.jwt) {

        //console.log(req.cookies.jwt);

        const decoded = await util.promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
        );

        //console.log(checkJwtIsExpired(exp))

        //if (checkJwtIsExpired(exp)) return res.redirect('/login'); 

        const query = `SELECT * FROM students WHERE student_Id = ${decoded.id}`;

        const students = await queryFunc(query);

        const student = students[0];

        if (student.length === 0) return next(new appError(401, 'username is not exist'));

        //console.log(student);
        
        //if (checkPassChangeAfter(student.pass_change_at, decoded.iat)) return next(new appError(401, 'username of password is not exist'));

        student.pass = undefined;    

        req.user = student;

        res.locals.user = student;
        return next();
    }
    res.redirect('/login');
});

exports.logout = (req, res) => {
    const cookieOptions = {
        expires: new Date(
            Date.now() + 10 * 1000
        ),
        httpOnly: true
        //secure: true
    }
    //res.cookie('jwt', 'logout', cookieOptions);
    res.clearCookie('jwt');
    res.status(200).redirect('/login');
}

exports.renderUpdatePass = (req, res) => {
    res.status(200).render('changePass', {
        title: 'Update Pass'
    })
}

exports.changePass = catchAsync( async (req, res, next) => {
    const newPass = req.body.new_password;
    const user = req.user;

    console.log(newPass)

    const query = `update students
                set students.pass = '${newPass}'
                where students.student_Id = ${user.student_Id}`
            
            await queryFunc(query);
    
    res.status(200).redirect('/student/profile');

});

exports.checkNewPass = (req, res, next) => {
    if (req.body.new_password !== req.body.confirm_password) {
        return next(new appError(400, 'confirm pass should be the same with new pass'))
    }
    next();
}

//  exports.checkCookieIsExpired = catchAsync(async (req, res, next) => {
//      if (!req.cookies.jwt) {
//         console.alert("Your working session has time out, please login to continue")
//         setTimeout( () => {
//             res.clearCookie('jwt');
//             return res.redirect('/login');
//         }, 10000)
//      }
//      next();
//  });