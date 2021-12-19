const models =  require('../models') ;
const Validator =  require('fastest-validator');
const res = require('express/lib/response');
const { response } = require('../app');
const {Sequelize} = require('sequelize');
const imageUploader =  require('../helpers/image-uploader');

function addMemory(req, res){
    console.log(req.body);
    console.log(req.isAuthenticated());
    const id = req.user.dataValues.id; 
    const name = req.body.name;
    models.Kid.findOrCreate({ where: {name: name }, 
        defaults: {
                    parent_id: id,
                    name: name
                }
    }).then(result =>{
        models.Kid.findAll({where:{parent_id: id,
            name: name}}).then(response => { 
                const post = {
                parent_id: id, 
                title: req.body.title,  
                content: req.body.content,  
                age: req.body.age, 
                kid_id : response[0].dataValues.id
                }
                models.Memory.create(post).then(result => {
                    res.status(201).json({
                    message: 'Post created successfully',
                    post: result 
                });
            })
        })
    })
} 

function addMemoryPic(req, res){
    console.log(req.user);
    const f = imageUploader.upload.single('image');
    const id = req.user.dataValues.id; 
    const name = req.body.name;
    models.Kid.findAl({where:{parent_id: id, name: name}}).then(response => {
            const post = {
                parent_id: id,
                title: req.body.title,
                content: req.body.content,
                picture_url: f.file.filename,
                age: req.body.age,                    
                kid_id : response[0].dataValues.id
            }
            models.Memory.create(post).then(result => {
                res.status(201).json({
                    message: 'Post created successfully',
                    post: result 
                });
            })
    })
}

function getAllmemories(req, res){
    const id = req.user.dataValues.id;
    models.Memory.findAll(
        {   where:{parent_id:id}, 
            order: [ ['kid_id', 'ASC'], ['age', 'ASC'] ]
        }).then(result =>{
        res.status(201).json({
            post: result
        });
    }).catch(error=>{
        result.status(500).json({
            message: 'Something went wrong',
            error: error
        })
    })
}

function getKidMemories(req, res){
    const kid_name = req.params.name;
    const id = req.user.dataValues.id;
    models.Kid.findAll({where:{parent_id:id, name:kid_name}}).then(response =>{
        models.Memory.findAll({where:{parent_id:id, kid_id:response[0].dataValues.id}}).then(result =>{
            res.status(201).json({
                post: result
            }); 
        })
    })    
}

function getKidYearMemories(req, res){
    const kid_name = req.params.name;
    const kid_age = req.params.age;
    const id = req.user.dataValues.id;
    models.Kid.findAll({where:{parent_id:id, name:kid_name}}).then(response =>{
        models.Memory.findAll({where:{parent_id:id, kid_id:response[0].dataValues.id, age:kid_age}}).then(result =>{
            res.status(201).json({
                post: result
            });
        })
    })    
}

function getKidAges(req, res){
    const kid_name = req.params.name;
    const id = req.user.dataValues.id;
    models.Kid.findAll({where:{parent_id:id, name:kid_name}}).then(response =>{
        models.Memory.findAll({attributes:['age'], where:{parent_id:id, kid_id:response[0].dataValues.id}}).then(result =>{
            res.status(201).json({
                post: result
            });
        })
    })    
}

function getKidsNames(req, res){
    const id = req.user.dataValues.id;
    models.Kid.findAll({attributes:['id','name'],where:{parent_id:id},}).then(result =>{
            res.status(201).json({
                post: result
            })
    })    
}

function getKidsAges(req, res){
    const id = req.user.dataValues.id;
    models.Memory.findAll({ attributes:['age','id'], group: ['age'] , where:{parent_id:id},  order: [['age', 'ASC']] }).then(result =>{
            res.status(201).json({
                post: result
            });
        })    
}

function update(req, res){
    const id = req.params.id;
    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.image_url,
        categoryId: req.body.categoryId,
    }
    const userId = 1;
     
    const schema = {
        title: {type:'string', optional: false , max: "100"},
        content: {type:'string', optional: false , max: "500"},
        categoryId: {type:'number', optional: false},   
    }
    const v =  new Validator();
    const validationResponse = v.validate(updatedPost, schema);  //if validation is correct it will return true, else it will return an array of the errors.

    if(validationResponse !== true){
        return res.status(400).json({
            message: 'Validation failed',
            errors: validationResponse
        });
    }

    models.Post.update(updatedPost, {where: {id:id, userId: userId}}).then(result => {
        res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost   //if you put result it will give 1 because result is a boolean here.
        });
    }).catch(error =>{
        res.status(500).json({
        message: 'Something went wrong',
        error: error  
        })
    })
}


module.exports = {
        
    getAllmemories:getAllmemories,
    getKidMemories: getKidMemories,
    getKidYearMemories:getKidYearMemories,
    getKidAges: getKidAges,
    getKidsAges: getKidsAges,
    kidsNames: getKidsNames,
    addMemory: addMemory,
    addMemoryPic: addMemoryPic,
    update: update,

}