const multer= require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function(req, file , cb) {
        cb(null, './uploads');  //take to file destination where it needs to be saved.
    
    },
    filename: function(req, file , cb){
        cb(null, new Date().getTime() + path.extname(file.originalname)); 
    }
});

// This function doesn't allow users to uplad files other than png or jpeg.

const filefilter = (req, file , cb) => {
    if(file.mimetype === 'image/jpeg'  ||  file.mimetype === 'image/png'){
        cb(null, '/api/make-memory');
    }else{
        cb(new Error('unsupported files'), false);
    }
}

//Now we call the upload method of multer.

const upload = multer({
    storage: storage,
    fileFilter: filefilter
});

module.exports= {
    upload: upload
}

