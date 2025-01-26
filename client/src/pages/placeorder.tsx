import { useEffect, useState } from "react";
import Footer from "../components/footer";
import NavBar from "../components/navbar";
import { placeOrderData } from "../route";
import { useAppSelector } from "../store/hook";
import { OrderItemTypeShipping, shippingDataType } from "../types/alltypes";
import { toast } from "react-toastify";
import { RiRedPacketFill } from "react-icons/ri";
import { FaCreditCard, FaTruck } from "react-icons/fa";

const PlaceOrder = () => {
    const user = useAppSelector((state) => state.user.user);
    const cartProduct = useAppSelector((state) => state.cart.cartProduct);

    const [shippingFormData, setShippingFormData] = useState<shippingDataType>({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        phoneNo: "",
        orderedItems: [],
        user: user.id,
        paymentInfo: {
            id: "16546161",
            status: "paid",
        },
        itemsPrice: 0,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        orderStatus: "pending",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const itemsPrice = cartProduct.reduce((total, item) => total + item.price * item.quantity, 0);
        const taxPrice = itemsPrice * 0.05;
        const shippingPrice = itemsPrice * 0.2;
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        const orderedItems: OrderItemTypeShipping[] = cartProduct.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.imgUrl,
            product: item.id,
        }));

        setShippingFormData((prev) => ({
            ...prev,
            orderedItems,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderStatus: "Processing",
        }));
    }, [cartProduct]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await placeOrderData({
                shippingInfo: {
                    address: shippingFormData.address,
                    city: shippingFormData.city,
                    state: shippingFormData.state,
                    country: shippingFormData.country,
                    pinCode: shippingFormData.pinCode,
                    phoneNo: shippingFormData.phoneNo,
                },
                orderItems: shippingFormData.orderedItems,
                paymentInfo: shippingFormData.paymentInfo,
                itemsPrice: shippingFormData.itemsPrice,
                taxPrice: shippingFormData.taxPrice,
                shippingPrice: shippingFormData.shippingPrice,
                totalPrice: shippingFormData.totalPrice,
            });

            if (res) {
                toast.success("Order placed successfully!");
            }
        } catch (error) {
            toast.error("Failed to place the order. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">

                    <div className="flex justify-between items-center max-w-2xl mx-auto mb-8">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white">
                                <RiRedPacketFill className="w-5 h-5" />
                            </div>
                            <span className="text-sm mt-2">Order Details</span>
                        </div>
                        <div className="flex-1 h-1 bg-orange-200 mx-4"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white">
                                <FaTruck className="w-5 h-5" />
                            </div>
                            <span className="text-sm mt-2">Shipping</span>
                        </div>
                        <div className="flex-1 h-1 bg-orange-200 mx-4"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white">
                                <FaCreditCard className="w-5 h-5" />
                            </div>
                            <span className="text-sm mt-2">Payment</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-4 px-4 font-medium text-gray-600">Product</th>
                                                <th className="text-left py-4 px-4 font-medium text-gray-600">Quantity</th>
                                                <th className="text-right py-4 px-4 font-medium text-gray-600">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartProduct.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-100">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center space-x-4">
                                                            <img
                                                                src={item.imgUrl}
                                                                alt={item.name}
                                                                className="h-16 w-16 object-cover rounded-lg"
                                                            />
                                                            <span className="font-medium text-gray-900">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-600">{item.quantity}</td>
                                                    <td className="py-4 px-4 text-right text-gray-900">₹{item.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{shippingFormData.itemsPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>₹{shippingFormData.taxPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>₹{shippingFormData.shippingPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t">
                                        <span>Total</span>
                                        <span>₹{shippingFormData.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {[
                                        { field: "address", label: "Street Address" },
                                        { field: "city", label: "City" },
                                        { field: "state", label: "State" },
                                        { field: "country", label: "Country" },
                                        { field: "pinCode", label: "PIN Code" },
                                        { field: "phoneNo", label: "Phone Number" },
                                    ].map(({ field, label }) => (
                                        <div key={field}>
                                            <label
                                                htmlFor={field}
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                {label}
                                            </label>
                                            <input
                                                type="text"
                                                name={field}
                                                id={field}
                                                value={(shippingFormData as any)[field]}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ease-in-out"
                                                required
                                            />
                                        </div>
                                    ))}

                                    <button
                                        type="submit"
                                        className="w-full py-4 px-6 bg-orange-600 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-700 focus:ring-4 focus:ring-orange-500/50 transition-all duration-200 ease-in-out mt-8"
                                    >
                                        Proceed to Pay ₹{shippingFormData.totalPrice}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PlaceOrder;