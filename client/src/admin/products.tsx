import { useEffect, useState } from "react";
import { AdiminUpdateProduct, getAdminAddProduct, getAdminProductDelete, getAdminProducts } from "../route";
import { formDataTypeProduct } from "./admintypes";
import SideBar from "./components/sidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlusCircle, FaStar, FaStarHalf, FaTrash } from "react-icons/fa";
import { FaBoxesPacking, FaXmark } from "react-icons/fa6";
import { RiEdit2Fill, RiImageAddFill } from "react-icons/ri";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

const AdminProduct = () => {
    const [product, setProduct] = useState<Array<any>>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAdminProducts();
            if (res) setProduct(res.data);
        } catch (error) {
            toast.error("Failed to fetch products");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await getAdminProductDelete(id);
                if (res) {
                    toast.success("Product deleted successfully!");
                    fetchData();
                }
            } catch (error) {
                toast.error("Failed to delete product");
            }
        }
    };

    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState<number>(0);
    const totalPages = Math.ceil(product.length / itemsPerPage);

    const renderRatingStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        return (
            <div className="flex items-center gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {hasHalfStar && <FaStarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                {[...Array(5 - Math.ceil(rating))].map((_, i) => (
                    <FaStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                ))}
            </div>
        );
    };

    const renderTableData = () => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        if (loading) {
            return (
                <tr>
                    <td colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span className="text-gray-500">Loading products...</span>
                        </div>
                    </td>
                </tr>
            );
        }

        if (product.length === 0) {
            return (
                <tr>
                    <td colSpan={7} className="text-center py-8">
                        <FaBoxesPacking className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No products found</p>
                    </td>
                </tr>
            );
        }

        return product.slice(startIndex, endIndex).map((item, index) => (
            <tr key={startIndex + index} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                    <div className="relative group">
                        <img
                            src={item?.images[0]?.url}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg"></div>
                    </div>
                </td>
                <td className="p-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                </td>
                <td className="p-4">
                    <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                        {item.category}
                    </span>
                </td>
                <td className="p-4">{renderRatingStars(item.ratings)}</td>
                <td className="p-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${item.stock > 10
                        ? 'bg-green-50 text-green-700'
                        : item.stock > 0
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                        {item.stock} units
                    </span>
                </td>
                <td className="p-4">
                    <div className="font-medium text-gray-900">
                        ₹{item.price.toLocaleString()}
                    </div>
                </td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setModal(true); setEditingProduct(item); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit product"
                        >
                            <RiEdit2Fill className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete product"
                        >
                            <FaTrash className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    const [formData, setFormData] = useState<formDataTypeProduct>({
        name: "",
        description: "",
        stock: 0,
        category: "",
        price: 0,
    });
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFiles(e.dataTransfer.files);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setSelectedFiles(files);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const productData = new FormData();
        productData.append("name", formData.name);
        productData.append("description", formData.description);
        productData.append("price", formData.price.toString());
        productData.append("category", formData.category);
        productData.append("stock", formData.stock.toString());


        if (selectedFiles) {
            Array.from(selectedFiles).forEach(file => {
                productData.append("image", file);
            });
        }

        try {

            const res = editingProduct ? (await AdiminUpdateProduct(productData, editingProduct._id)) : (await getAdminAddProduct(productData));
            if (res) {

                toast.success(editingProduct ? "Product updated successfully!" : "Product created successfully!");
                fetchData();
                setModal(false);
                resetForm();
            }
        } catch (error) {
            toast.error(editingProduct ? "Failed to update product" : "Failed to create product");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            stock: 0,
            category: "",
            price: 0,
        });
        setSelectedFiles(null);
        setEditingProduct(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name,
                description: editingProduct.description,
                stock: editingProduct.stock,
                category: editingProduct.category,
                price: editingProduct.price,
            });
        }
    }, [editingProduct]);

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <SideBar />
            <main className="flex-1 p-6 lg:p-8">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    theme="light"
                />

                {!modal ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                            <button
                                onClick={() => setModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaPlusCircle className="w-5 h-5" />
                                <span>Add Product</span>
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="p-4 text-left text-sm font-medium text-gray-600">Image</th>
                                            <th className="p-4 text-left text-sm font-medium text-gray-600">Details</th>
                                            <th className="p-4 text-left text-sm font-medium text-gray-600">Category</th>
                                            <th className="p-4 text-left text-sm font-medium text-gray-600">Rating</th>
                                            <th className="p-4 text-left text-sm font-medium text-gray-600">Stock</th>
                                            <th className="p-4 text-left text-sm font-medium text-gray-600">Price</th>
                                            <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {renderTableData()}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-700">
                                            Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, product.length)} of {product.length} products
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <CgChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm font-medium text-gray-700">
                                            Page {currentPage + 1} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages - 1}
                                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <CgChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {editingProduct ? "Edit Product" : "Add New Product"}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setModal(false);
                                            resetForm();
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FaXmark className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Product Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter product description"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                                Category
                                            </label>
                                            <input
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter category"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                                Price (₹)
                                            </label>
                                            <input
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter price"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                                                Stock
                                            </label>
                                            <input
                                                id="stock"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleChange}
                                                type="number"
                                                min="0"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter stock quantity"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Product Images
                                        </label>
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <div className="space-y-2">
                                                <RiImageAddFill className="w-8 h-8 mx-auto text-gray-400" />
                                                <div className="text-sm text-gray-600">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer">
                                                        <span className="text-blue-600 hover:text-blue-700">
                                                            Click to upload
                                                        </span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            multiple
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 10MB
                                                </p>
                                            </div>
                                            {selectedFiles && (
                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-500">
                                                        {selectedFiles.length} file(s) selected
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setModal(false);
                                                resetForm();
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            {editingProduct ? "Update Product" : "Create Product"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminProduct;