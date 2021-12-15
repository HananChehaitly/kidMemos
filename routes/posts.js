const express = require('express');
const postsController =  require('../controllers/post.controller');

const router = express.Router();

router.get('/home', postsController.getAllposts);
router.get('/ages/:name', postsController.getKidAges);
router.get('/kidsNames', postsController.kidsNames);
router.get('/:name', postsController.getKidMemories);
router.get('/:name/:age', postsController.getKidYearMemories);
router.post('/addMemory', postsController.AddMemory);

module.exports = router;
    