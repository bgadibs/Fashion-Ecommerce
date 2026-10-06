
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
    __dirname,
    "..",
    "uploads",
    "products"
);


// Create directory if it does not exist

if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}


// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            uploadDirectory
        );

    },


    filename: (req, file, cb) => {

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();


        const fileName =
            `product-${Date.now()}-${Math.round(
                Math.random() * 1000000
            )}${extension}`;


        cb(
            null,
            fileName
        );

    }

});


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp"

    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            ),
            false
        );

    }

};


// =====================================================
// MULTER
// =====================================================

const uploadProductImage =
    multer({

        storage,

        fileFilter,

        limits: {

            fileSize:
                5 * 1024 * 1024

        }

    });


module.exports =
    uploadProductImage;

