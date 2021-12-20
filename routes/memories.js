'use strict';
const express = require('express');
const memoriesController =  require('../controllers/memories.controller');
const router = express.Router();
const imageUploader =  require('../helpers/image-uploader');
const  checkAuth= require("../middleware/authController");

router.use(checkAuth.isLoggedIn);

router.get('/', memoriesController.getAllmemories);
router.post('/make-memory', imageUploader.upload.single('image'),memoriesController.addMemory);
router.get('/kidsNames', memoriesController.kidsNames);
router.get('/getAges', memoriesController.getKidsAges);
router.get('/ages/:name', memoriesController.getKidAges);
router.get('/:name/:age', memoriesController.getKidYearMemories);
router.get('/:name', memoriesController.getKidMemories); 

module.exports = router;
      