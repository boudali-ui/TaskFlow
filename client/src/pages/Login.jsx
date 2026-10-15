import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } else {
            setError(data.message);
        }
    }

    return (
        <div className="login">
            <h1>Sign in to TaskFlow</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Enter Your Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Enter Your Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                <button>Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Login;