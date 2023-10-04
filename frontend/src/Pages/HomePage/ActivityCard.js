import React, {useEffect, useState} from 'react';
import './ActivityCard.css';
import GoogleMapComponent from "../../components/GoogleMap/GoogleMap";
import {useNavigate} from "react-router-dom";
import {iconSelector, photoSelector} from '../../components/functions'
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function ActivityCard({activity, setDisplayLoginForm, handleAcceptActivity, handleDeleteActivity, isUserLogged}) {

    const [showMap, setShowMap] = useState(false);
    const [isUserMobile, setIsUserMobile] = useState(false);
    const [startX, setStartX] = useState(null);
    const [offsetX, setOffsetX] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsUserMobile(true)
        } else {
            setIsUserMobile(false);
        }
    }, [window.innerWidth])
    const navigateToActivityPage = (e) => {
        const mapButton = document.querySelector('.map-button button')
        if (e.target !== mapButton) {
            navigate(`/activity-page/${activity.activityId}`)
        }
    }

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (startX !== null) {
            const currentX = e.touches[0].clientX;
            const newOffsetX = currentX - startX;
            setOffsetX(newOffsetX);
        }
    };

    const handleTouchEnd = () => {
        if (offsetX < 180 && offsetX > -180) {
            setOffsetX(0);
        }
        setStartX(null);
    };
    useEffect(() => {
        const gradientBg = document.querySelector('.background-container');
        if (offsetX < -180) {
            setOffsetX(-300);
            setTimeout(() => {
                handleDeleteActivity()
            gradientBg.style.backgroundPosition = `50% 0`;
            }, 400)
        } else if (offsetX > 180) {
            setOffsetX(300);
            setTimeout(() => {
                isUserLogged ? handleAcceptActivity() : setDisplayLoginForm(true);
            gradientBg.style.backgroundPosition = `50% 0`;
            }, 400)
        }
        gradientBg.style.backgroundPosition = `${50 + offsetX / 2 > 0 ? 50 + offsetX / 2 < 100 ? 50 + offsetX / 2 : 100 : 0}% 0`;
    }, [offsetX])
    return (
        <div className="card"
             onClick={(e) => navigateToActivityPage(e)}
             onTouchStart={isUserMobile ? handleTouchStart : undefined}
             onTouchMove={isUserMobile ? handleTouchMove : undefined}
             onTouchEnd={isUserMobile ? handleTouchEnd : undefined}
             style={isUserMobile ? {transform: `translateX(${1.5 * offsetX}px)`} : {}}
        >
            <div
                className="top-section"
            >
                <div className="activity-photo">
                    <img
                        src={activity.activityPhoto ? 'data:image/jpeg;base64,' + activity.activityPhoto : photoSelector(activity.activityType)}
                        alt="Activity"/>
                </div>
                <div className="title-section">
                    <div className="activityCard-icon">{iconSelector(activity.activityType)}</div>
                    <h2>{activity.title}</h2>
                </div>
            </div>
            <div className="card-changeable-space">
                <div className={showMap ? "map-side" : "no-map-side"}>
                    <div className="middle-section">
                        <div className="location">
                            <h3>Location: </h3>
                            <p>{activity.address}</p>
                        </div>
                        <div className="datetime">
                            <h3>Date: </h3>
                            <p>{activity.date}, {activity.time.substring(0, 5)}</p>
                        </div>
                    </div>
                    <div className="bottom-section">
                        <div className="description">
                            <h3>Description: </h3>
                            {activity.description.length > 120 ?
                                <p>{activity.description.substring(0, 120)}...</p>
                                :
                                <p>{activity.description}</p>
                            }
                        </div>
                        <div className="participants-container">
                            <h3>Participants: </h3>
                            <div className="participants">
                                <FontAwesomeIcon icon={faUser} style={{color: "#FFFFFF",}}/>
                                <h2>{activity.participants.length}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="map-button">
                        <button
                            onClick={() => setShowMap(!showMap)}>{showMap ? "Back to details" : "See on map"}</button>
                    </div>
                    <div className="google-maps">
                        <GoogleMapComponent height={isUserMobile ? 'calc(60vh - 150px)' : '270px'}
                                            width={isUserMobile ? '70vw' : '400px'}
                                            address={`${activity.address}`}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityCard;