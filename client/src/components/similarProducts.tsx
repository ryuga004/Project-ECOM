
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../store/api';
import { useEffect, useState } from 'react';

const SimilarProducts = ({ category, currentProductId }: { category: string; currentProductId: string }) => {
    const getProducts = useGetProductsQuery({
        categoryName: category || "All",
        searchKeyword: "",
        CurrentPage: 1,
    });

    const [similarProducts, setSimilarProducts] = useState<any[]>([]);

    useEffect(() => {

        if (getProducts.isSuccess) {

            const filteredProducts = getProducts?.data?.data
                .filter((product: any) => product.category === category && product._id !== currentProductId)
                .slice(0, 5);


            setSimilarProducts(filteredProducts);
        }
    }, [getProducts, category, currentProductId]);



    console.log("Similar Products:", similarProducts);

    return (
        <div className="bg-orange-50 py-16">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
                        <p className="mt-2 text-gray-500">You might also like these products</p>
                    </div>
                    <Link
                        to="/"
                        className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        View All
                        <FaArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1  gap-6">
                    {similarProducts.map((product: any) => (
                        <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                                <img
                                    src={product?.images[0]?.url}
                                    alt={product?.name}
                                    className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h3>
                                <div className="mt-2 flex items-center">
                                    <FaStar className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                    <span className="text-sm text-blue-600 group-hover:text-blue-700 transition-colors">
                                        View Details
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-6 sm:hidden">
                    <Link
                        to="/"
                        className="flex items-center justify-center w-full px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        View All Similar Products
                        <FaArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SimilarProducts;