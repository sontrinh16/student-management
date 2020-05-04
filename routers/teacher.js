const express = require('express');
const teacherController = require('../controllers/teacherController');
const authController = require('./../controllers/authenticationController');
const path = require('path');

const router = express.Router({ mergeParams: true});
router.use(express.static(path.join(__dirname, '..' , 'public')));

router.use(authController.isLogging);

router.get('/', teacherController.renderTeachers);
router.post('/', teacherController.getTeachers);
router.get('/:id', teacherController.getTeacher);


module.exports = router;