import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPass) {
            setError("Passwords do not match");
            return;
        }
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
        const data = await response.json();
        if (response.ok) {
            navigate("/login");
        } else {
            setError(data.message);
        }

    }

    return (
        <div className="Register">
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">User Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required />
                </div>

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

                <div className="form-group">
                    <label htmlFor="Confirm">Confirm Password:</label>
                    <input
                        type="password"
                        id="Confirm"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        required />
                </div>

                <button>Register</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Register;