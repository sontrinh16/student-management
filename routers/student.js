const express = require('express');
const studentController = require('../controllers/studentController');
const authController = require('./../controllers/authenticationController');
const classRouter = require('./class');
const gradeRouter = require('./grade');
const teacherRouter = require('./teacher');
const path = require('path');

const router = express.Router();
router.use(express.static(path.join(__dirname, '..' , 'public')));

router.use(authController.isLogging);

router.get('/homepage', studentController.homepageRender);
router.use('/classes', classRouter);
router.use('/grades', gradeRouter);
router.use('/teachers', teacherRouter);
router.get('/profile', studentController.getStudent);



module.exports = router;