import './Navbar.css'
import {Link, useHref, useNavigate} from "react-router-dom";
import React, {useContext, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFacebook, faGithub, faYoutube} from "@fortawesome/free-brands-svg-icons";
import {faAt, faChevronLeft, faEnvelope, faLaptopCode, faX} from "@fortawesome/free-solid-svg-icons";
import MobileMenu from "../MobileMenu/MobileMenu";
import {Context} from "../../App";
import logo from "../../assets/images/logo.png"

function Navbar({setDisplayLoginForm, handleLogout}) {

    const isUserLogged = useContext(Context).isUserLogged;
    const userData = useContext(Context).userData;
    const navigate = useNavigate();

    const [displayMedia, setDisplayMedia] = useState(false);
    const [mediaContainerOpen, setMediaContainerOpen] = useState(true);
    const displayMediaTimer = () => {
        setTimeout(() => {
            setDisplayMedia(true);
            setMediaContainerOpen(true);
        }, 5000)
    }

    const handleContactRedirect = async () => {
        await navigate("/about");
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'auto',
        });
    };

    function handleGithubRedirect() {
        return window.open("https://github.com/CodecoolGlobal/el-proyecte-grande-sprint-1-java-dmrozik87", '_blank');
    }

    return (
        <nav className="navbar">
            <div className='logo'>
                <Link to='/' className='logo-btn'>
                    <img src={logo} alt="logo GoMove"/>
                </Link>
            </div>
            <div className="mobile-menu">
                <MobileMenu isUserLogged={isUserLogged} setDisplayLoginForm={setDisplayLoginForm}
                            handleLogout={handleLogout}/>
            </div>
            <div className="PC-menu">
                <ul className="nav-links">
                    <Link to='/search' className='nav-btn'>
                        <li>Search</li>
                    </Link>
                    <Link to='/about' className='nav-btn'>
                        <li>About Us</li>
                    </Link>

                    <Link
                        to={isUserLogged ? '/add-activity' : '#'}
                        className='add-activity-btn'
                        onClick={() => {
                            if (!isUserLogged) {
                                setDisplayLoginForm(true);
                            }
                        }}
                    >
                        <li>Add Activity</li>
                    </Link>
                </ul>
                <div
                    className={`media ${displayMedia ? 'media-displayed' : 'media-undisplayed'}`}>
                    {!displayMedia && displayMediaTimer()}
                    <div className={`media-container-${mediaContainerOpen ? 'open' : 'closed'}`}>
                        <button className="open-close-media-btn"
                                onClick={() => setMediaContainerOpen(!mediaContainerOpen)}>
                            <FontAwesomeIcon icon={mediaContainerOpen ? faX : faChevronLeft}/></button>
                        <a onClick={() => handleContactRedirect()}><FontAwesomeIcon className='media-btn' icon={faEnvelope}
                                                                             size="2x" style={{color: "#90ee90"}}/></a>
                        <FontAwesomeIcon className='media-btn' icon={faYoutube} size="2x" style={{color: "#fa3333"}}/>
                        <a onClick={() => handleGithubRedirect()}><FontAwesomeIcon
                            className='media-btn' icon={faGithub} size="2x" style={{color: "#FFFFFF"}}/></a>
                    </div>
                </div>
            </div>
            <div className="login-and-profile-container">
                {
                    isUserLogged && <Link to={`/profile/${userData.userId}`} className='nav-btn'>
                        <li>Profile</li>
                    </Link>
                }
                {
                    !isUserLogged &&
                    <a className='login-btn' onClick={() => setDisplayLoginForm(true)}>
                        Login
                    </a>
                }
                {
                    isUserLogged && <a className='login-btn' onClick={() => handleLogout()}>
                        Logout
                    </a>
                }
            </div>
        </nav>
    );
}

export default Navbar;