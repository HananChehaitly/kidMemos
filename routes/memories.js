const express = require('express');
const memoriesController =  require('../controllers/memories.controller');
const router = express.Router();
const imageUploader =  require('../helpers/image-uploader');

router.get('/', memoriesController.getAllmemories);
router.get('/ages/:name', memoriesController.getKidAges);
router.get('/kidsNames', memoriesController.kidsNames);
router.get('/:name', memoriesController.getKidMemories);
router.get('/:name/:age', memoriesController.getKidYearMemories);
router.post('/addMemory', imageUploader.upload.single('image'), memoriesController.AddMemory);

module.exports = router;
    