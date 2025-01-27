import { FaClock, FaCreditCard, FaTruck } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";

const features = [
    {
        name: 'Secure Shopping',
        description: 'Shop with confidence with our secure payment system and data protection.',
        icon: FaShield,
    },
    {
        name: 'Fast Delivery',
        description: 'Get your orders delivered quickly with our efficient shipping service.',
        icon: FaTruck,
    },
    {
        name: '24/7 Support',
        description: 'Our customer support team is available around the clock to help you.',
        icon: FaClock,
    },
    {
        name: 'Easy Returns',
        description: '30-day return policy for a hassle-free shopping experience.',
        icon: FaCreditCard,
    },
];

const Features = () => {
    return (
        <div className="bg-orange-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Why Choose Us
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        We provide the best shopping experience for our customers
                    </p>
                </div>

                <div className="mt-12">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative">
                                <div className="absolute inset-0 rounded-2xl bg-blue-50 transform -rotate-6 scale-95 transition-transform group-hover:rotate-0"></div>
                                <div className="relative rounded-2xl bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.name}</h3>
                                    <p className="mt-2 text-gray-500">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;