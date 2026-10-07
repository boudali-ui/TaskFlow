import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav>
            {!token && (<><Link to={"/login"}>Login</Link>
                <Link to={"/register"}>Register</Link></>)}
            {token && (<><Link to={"/dashboard"}>Dashboard</Link>
                <button onClick={handleLogout}>Logout</button></>)}
        </nav>
    );
}

export default Navbar;