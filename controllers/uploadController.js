const multer  = require('multer')

const supportedMimeTypes = {
    "image/png": ".png",
    "image/jpeg": ".jpeg",
    "image/jpg": ".jpg"
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + supportedMimeTypes[file.mimetype])
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        if(!supportedMimeTypes.hasOwnProperty(file.mimetype)) {
            cb(new Error("Invalid image file."));
        } else {
            cb(null, true);
        }
    }
}).single('imageFile');

exports.uploadImage = [
    async (req, res, next) => {
        upload(req, res, function(err) {
            if(err) {
                return res.status(400).send({
                    error: err.message
                });
            }

            return res.json({
                filename: req.file.filename
            });
        });
    }
]
