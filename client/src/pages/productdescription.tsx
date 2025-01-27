import { useState } from "react";
import { useParams } from "react-router-dom";

import NavBar from "../components/navbar";
import Slider from "../components/slider";
import Footer from "../components/footer";

import { useGetProductQuery } from "../store/api";
import { addProduct } from "../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { ReviewFormDataType } from "../types/alltypes";
import { deleteReviewData, sendReviewData } from "../route";
import { FaMinus, FaPlus, FaShoppingCart, FaStar, FaTrash } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import SimilarProducts from "../components/similarProducts";

const ProductDescription = () => {
    const { id } = useParams();
    const user = useAppSelector((state) => state.user.user);
    const [reviewFormData, setReviewFormData] = useState<ReviewFormDataType>({
        comment: "",
        rate: "5",
        pid: id ? id : "",
    });

    const { data: fetchProductData, refetch } = useGetProductQuery(id ? id : "");
    const dispatch = useAppDispatch();
    const [itemQuantity, setItemQuantity] = useState<number>(1);

    const AddCart = () => {
        dispatch(
            addProduct({
                id: fetchProductData?.data?._id,
                name: fetchProductData?.data?.name,
                quantity: itemQuantity,
                imgUrl: fetchProductData?.data?.images[0].url,
                price: fetchProductData?.data?.price,
            })
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setReviewFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user.id) {
            alert("You are not logged in 😊");
            return;
        }
        const res = await sendReviewData(reviewFormData);
        if (res) {
            refetch();
            setReviewFormData((prev) => ({ ...prev, comment: "" }));
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        const res = await deleteReviewData(id, reviewId);
        if (res) {
            refetch();
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-orange-50">
            <NavBar />

            <div className="flex-1">
                <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
                    <div className="flex flex-col lg:flex-row gap-12">

                        <div className="w-full lg:w-1/2">
                            <Slider images={fetchProductData?.data?.images || []} />
                        </div>


                        <div className="w-full lg:w-1/2 space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
                                <div className="space-y-4">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {fetchProductData?.data?.name}
                                    </h1>
                                    <p className="text-gray-600 leading-relaxed">
                                        {fetchProductData?.data?.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-gray-900">
                                            ₹{fetchProductData?.data?.price}
                                        </span>
                                        <span className="text-sm text-gray-500">inclusive of all taxes</span>
                                    </div>
                                    {fetchProductData?.data?.ratings > 0 && (
                                        <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                                            <span className="text-green-700 font-medium">
                                                {fetchProductData?.data?.ratings}
                                            </span>
                                            <FaStar className="w-4 h-4 fill-green-500 text-green-500" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            disabled={itemQuantity === 1}
                                            onClick={() => setItemQuantity((prev) => prev - 1)}
                                        >
                                            <FaMinus className="w-5 h-5" />
                                        </button>
                                        <span className="text-xl font-medium w-12 text-center">
                                            {itemQuantity}
                                        </span>
                                        <button
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            disabled={itemQuantity === fetchProductData?.data?.stock}
                                            onClick={() => setItemQuantity((prev) => prev + 1)}
                                        >
                                            <FaPlus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {fetchProductData?.data?.stock > 0 ? (
                                        <button
                                            onClick={AddCart}
                                            className="flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                                        >
                                            <FaShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <div className="text-red-600 font-medium text-center py-2">
                                            Out of Stock
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">

                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <FaMessage className="w-6 h-6 text-gray-700" />
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Reviews{" "}
                                    {fetchProductData?.data?.numOfReviews > 0 && (
                                        <span className="text-gray-500 font-normal">
                                            ({fetchProductData?.data?.numOfReviews})
                                        </span>
                                    )}
                                </h2>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="mb-6 bg-white p-6 rounded-xl shadow-md"
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="text"
                                        name="comment"
                                        value={reviewFormData.comment}
                                        onChange={handleChange}
                                        placeholder="Write your review here..."
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <select
                                        name="rate"
                                        value={reviewFormData.rate}
                                        onChange={handleChange}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        {[5, 4, 3, 2, 1].map((num) => (
                                            <option key={num} value={num}>
                                                {num} ⭐
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="submit"
                                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors "
                                    >
                                        <IoSend className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-4">
                                {fetchProductData?.data?.reviews.map((item: any) => (
                                    <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                <div className="flex gap-1 mt-1">
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className={`w-4 h-4 ${i < item.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "fill-gray-200 text-gray-200"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {item.user === user.id && (
                                                <button
                                                    onClick={() => handleDeleteReview(item._id)}
                                                    className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <FaTrash className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-600">{item.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div>

                            <SimilarProducts category={fetchProductData?.data?.category || ""} currentProductId={id || ""} />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDescription;
