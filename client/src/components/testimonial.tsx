import { CgQuote } from "react-icons/cg";

const testimonials = [
    {
        id: 1,
        content: "The quality of products and customer service exceeded my expectations. I'm a loyal customer now!",
        author: "Sarah Johnson",
        role: "Verified Buyer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
        id: 2,
        content: "Fast shipping and amazing product selection. This is now my go-to shop for all my needs.",
        author: "Michael Chen",
        role: "Regular Customer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
        id: 3,
        content: "The attention to detail and product quality is outstanding. Highly recommend!",
        author: "Emma Davis",
        role: "Verified Buyer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
];

const Testimonials = () => {
    return (
        <div className="bg-orange-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        What Our Customers Say
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Don't just take our word for it - hear from our satisfied customers
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="relative rounded-2xl bg-white p-8 shadow-sm transition-transform hover:scale-105"
                        >
                            <CgQuote className="absolute top-4 right-4 h-8 w-8 text-blue-100" />
                            <div className="relative">
                                <p className="text-lg text-gray-600 italic">"{testimonial.content}"</p>
                                <div className="mt-6 flex items-center">
                                    <img
                                        className="h-12 w-12 rounded-full object-cover"
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                    />
                                    <div className="ml-4">
                                        <div className="text-base font-medium text-gray-900">{testimonial.author}</div>
                                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;