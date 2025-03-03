


import { useState } from "react";
import { CgShoppingCart } from "react-icons/cg";
import { RiLoginBoxFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

import { logoutUser } from "../../route";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { clearUser } from "../../store/userSlice";



const AdminNavBar = () => {
    const navigate = useNavigate();
    const cartProducts = useAppSelector((state) => state.cart.cartProduct);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();
    const handleLogout = async () => {
        const response = await logoutUser();
        if (response) {
            dispatch((clearUser()));
            navigate("/login");
        }
    };
    return (
        <>
            <nav className="NavBarContainer">
                <div>
                    <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>ECOMERCE</h2>
                </div>

                <div >
                    <CgShoppingCart onClick={() => navigate("/cart")} style={{ cursor: "pointer" }} size={30} />
                    {
                        cartProducts.length > 0 && <span>{cartProducts.length}</span>
                    }
                    <div>
                        {user.profileImage ? <img onClick={() => setIsOpen(!isOpen)} src={user.profileImage} style={{ height: "5rem", width: "5rem", cursor: "pointer" }} /> : <RiLoginBoxFill size={35} onClick={() => navigate("/login")} style={{ cursor: "pointer" }} />}
                        <div>
                            <dialog open={isOpen}>

                                <ul>
                                    <li><Link to="/myorders">MyOrders</Link></li>
                                    <li onClick={() => handleLogout()}>Logout</li>
                                </ul>

                            </dialog>
                        </div>
                    </div>
                </div>

            </nav >
            {/* <div className="BannerContainer">
                <img src="" alt="banner" />
            </div> */}
        </>
    )
}

export default AdminNavBar