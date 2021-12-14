const models =  require('../models') ;
const Validator =  require('fastest-validator');
const res = require('express/lib/response');

function save(req, res){
    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.image_url,
        categoryId: req.body.categoryId,
        userId: 1
    }

    const schema = {
        title: {type:'string', optional: false , max: "100"},
        content: {type:'string', optional: false , max: "500"},
        categoryId: {type:'number', optional: false},   
    }
    const v =  new Validator();
    const validationResponse = v.validate(post, schema);  //if validation is correct it will return true, else it will return an array of the errors.

    if(validationResponse !== true){
        return res.status(400).json({
            message: 'Validation failed',
            errors: validationResponse
        });
    }
    models.Post.create(post).then(result => {
        res.status(201).json({
            message: 'Post created successfully',
            post: result
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Something went wrong',
            post: error
        });
    });
}
function show(req, res){
    const id = req.params.id;
    models.Post.findByPk(id).then(result => {
        if(result){
            res.status(200).json(result);
        }
        else{
            res.status(200).json({
                message: 'Post not found!'
            }); 
        }
    }).catch(error =>{
        res.status(500).json({
            message: 'Something went wrong',
        })
    })
}

function index(req, res){
    models.Post.findAll().then(result => {
        console.log(req.user.emails[0].value);
        res.status(200).json(result);
    }).catch(error=>{
        result.status(500).json({
            message: 'Something went wrong',
            error: error
        })
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

function destroy(req, res){
    const id = req.params.id;
    const userId = 1;
    
    models.Post.destroy({where:{id:id , userId:userId}}).then(result =>{
        res.status(200).json({
            message: "Post deleted successfully",   
        });
    }).catch(error =>{
        res.status(500).json({
        message: 'Something went wrong',
        error: error  
        })
    })
}

module.exports = {
    save: save,
    show: show,
    index:index,
    update: update,
    destroy: destroy
}