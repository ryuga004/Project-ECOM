import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import ApiFeatures from "../utils/apifeatures.js";
import { AuthenticatedProductRequest, AuthenticatedProductUpdateRequest, AuthenticatedRequest, AuthenticatedRequestReview, ImagesTypeProduct } from "../utils/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
// admin only
export const createProduct = TryCatch(
    async (req: AuthenticatedProductRequest, res: Response, next: NextFunction) => {
        const { name, description, price, category, stock } = req.body;
        const files = req.files as Express.Multer.File[];


        const images: Array<{ imageId: string; url: string }> = [];

        if (files && files.length > 0) {
            for (const file of files) {

                const stream = Readable.from(file.buffer);

                try {
                    const result: any = await new Promise((resolve, reject) => {
                        const streamUpload = cloudinary.uploader.upload_stream(
                            { folder: "posts" },
                            (error, result) => {
                                if (result) resolve(result);
                                else reject(error);
                            }
                        );

                        stream.pipe(streamUpload);
                    });

                    images.push({
                        imageId: result.public_id,
                        url: result.secure_url
                    })
                } catch (error) {
                    return next(new ErrorHandler("Image upload failed", 500));
                }


            }
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            images,
            user: req.userId,
        });
        if (!product) {
            return next(new ErrorHandler("Unable to create product", 500));
        }
        return res.status(200).json({
            success: true,
            data: product,
        })
    }
);

export const getAdminProducts = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const products = await Product.find({});

        return res.status(200).json({
            success: true,
            data: products,
        })
    }
)

// user

export const getAllProducts = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const features = new ApiFeatures(Product.find(), req.query).search().filter().pagination();
        const filterCount = new ApiFeatures(Product.find(), req.query).search().filter();
        const resultPerPage = 8;
        const productsCount = await Product.countDocuments();
        let products = await features.query;
        let filteredProducts = await filterCount.query;
        let filteredProductsCount = products.length;
        return res.status(200).json({
            success: true,
            data: products,
            productsCount,
            filteredProductsCount,
            resultPerPage,
            filteredCount: filteredProducts.length
        })
    }
)
export const getAllCategories = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const product = await Product.find({});
        if (product.length === 0) {
            return next(new ErrorHandler("PRODUCTS IS EMPTY", 404));
        }
        const category = new Set<string>();
        product.forEach((item: any) => {
            category.add(item.category);
        });
        return res.status(200).json({
            success: true,
            data: Array.from(category),
        });
    }
)
export const getProductDetails = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const product = await Product.findById(req.params.id);
        if (!product) return next(new ErrorHandler("Product Not Found", 404));

        return res.status(200).json({
            success: true,
            data: product,
        })
    }
)

export const createProductReview = TryCatch(
    async (req: AuthenticatedRequestReview, res: Response, next: NextFunction) => {
        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return next(new ErrorHandler("User Not Authenticated", 406));
        }
        const { rating, comment, productId } = req.body;
        const review = {
            user: currentUser._id,
            name: currentUser.username,
            rating: Number(rating),
            comment,
        }
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product Not Found", 404));
        }
        const isReviewed = product.reviews.find(
            (rev) => (rev.user.toString()) === req.userId?.toString()
        );
        if (isReviewed) {
            product.reviews.forEach((rev: any) => {
                if (rev.user.toString() === req.userId?.toString())
                    (rev.rating = rating), (rev.comment = comment);
            });
        } else {
            product.reviews.push(review);
        }
        product.numOfReviews = product.reviews.length;
        let avg = 0;
        product.reviews.forEach((rev: any) => {
            avg += rev.rating;
        });
        product.ratings = avg / product.numOfReviews;
        await product.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
        })
    }
)

export const getProductReviews = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {



        const product = await Product.findById(req.params.id);
        if (!product) return next(new ErrorHandler("Product Not Found", 404));


        return res.status(200).json({
            success: true,
            data: product.reviews,
        })
    }
)
export const deleteReview = TryCatch(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

        const product = await Product.findById(req.params.id);
        if (!product) return next(new ErrorHandler("Product Not Found", 404));

        const reviews = product.reviews.filter((rev) =>
            (rev._id ? rev._id.toString() !== req.params.reviewId : "")
        )

        let avg = 0;
        reviews.forEach((rev: any) => {
            avg += rev.rating;
        })
        let ratings = 0;
        if (reviews.length === 0) {
            ratings = 0;
        } else {
            ratings = avg / reviews.length;
        }
        await Product.findByIdAndUpdate(req.params.id, {
            reviews,
            ratings,
            numOfReviews: reviews.length,
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })
        return res.status(200).json({
            success: true,
        })
    }
)

export const deleteProduct = TryCatch(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        const images = product.images || [];
        for (const image of images) {
            try {
                await cloudinary.uploader.destroy(image.imageId);
            } catch (err) {
                console.error(`Failed to delete image with ID ${image.imageId}:`, err);
            }
        }
        await Product.deleteOne({ _id: id });
        return res.status(200).json({
            success: true,
        })
    }

)


export const updateProduct = TryCatch(
    async (req: AuthenticatedProductUpdateRequest, res: Response, next: NextFunction) => {

        const { id } = req.params;
        const { name, description, price, category, stock } = req.body;
        const files = req.files as Express.Multer.File[];

        console.log("req.body", req.body);

        const product = await Product.findById(id);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        const updatedData: any = {};


        if (files && files.length > 0) {

            for (const image of product.images) {
                try {
                    await cloudinary.uploader.destroy(image.imageId);
                } catch (err) {
                    console.error(`Failed to delete image with ID ${image.imageId}:`, err);
                }
            }


            updatedData.images = [];


            for (const file of files) {
                const stream = Readable.from(file.buffer);
                try {
                    const result: any = await new Promise((resolve, reject) => {
                        const streamUpload = cloudinary.uploader.upload_stream(
                            { folder: "posts" },
                            (error, result) => {
                                if (result) resolve(result);
                                else reject(error);
                            }
                        );
                        stream.pipe(streamUpload);
                    });

                    updatedData.images.push({
                        imageId: result.public_id,
                        url: result.secure_url,
                    });
                } catch (error) {
                    return next(new ErrorHandler("Image upload failed", 500));
                }
            }
        }


        if (name && name !== product.name) updatedData.name = name;
        if (description && description !== product.description) updatedData.description = description;
        if (price && price !== product.price) updatedData.price = price;
        if (category && category !== product.category) updatedData.category = category;
        if (stock && stock !== product.stock) updatedData.stock = stock;




        await Product.updateOne({ _id: id }, { $set: updatedData });




        const newProduct = await Product.findById(id);
        return res.status(200).json({
            success: true,
            data: newProduct,
        });
    }
);
