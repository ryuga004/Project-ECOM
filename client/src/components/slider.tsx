import { useState } from "react";
import { SliderType } from "../types/propsType";
import { CgChevronLeft, CgChevronRight, CgZoomIn, CgZoomOut } from "react-icons/cg";

const Slider = ({ images }: SliderType) => {
    const [index, setIndex] = useState<number>(0);
    const [isZoomed, setIsZoomed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const handlePrevious = () => {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleImageLoad = () => {
        setLoading(false);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4 lg:p-8 w-full max-w-7xl mx-auto">

            <nav className="flex gap-2 lg:flex-col order-2 lg:order-1">
                {images?.map((item, idx: number) => (
                    <button
                        key={item.imageId}
                        className={`relative flex-shrink-0 cursor-pointer transition-all duration-300 
                            ${idx === index
                                ? 'ring-2 ring-blue-500 ring-offset-2'
                                : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1'
                            }`}
                        onClick={() => setIndex(idx)}
                        onMouseOver={() => setIndex(idx)}
                    >
                        <img
                            src={item?.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg"
                            loading="lazy"
                        />
                        {idx === index && (
                            <div className="absolute inset-0 bg-blue-500/10 rounded-lg" />
                        )}
                    </button>
                ))}
            </nav>


            <main className="relative flex-1 order-1 lg:order-2">
                <div className={`relative aspect-square lg:aspect-[1] w-full overflow-hidden rounded-xl bg-gray-50 
                    ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                >
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    <img
                        src={images[index]?.url}
                        alt={`Image ${index + 1}`}
                        className={`w-full h-full transition-all duration-500 ease-out
                            ${isZoomed ? 'scale-150' : 'scale-100'}
                            ${loading ? 'opacity-0' : 'opacity-100'}
                            object-cover`}
                        onLoad={handleImageLoad}
                        onClick={() => setIsZoomed(!isZoomed)}
                    />


                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
                        <button
                            onClick={handlePrevious}
                            className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
                            aria-label="Previous image"
                        >
                            <CgChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
                            aria-label="Next image"
                        >
                            <CgChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                    </div>


                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="absolute bottom-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg 
                            hover:bg-white transition-all opacity-0 hover:opacity-100"
                        aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                    >
                        {isZoomed ? (
                            <CgZoomOut className="w-5 h-5 text-gray-800" />
                        ) : (
                            <CgZoomIn className="w-5 h-5 text-gray-800" />
                        )}
                    </button>


                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm 
                        text-sm font-medium text-gray-800">
                        {index + 1} / {images.length}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Slider;