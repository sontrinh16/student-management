const express = require('express');
const studentController = require('../controllers/studentController');
const authController = require('./../controllers/authenticationController');
const classRouter = require('./class');
const gradeRouter = require('./grade');
const path = require('path');


const router = express.Router();
router.use(express.static(path.join(__dirname, '..' , 'public')));

router.use(authController.isLogging);

router.get('/homepage', studentController.homepageRender);
router.use('/classes', classRouter);
router.use('/grades', gradeRouter);
router.get('/profile', studentController.getStudent);
router.get('/update-profile', studentController.renderUpdate);
router.post('/update-profile', studentController.updateStudent);
router.get('/update-pass', authController.renderUpdatePass);
router.post('/update-pass',authController.checkNewPass , authController.changePass)


module.exports = router;