import { Link } from 'react-router-dom'
import { useContext } from 'react'
import logo from "../assets/logo2.png";
import { AuthContext } from '../context/AuthContext.jsx'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import "../styles/navbar.css"

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext)
    const cartItems = useSelector((state) => state.cart.cartItems);

    const cartItemCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link
                    to="/"
                    className="navbar-logo"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        textDecoration: "none",
                    }}
                >
                    <img
                        src={logo}
                        alt="Shopnest Logo"
                        style={{
                            width: "85px",
                            height: "85px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            overflow: "hidden",
                            border: "2px solid #fff",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        }}
                    />

                    <span
                        style={{
                            fontSize: "32px",
                            fontWeight: "700",
                            background: "linear-gradient(90deg,#4f7df3,#d946ef)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Shopnest
                    </span>
                </Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Products</Link></li>
                <li><Link to="/cart">Cart ({cartItemCount})</Link></li>
                {user ? (
                    <>
                        <li><Link to="/profile">Hi {user.name}</Link></li>
                        {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
                        <li>
                            <button onClick={handleLogout} className="navbar-logout">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )

}

export default Navbar