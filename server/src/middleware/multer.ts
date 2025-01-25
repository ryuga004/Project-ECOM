import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const singleUpload = upload.single("photo");
export const multipleUpload = upload.array("image", 5);
