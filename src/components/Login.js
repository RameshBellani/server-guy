import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../Context/NewContext";
import "./Login.css";

const Login = () => {
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const { login } = useContext(Context);
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsernameInput(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPasswordInput(e.target.value);
    };

    const handlePasswordToggle = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = () => {
        if (usernameInput.trim() === "") {
            alert("Please enter a valid username.");
            setUsernameInput("");
        } else if (passwordInput.trim() === "") {
            alert("Please enter a valid password.");
            setPasswordInput("");
        } else {
            login(usernameInput);  
            navigate("/dashboard");
        }
    };

    return (
        <div className="login-bg-container">
            <div className="login-form">
                <div className="logo-con">
            <img
                className="logo"
                src="https://res.cloudinary.com/dwffepf9q/image/upload/v1730545520/ugal2hh8jb0jkjrdc8fx.png" alt=""/>
                
                <h1 className="login-heading">Login</h1>
                </div>
                <label className="login-label" htmlFor="username">Username</label>
                <input
                    className="login-input"
                    type="text"
                    id="username"
                    placeholder="serverguy"
                    value={usernameInput}
                    onChange={handleUsernameChange}
                />
                <label className="login-label" htmlFor="password">Password</label>
                <div className="password-input-container">
                    <input
                        className="login-input"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="12345"
                        value={passwordInput}
                        onChange={handlePasswordChange}
                    />
                    <span className="password-toggle" onClick={handlePasswordToggle}>
                        {showPassword ? "👁️" : "👁️‍🗨️"} 
                    </span>
                </div>
                <button type="button" className="login-button" onClick={handleSubmit}>
                    Login
                </button>
                <div className="login-footer">
                    <p>Don't have an account? <a href="/register">Register here</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
