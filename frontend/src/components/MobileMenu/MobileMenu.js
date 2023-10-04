import React, {useState} from "react";
import './MobileMenu.css';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faYoutube, faGithub} from "@fortawesome/free-brands-svg-icons";

function MobileMenu({isUserLogged, setDisplayLoginForm, handleLogout}) {
    const [showMenu, setShowMenu] = useState(false);

    const handleMenuChange = () =>{
        setShowMenu(!showMenu)
        const pageEl = document.querySelector('.App > div')
        const newOpacity = showMenu ? 1 : 0.5;
        pageEl.style.transition = 'opacity .5s'
        pageEl.style.opacity = newOpacity;
    }
    return (<div>
        <div className='menu-icon' onClick={() => handleMenuChange()}>
            <FontAwesomeIcon icon={showMenu ? faChevronUp : faBars} size="2x" style={{color: "#90EE90FF"}}/>
        </div>
        <div className="mobile-menu-space">
            <div className={`mobile-menu-${showMenu ? 'open' : 'closed'}`}>
                <div className={`nav-links-mobile`}>
                    <Link to='/search' onClick={() => setShowMenu(false)}  className='nav-btn-mobile'>
                        Search
                    </Link>
                    <Link to='/about' onClick={() => setShowMenu(false)} className='nav-btn-mobile'>
                        About Us
                    </Link>
                    <Link to='/add-activity' onClick={() => setShowMenu(false)}  className='add-activity-btn'>
                        Add Activity
                    </Link>
                </div>
                <div className="login-and-profile-container-mobile">
                    {
                        isUserLogged && <Link to='/profile' className='nav-btn'>
                            <li>Profile</li>
                        </Link>
                    }
                    {
                        !isUserLogged &&
                        <button className='login-btn' onClick={() => setDisplayLoginForm(true)}>
                            Login
                        </button>
                    }
                    {
                        isUserLogged && <button className='login-btn' onClick={() => handleLogout()}>
                            Logout
                        </button>
                    }
                </div>
                <div className="media-mobile">
                    <a><FontAwesomeIcon className='media-btn' icon={faFacebook} size="2x"
                                        style={{color: "#2b75f6"}}/></a>
                    <a><FontAwesomeIcon className='media-btn' icon={faYoutube} size="2x"
                                        style={{color: "#fa3333"}}/></a>
                    <a><FontAwesomeIcon className='media-btn' icon={faGithub} size="2x"
                                        style={{color: "#1E3050"}}/></a>
                </div>
            </div>
        </div>
    </div>)
}

export default MobileMenu;
