import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const singleUpload = (req, res, next) => {
    upload.single("photo")(req, res, async (err) => {
        if (err)
            return res.status(400).json({ error: err.message });
        try {
            const file = req.file;
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ folder: "ecom" }, (error, response) => {
                    if (error)
                        reject(error);
                    else
                        resolve(response);
                });
                file.stream.pipe(uploadStream);
            });
            file.cloudinary = result;
            next();
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
};
export const multipleUpload = (req, res, next) => {
    upload.array("image", 5)(req, res, async (err) => {
        if (err)
            return res.status(400).json({ error: err.message });
        try {
            const uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ folder: "ecom" }, (error, response) => {
                        if (error)
                            reject(error);
                        else
                            resolve(response);
                    });
                    file.stream.pipe(uploadStream);
                });
            });
            const results = await Promise.all(uploadPromises);
            req.files.forEach((file, index) => {
                file.cloudinary = results[index];
            });
            next();
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
};
