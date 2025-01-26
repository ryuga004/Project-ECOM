import { useEffect, useRef, useState } from "react";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";
import { ImageBannerProps } from "../types/propsType";

const ImageBanner = ({ title, description }: ImageBannerProps) => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const images = [
        "https://res.cloudinary.com/ddnkhbxqd/image/upload/v1737789824/bannerImage1_t5lesh.png",
        "https://res.cloudinary.com/ddnkhbxqd/image/upload/v1737789823/bannerImage2_ic4wag.png",
        "https://res.cloudinary.com/ddnkhbxqd/image/upload/v1737789823/bannerImage3_lpsh6l.png",
    ];


    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(slideInterval);
    }, [images.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const handleScrollDown = () => {
        window.scrollBy({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div className="absolute inset-0">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <img
                            className="w-full h-full object-cover transform scale-105 transition-transform duration-[2000ms]"
                            src={image}
                            alt={`Banner Image ${index + 1}`}
                        />
                    </div>
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
            </div>

            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all duration-200 group"
                aria-label="Previous slide"
            >
                <CgChevronLeft className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all duration-200 group"
                aria-label="Next slide"
            >
                <CgChevronRight className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                            ? "bg-white w-8"
                            : "bg-white/50 hover:bg-white/75"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6 sm:p-8 md:p-12">
                <div className="max-w-4xl mx-auto space-y-6 transform">
                    <h2
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight"
                        style={{
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                        }}
                    >
                        {title}
                    </h2>
                    <p
                        className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto"
                        style={{
                            textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                        }}
                    >
                        {description}
                    </p>
                    <button
                        onClick={handleScrollDown}
                        className="px-8 py-4 bg-orange-600 text-white text-lg font-medium rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-600/25"
                    >
                        Explore Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageBanner;
