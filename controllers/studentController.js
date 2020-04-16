const connection =  require('./../connection');
const util = require('util');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

const queryFunc = util.promisify(connection.query).bind(connection);

// exports.getAllStudent = (req,res) => {
//     connection.query("SELECT * FROM students ORDER BY full_name", (err, result) => {
//         if (err) throw err;
//         res.status(200).json({
//             status: 'success',
//             data: result
//         });
//       });
// }


exports.homepageRender = catchAsync( async (req,res,next) => {
        // const results = await queryFunc("SELECT * FROM students ORDER BY full_name");

        // res.status(200).json({
        //     status: 'success',
        //     length: results.length,
        //     data: results
        // });

        res.status(200).render('base', {
            title: 'Home Page'
        })
});

exports.getStudent =catchAsync( async (req,res,next) => {
        const user = req.user;

        const query = `SELECT * FROM students WHERE student_Id = ${user.student_Id}`;

        const results = await queryFunc(query);

        if (result.length === 0) return next(new appError(404, 'cannot find student'));

        const student = results[0];

        res.status(200).json({
            status: 'success',
            data: result
        });
})

exports.getClasses = catchAsync( async (req,res,next) => {
        const user = req.user;

        const {year, semester} = req.body;

        //console.log(user.student_Id);

        //console.log(year +',' + semester);

        const query = `select DISTINCT subject.subject_name, classes.class_on, classes.period, classes.room, classes.building, teachers.full_name, classes.status 
        from classes JOIN courses ON classes.course_Id = courses.course_Id
        JOIN teachers ON courses.teacher_Id = teachers.teacher_Id JOIN subject ON subject.subject_Id = courses.subject_Id
        where classes.student_Id = ${user.student_Id} and classes.school_year = ${year} and classes.semester = ${semester}`;

        const classes = await queryFunc(query);

        if (classes.length === 0) return next(new appError(404, 'invalid year or semester'));

        //console.log(classes[0]);

        res.status(200).render('class', {
            title: 'Class List',
            classes
        })
   
});

exports.getGrades = catchAsync (async (req, res, next) => {
    const user = req.user;

    const {year, semester} = req.body;

    const query = `SELECT DISTINCT subject.subject_name ,grades.midterm, grades.final, grades.avarage FROM grades JOIN classes ON grades.class_Id = classes.class_Id
    JOIN courses ON courses.course_Id = classes.course_Id JOIN subject ON courses.subject_Id = subject.subject_Id WHERE classes.school_year = ${year} AND classes.semester = ${semester} and classes.student_Id = ${user.student_Id}`;

    const grades = await queryFunc(query);

    if (grades.length === 0) return next(new appError(404, 'invalid year or semester'));

    console.log(grades);

    res.status(200).render('grade', {
        title: 'Grade',
        grades
    })
});

exports.getTeacher = catchAsync ( async (req, res, next) => {
    const query = `select * from teachers 
    where full_name like '%${req.body.name}%'
    order by full_name`;

    const results = await queryFunc(query);

    res.status(200).json({
        status: 'success',
        data: results
    });
});

exports.loginRender = (req, res) => {
    res.status(200).render('login',{
        title: 'Login'
    })
}

exports.renderClasses = (req, res) => {
    res.status(200).render('renderInputBox',{
        title: 'Class'
    })
}

exports.renderGrade = (req, res) => {
    res.status(200).render('renderInputBox', {
        title: 'Grade'
    })
}