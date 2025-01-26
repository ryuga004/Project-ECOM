const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 border-8 border-t-8 border-gray-600 border-solid rounded-full animate-spin"></div>
                <div className="absolute text-white font-bold text-xl animate-pulse">
                    Loading...
                </div>
            </div>
        </div>
    );
};

export default Loader;
