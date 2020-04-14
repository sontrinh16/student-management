const express = require('express');
const studentController = require('../controllers/studentController');
const path = require('path');

const router = express.Router({ mergeParams: true});
router.use(express.static(path.join(__dirname, '..' , 'public')));

router.post('/', studentController.getTeacher);


module.exports = router;