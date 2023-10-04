import './App.css';
import Navbar from "./components/Navbar/Navbar";
import React, {useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import LoginForm from "./components/LoginForm/LoginForm";
import Modal from "react-modal";
import ModalStyles from "./ModalStyles";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import ActivityAddedModal from "./components/ActivityAddedModal/ActivityAddedModal";
import ActivityDeleteModal from "./components/ActivityDeleteModal/ActivityDeleteModal";

export const Context = React.createContext();

function App() {
    const [isUserLogged, setIsUserLogged] = useState(localStorage.getItem("userId") !== "" && localStorage.getItem("userId") !== null);
    const [displayLoginForm, setDisplayLoginForm] = useState(false)
    const [displayRegistrationForm, setDisplayRegistrationForm] = useState(false);
    const [displayActivityAddedModal, setDisplayActivityAddedModal] = useState(false);
    const [displayActivityDeleteModal, setDisplayActivityDeleteModal] = useState(false);
    const [userData, setUserData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (isUserLogged) {
            fetch(`http://localhost:8080/users/${localStorage.getItem("userId")}`, {
                headers: {
                    Authorization: localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(userData => setUserData(userData));
        }
    }, [isUserLogged])

    function handleLogout() {
        localStorage.setItem("userId", "");
        localStorage.setItem("jwt", "");
        setIsUserLogged(false);
        navigate("/");
        console.log("Logout successful");
    }

    function closeForms() {
        setDisplayLoginForm(false);
        setDisplayRegistrationForm(false);
        setDisplayActivityDeleteModal(false);
    }

    return (
        <Context.Provider value={{
            isUserLogged: isUserLogged,
            setIsUserLogged: setIsUserLogged,
            setDisplayLoginForm: setDisplayLoginForm,
            setDisplayActivityAddedModal: setDisplayActivityAddedModal,
            setDisplayActivityDeleteModal: setDisplayActivityDeleteModal,
            userData: userData
        }}>
            <div className="App">
                <Navbar setDisplayLoginForm={setDisplayLoginForm} handleLogout={handleLogout}/>
                <Modal
                    isOpen={displayLoginForm || displayRegistrationForm}
                    onRequestClose={() => closeForms()}
                    contentLabel="Login-modal"
                    style={ModalStyles.loginFormModalStyles}
                    className="login-modal"
                >
                    {displayLoginForm && <LoginForm setDisplayLoginForm={setDisplayLoginForm}
                                                    setDisplayRegistrationForm={setDisplayRegistrationForm}
                    />}
                    {displayRegistrationForm && <RegistrationForm setDisplayLoginForm={setDisplayLoginForm}
                                                                  setDisplayRegistrationForm={setDisplayRegistrationForm}
                    />}
                </Modal>
                <Modal
                    isOpen={displayActivityAddedModal}
                    style={ModalStyles.smallModalStyles}
                    className="activity-added-modal"
                    appElement={document.querySelector("#root") || undefined}
                >
                    {displayActivityAddedModal && <ActivityAddedModal/>}
                </Modal>
                <Modal
                    isOpen={displayActivityDeleteModal}
                    onRequestClose={() => closeForms()}
                    style={ModalStyles.activityDeletedModalStyles}
                    className="activity-deleted-modal"
                    appElement={document.querySelector("#root") || undefined}
                >
                    {displayActivityDeleteModal && <ActivityDeleteModal/>}
                </Modal>
                <Outlet/>
            </div>
        </Context.Provider>
    );
}

export default App;
