import './HomePage.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useState} from "react";
import ActivityCard from "./ActivityCard";
import {Context} from "../../App";
import {Link} from 'react-router-dom';
import ModalStyles from "../../ModalStyles";
import Modal from "react-modal";

function HomePage() {
    const isUserLogged = useContext(Context).isUserLogged;
    const setDisplayLoginForm = useContext(Context).setDisplayLoginForm;
    const userData = useContext(Context).userData;

    const [activities, setActivities] = useState([]);
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [showNoMoreActivitiesModal, setShowNoMoreActivitiesModal] = useState(false);
    const [showJoinedActivityModal, setShowJoinedActivityModal] = useState(false);


    useEffect(() => {
        fetchActivities();
    }, [userData, isUserLogged]);

    function filterActivities(activities) {
        return activities
            .filter(activity => !activity.participants.map(participant => participant.userId).includes(userData.userId))
            .filter(activity => activity.city === userData.city)
            .filter(activity => activity.activityType === userData.preferredActivity);
    }

    const fetchActivities = async () => {
        try {
            const response = await fetch('http://localhost:8080/activities/future');
            const activitiesData = await response.json();
            if (isUserLogged) {
                let filteredActivities = filterActivities(activitiesData)
                let sortedFilteredActivities = filteredActivities.sort(chronologicalSort)
                setActivities(sortedFilteredActivities)
            } else {
                let sortedActivities = activitiesData.sort(chronologicalSort)
                setActivities(sortedActivities);
            }
            setCurrentActivityIndex(0);

        } catch (error) {
            console.error('Błąd podczas pobierania aktywności:', error);
        }
    };

    function chronologicalSort(a, b) {
        const aDateTime = new Date(`${a.date} ${a.time}`);
        const bDateTime = new Date(`${b.date} ${b.time}`);
        return aDateTime - bDateTime;
    }

    const fetchNextActivity = () => {
        if (currentActivityIndex < activities.length - 1) {
            setCurrentActivityIndex(currentActivityIndex + 1);
        } else {
            setShowNoMoreActivitiesModal(true);
            setTimeout(() => {
                setShowNoMoreActivitiesModal(false)
            }, 3000)
            fetchActivities();
        }
    };
    const enrollUserToActivity = () => {
        fetch(`http://localhost:8080/users/enroll/${userData.userId}/${activities[currentActivityIndex].activityId}`, {
            method: 'PATCH',
            headers: {
                "Authorization": localStorage.getItem("jwt"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Enrollment failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    const handleAcceptActivity = async () => {
        const card = document.querySelector('.card');
        card.style.right = '-50vw';
        card.style.transform = 'scale(0)';
        setTimeout(() => {
            card.style.transition = 'transform .5s'
            card.style.right = '0vw';
            card.style.transform = 'scale(1)';
            fetchNextActivity();
        }, 800)
        card.style.transition = 'transform .5s, right .5s'
        await enrollUserToActivity();
        await fetchNextActivity();
        setShowJoinedActivityModal(true);
        setTimeout(() => {
            setShowJoinedActivityModal(false);
        }, 3000)
    };
    const handleDeleteActivity = () => {
        const card = document.querySelector('.card');
        card.style.right = '50vw';
        card.style.transform = 'scale(0)';
        setTimeout(() => {
            card.style.transition = 'transform .5s'
            card.style.right = '0vw';
            card.style.transform = 'scale(1)';
            fetchNextActivity();
        }, 500)
        card.style.transition = 'transform .5s, right .5s'
    }
    return (
        <div className="background-container">
            <div className='home-page'>
                <Modal
                    isOpen={showJoinedActivityModal}
                    onRequestClose={() => setShowJoinedActivityModal(false)}
                    contentLabel="joined-activity-modal"
                    style={ModalStyles.joinedActivityModalStyles}
                    className="joined-activity-modal"
                >
                    <h3>
                        Succesfully joined to activity!
                    </h3>
                </Modal>
                <Modal
                    isOpen={showNoMoreActivitiesModal}
                    onRequestClose={() => setShowNoMoreActivitiesModal(false)}
                    contentLabel="no-more-activities-modal"
                    style={ModalStyles.noMoreActivitiesModalStyles}
                    className="no-more-activities-modal"
                >
                    <h3>
                        There are no activities left.
                        <br/>
                        You've been taken back to first one.
                    </h3>
                </Modal>
                {activities.length > 0 ? (
                    <div className='delete-activity' onClick={() => handleDeleteActivity()}>
                        <FontAwesomeIcon icon={faXmark} size="2xl" style={{color: "#000000",}}/>
                    </div>

                ) : <></>}


                <div className='card-activity'>
                    {activities.length > 0 ? (
                        <ActivityCard activity={activities[currentActivityIndex]}
                                      handleDeleteActivity={handleDeleteActivity}
                                      handleAcceptActivity={handleAcceptActivity}
                                      setDisplayLoginForm={setDisplayLoginForm}
                                      isUserLogged={isUserLogged}/>
                    ) : (
                        <div className={"no-more-activities"}>
                            <h3>
                                We don't have more activities with Your preferences
                            </h3>

                            <Link to="/search" className={"go-to-search"}>
                                <p>Go to search to find more</p>
                            </Link>


                        </div>


                    )}
                </div>

                {activities.length > 0 ? (
                    <div className='accept-activity' onClick={() => {
                        isUserLogged ? handleAcceptActivity() : setDisplayLoginForm(true)
                    }}>
                        <FontAwesomeIcon icon={faCheck} size="2xl" style={{color: "#000000"}}/>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}

export default HomePage;
