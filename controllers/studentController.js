const connection =  require('./../connection');
const util = require('util');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

const queryFunc = util.promisify(connection.query).bind(connection);

exports.homepageRender = catchAsync( async (req,res,next) => {
        res.status(200).render('base', {
            title: 'Home Page'
        })
});

exports.getStudent =catchAsync( async (req,res,next) => {
        const user = req.user;

        const query = `SELECT *, DATE_FORMAT(date_of_birth, "%M %D %Y") as birthDay FROM students WHERE student_Id = ${user.student_Id}`;

        const results = await queryFunc(query);

        if (results.length === 0) return next(new appError(404, 'cannot find student'));

        const student = results[0];

        if(student.other_details === null) student.other_details = 'none';

        res.status(200).render('student2', {
            student,
            title: 'Student Profile'
        })
})

exports.getClasses = catchAsync( async (req,res,next) => {
        const user = req.user;

        const {year, semester} = req.body;

        //console.log(user.student_Id);

        //console.log(year +',' + semester);

        const query = `select DISTINCT classes.class_Id, subject.subject_name, classes.class_on, classes.period, classes.room, classes.building, teachers.full_name, teachers.teacher_Id, classes.status 
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

    const query = `SELECT DISTINCT subject.subject_name ,grades.midterm, grades.final, (grades.midterm + grades.final)/2 as avarage FROM grades JOIN classes ON grades.class_Id = classes.class_Id
    JOIN courses ON courses.course_Id = classes.course_Id JOIN subject ON courses.subject_Id = subject.subject_Id WHERE classes.school_year = ${year} AND classes.semester = ${semester} and classes.student_Id = ${user.student_Id}`;

    const grades = await queryFunc(query);

    if (grades.length === 0) return next(new appError(404, 'invalid year or semester'));

    console.log(grades);

    res.status(200).render('grade', {
        title: 'Grade',
        grades
    })
});

exports.updateStudent = catchAsync( async (req, res, next) => {
    const updateInput = req.body;
    const user = req.user;


    for (i in updateInput){
        if( updateInput[i] !== ''){
            //console.log(i + ':' + updateInput[i]);
            const query = `update students
                 set students.${i} = '${updateInput[i]}'
                 where students.student_Id = ${user.student_Id}`
            
            await queryFunc(query);
         } 
    
     }
    res.status(200).redirect('/student/profile');
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

exports.renderUpdate = (req, res) => {
    res.status(200).render('inputUpdate', {
        title: 'Update Info'
    })
}