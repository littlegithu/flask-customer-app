import { useState } from "react";

const SERVER_URL = "http://localhost:5000";

export default function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Login successful!");
                console.log("Login response:", data);
                // Clear form
                setUser({ email: "", password: "" });
            } else {
                setMessage("Login failed: " + data.error);
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    return (
        <div className="login-container" style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Enter email address"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required
                        style={{ padding: "8px", margin: "5px 0", width: "100%" }}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        required
                        style={{ padding: "8px", margin: "5px 0", width: "100%" }}
                    />
                </div>
                <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
                    Login
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}