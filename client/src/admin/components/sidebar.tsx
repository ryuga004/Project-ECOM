import { useState } from "react";
import { FaHome, FaSignOutAlt, FaSlidersH, FaUser } from "react-icons/fa";
import { HiClipboardList } from "react-icons/hi";
import { IoBag } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../route";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { clearUser } from "../../store/userSlice";

const SideBar = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user.user);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        const response = await logoutUser();
        if (response) {
            dispatch(clearUser());
            navigate("/login");
        }
    };

    return (
        <aside
            className={`bg-gradient-to-b from-purple-50 to-white shadow-lg h-screen flex flex-col items-center w-${drawerOpen ? "64" : "20"
                } transition-all duration-300 px-4`}
        >

            <div
                className="w-full flex items-center justify-start py-4 px-2 cursor-pointer"
                onClick={() => setDrawerOpen(!drawerOpen)}
            >
                <FaSlidersH className="text-gray-500 text-xl hover:text-blue-600 transition-all duration-200" />
            </div>


            <div className="w-full flex flex-col items-center mt-6">
                {user.profileImage && (
                    <img
                        src={user.profileImage}
                        alt="Profile"
                        className="rounded-full w-16 h-16 object-cover shadow-md"
                    />
                )}
                {drawerOpen && user.username && (
                    <span className="hidden md:block text-gray-800 mt-3 text-sm font-semibold">
                        {user.username.toUpperCase()}
                    </span>
                )}
            </div>


            <ul className="flex flex-col w-full mt-8 space-y-3">
                <li
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-all duration-200"
                    onClick={() => navigate("/admin")}
                >
                    <MdDashboard className="text-lg text-blue-500" />
                    {drawerOpen && <span className="ml-4 text-gray-700 font-medium">Dashboard</span>}
                </li>
                <li
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-all duration-200"
                    onClick={() => navigate("/admin-customer")}
                >
                    <FaUser className="text-lg text-blue-500" />
                    {drawerOpen && <span className="ml-4 text-gray-700 font-medium">Customers</span>}
                </li>
                <li
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-all duration-200"
                    onClick={() => navigate("/admin-product")}
                >
                    <IoBag className="text-lg text-blue-500" />
                    {drawerOpen && <span className="ml-4 text-gray-700 font-medium">Products</span>}
                </li>
                <li
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-all duration-200"
                    onClick={() => navigate("/admin-order")}
                >
                    <HiClipboardList className="text-lg text-blue-500" />
                    {drawerOpen && <span className="ml-4 text-gray-700 font-medium">Orders</span>}
                </li>
                <li
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-all duration-200"
                    onClick={() => navigate("/")}
                >
                    <FaHome className="text-lg text-blue-500" />
                    {drawerOpen && <span className="ml-4 text-gray-700 font-medium">Home</span>}
                </li>
                <li
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-red-100 cursor-pointer transition-all duration-200"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className="text-lg text-red-500" />
                    {drawerOpen && <span className="ml-4 text-gray-700 font-medium">Logout</span>}
                </li>
            </ul>



        </aside>
    );
};

export default SideBar;
