import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import './RegistrationForm.css'
import {Context} from "../../App";
import {updateInfo} from "../functions";

function RegistrationForm({setDisplayLoginForm, setDisplayRegistrationForm}) {
    const [registrationData, setRegistrationData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [errorMessage, setErrorMessage] = useState([]);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState([]);
    const navigate = useNavigate();

    const setIsUserLogged = useContext(Context).setIsUserLogged;

    const handleOpenLoginForm = () => {
        setDisplayRegistrationForm(false);
        setDisplayLoginForm(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateRegisterForm()) {
            return;
        }
        fetch("http://localhost:8080/auth/register", {
            "headers": {
                "Content-Type": "application/json"
            },
            "method": "POST",
            "body": JSON.stringify({
                "username": registrationData.username,
                "email": registrationData.email,
                "password": registrationData.password
            })
        }).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(data => {
                        localStorage.setItem("jwt", "Bearer " + data.token);
                        localStorage.setItem("userId", data.userId);
                        setDisplayRegistrationForm(false);
                        setIsUserLogged(true)
                        console.log("Registration successful");
                    })
                navigate("/additional-info-form")
            } else {
                console.log("Username or E-mail already exists")
                setErrorMessage(["Username or E-mail already in use"])
            }
        })
    };

    function validateRegisterForm() {
        const errors = [];
        if (registrationData.username.trim().length < 4) {
            errors.push("username has to be at least 4 characters long");
        }
        if (registrationData.username.trim().length > 16) {
            errors.push("username can contain up to 16 characters")
        }
        if (!validateEmail(registrationData.email)) {
            errors.push("provided e-mail adress is incorrect");
        }
        if (registrationData.password !== registrationData.confirmPassword) {
            errors.push("passwords doesn't match")
        }
        setErrorMessage(errors);
        return !(!validatePassword(registrationData.password) || errorMessage.length > 0);
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function validatePassword(password) {
        const minLength = 8;
        const minLowercase = 1;
        const minUppercase = 1;
        const minDigits = 1;
        const minSpecialChars = 1;
        const specialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
        const errors = [];

        if (password.length < minLength) {
            errors.push("be " + minLength + " characters long");
        }

        const lowercaseCount = (password.match(/[a-z]/g) || []).length;
        if (lowercaseCount < minLowercase) {
            errors.push("have " + minLowercase + " lowercase characters");
        }

        const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
        if (uppercaseCount < minUppercase) {
            errors.push("have " + minUppercase + " uppercase characters");
        }

        const digitCount = (password.match(/\d/g) || []).length;
        if (digitCount < minDigits) {
            errors.push("have at least " + minDigits + " digits");
        }

        const specialCharCount = (password.match(specialChars) || []).length;
        if (specialCharCount < minSpecialChars) {
            errors.push("have at least " + minSpecialChars + " special characters");
        }

        setPasswordErrorMessage(errors);

        return errors.length === 0;
    }

    useEffect(() => {
        const registrationForm = document.querySelector('.registration-form');
        const newModalSize = registrationForm.scrollHeight + 40 + 'px';
        const modal = document.querySelector('.login-modal');
        modal.style.height = newModalSize;
        modal.style.top = `calc(50vh - ${newModalSize}/2)`;
    }, [errorMessage, passwordErrorMessage]);


    return (
        <div>
            <form className="registration-form" onSubmit={handleSubmit}>
                <div className="username-field">
                    <label className="username-label">Username</label>
                    <input
                        className="username-input"
                        type="text"
                        id="username"
                        value={registrationData.username}
                        onChange={(e) => updateInfo(setRegistrationData, "username", e.target.value)}
                    ></input>
                </div>
                <div className="e-mail-field">
                    <label className="e-mail-label">E-mail</label>
                    <input
                        className="e-mail-input"
                        type="text"
                        id="e-mail"
                        value={registrationData.email}
                        onChange={(e) => updateInfo(setRegistrationData, "email", e.target.value)}
                    ></input>
                </div>
                <div className="password-field">
                    <label className="password-label">Password</label>
                    <input
                        className="password-input"
                        type="password"
                        id="password"
                        value={registrationData.password}
                        onChange={(e) => updateInfo(setRegistrationData, "password", e.target.value)}
                    ></input>
                </div>
                <div className="confirm-password-field">
                    <label className="confirm-password-label">Confirm password</label>
                    <input
                        className="confirm-password-input"
                        type="password"
                        id="confirm-password"
                        value={registrationData.confirmPassword}
                        onChange={(e) => updateInfo(setRegistrationData, "confirmPassword", e.target.value)}
                    ></input>
                </div>
                <button className="register-submit-btn" type="submit">Register</button>
                <div className={errorMessage.length > 0 || passwordErrorMessage.length > 0 ? "errors-space" : ""}>
                    {errorMessage.length > 0 && (
                        <div>
                            <ul>
                                {errorMessage.map((message, index) => (
                                    <li className="error-mesage" key={index}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    )
                    }
                    {
                        passwordErrorMessage.length > 0 && (
                            <div>
                                <p>Password has to:</p>
                                <ul>
                                    {passwordErrorMessage.map((message, index) => (
                                        <li className="error-mesage" key={index}>{message}</li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }
                </div>
                <p>Already have an account?<br></br>
                    <a className="register-link"
                       onClick={() => handleOpenLoginForm()}>Login</a> instead!</p>
            </form>
        </div>
    )
}

export default RegistrationForm;
