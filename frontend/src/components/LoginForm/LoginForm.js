import {useContext, useState} from "react";
import './LoginForm.css'
import {Context} from "../../App";
import {updateInfo} from "../functions";

function LoginForm({setDisplayLoginForm, setDisplayRegistrationForm}) {

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    })
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const setIsUserLogged = useContext(Context).setIsUserLogged;

    const handleOpenRegisterForm = () => {
        setDisplayRegistrationForm(true);
        setDisplayLoginForm(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8080/auth/authenticate", {
            "headers": {
                "Content-Type": "application/json"
            },
            "method": "POST",
            "body": JSON.stringify({
                "username": loginData.username,
                "password": loginData.password
            })
        }).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(data => {
                        setShowErrorMessage(false);
                        localStorage.setItem("jwt", "Bearer " + data.token);
                        localStorage.setItem("userId", data.userId);
                        setDisplayLoginForm(false);
                        setIsUserLogged(true);
                        console.log("Login successful");
                        // TODO wyświetlić użytkownikowi informację o pomyślnym zalogowaniu
                    })
            } else {
                console.log("Invalid Credentials")
                setShowErrorMessage(true);
                // TODO wyświetlić komunikat o niepoprawnych danych
            }
        })
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="username-field">
                <label className="username-label">Username</label>
                <input
                    className="username-input"
                    type="text"
                    id="username"
                    value={loginData.username}
                    onChange={(e) => updateInfo(setLoginData, "username", e.target.value)}
                ></input>
            </div>
            <div className="password-field">
                <label className="password-label">Password</label>
                <input
                    className="password-input"
                    type="password"
                    id="password"
                    value={loginData.password}
                    onChange={(e) => updateInfo(setLoginData, "password", e.target.value)}
                ></input>
            </div>
            {showErrorMessage &&
                <div className="log-error-message">
                    Incorrect username or password
                </div>
            }
            <button className="login-submit-btn" type="submit">Login</button>
            <p>Don't have an account?<br></br>
                <a className="register-link"
                   onClick={() => handleOpenRegisterForm()}>Register</a> instead!</p>
        </form>
    );
}

export default LoginForm;