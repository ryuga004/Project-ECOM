import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import { CustomFile } from "../utils/types.js";


const storage = multer.memoryStorage();

const upload = multer({ storage });


export const singleUpload = (req: Request, res: Response, next: NextFunction): void => {
    upload.single("photo")(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });

        try {
            const file = req.file as CustomFile;

            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "ecom" },
                    (error, response) => {
                        if (error) reject(error);
                        else resolve(response as UploadApiResponse);
                    }
                );

                file.stream.pipe(uploadStream);
            });

            file.cloudinary = result;
            next();
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    });
};


export const multipleUpload = (req: Request, res: Response, next: NextFunction): void => {
    upload.array("image", 5)(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });

        try {
            const uploadPromises = (req.files as CustomFile[]).map((file) => {
                return new Promise<UploadApiResponse>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "ecom" },
                        (error, response) => {
                            if (error) reject(error);
                            else resolve(response as UploadApiResponse);
                        }
                    );

                    file.stream.pipe(uploadStream);
                });
            });

            const results = await Promise.all(uploadPromises);
            (req.files as CustomFile[]).forEach((file, index) => {
                file.cloudinary = results[index];
            });

            next();
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    });
};
