const models =  require('../models') ;
const Validator =  require('fastest-validator');
const res = require('express/lib/response');
const { response } = require('../app');
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;
const imageUploader =  require('../helpers/image-uploader');

function addMemory(req, res){
    console.log(req.isAuthenticated());
    const id = req.user.dataValues.id; 
    const name = req.body.name;
    models.Kid.findOrCreate({ where: {name: name }, 
        defaults: {
                    parent_id: id,
                    name: name
                }
    }).then(result =>{
        models.Kid.findOne({where:{parent_id: id,
            name: name}}).then(response => { 
                const post = {
                parent_id: id,  
                title: req.body.title,  
                content: req.body.content,  
                age: req.body.age,  
                picture_url: req.file.filename,
                kid_id : response.dataValues.id
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
        models.Memory.findAll({attributes:['age'], where:{parent_id:id, kid_id:response[0].dataValues.id}, order: [['age', 'ASC']]}).then(result =>{
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

function search(req, res){
    const id = req.user.dataValues.id;
    models.Memory.findAll( { where: {
          content: { [Op.like]: "%" + req.params.word + "%" },
          parent_id: id,
        },
    }).then(result =>{
            res.status(201).json({
            post: result
        });
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
    search: search
}