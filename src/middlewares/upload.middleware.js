import multer from "multer";

const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/temp/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },

    
});

export const upload = multer({ 
    storage:localStorage,
});