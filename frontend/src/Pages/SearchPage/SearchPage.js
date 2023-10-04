import React, {useContext, useEffect, useState} from "react";
import SearchActivityCard from "../../components/SearchActivityCard/SearchActivityCard";
import "./SearchPage.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faChevronUp,
    faPersonBiking,
    faPersonRunning,
    faPersonSkating,
    faPersonWalking
} from "@fortawesome/free-solid-svg-icons";
import {Context} from "../../App";
import ModalStyles from "../../ModalStyles";
import Modal from "react-modal";

function SearchPage() {

    const isUserLogged = useContext(Context).isUserLogged;
    const userData = useContext(Context).userData;

    const [activities, setActivities] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [activityType, setActivityType] = useState("");
    const [cityOptionsVisible, setCityOptionsVisible] = useState(false);
    const [cityOptionsSuggestions, setCityOptionsSuggestions] = useState("");
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isInputActive, setInputActive] = useState(false);
    const [chosenOption, setChosenOption] = useState(null);
    const [activitiesFetched, setActivitiesFetched] = useState(false);
    const [showJoinedActivityModal, setShowJoinedActivityModal] = useState(false);
    const [isUserMobile, setIsUserMobile] = useState(false);
    const [touchStartY, setTouchStartY] = useState(null);
    const today = new Date().toISOString().split("T")[0];


    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsUserMobile(true)
        } else {
            setIsUserMobile(false);
        }
    }, [window.innerWidth])

    useEffect(() => {
        getActivities();
        getAllCities();
        setActivitiesFetched(true);
    }, [])

    useEffect(() => {
        const prevButton = document.querySelector('.search-button-prev');
        const nextButton = document.querySelector('.search-button-next');
        if (carouselIndex === 0) {
            prevButton.classList.add('disabled-button')
        } else {
            prevButton.classList.remove('disabled-button')
        }
        if (activitiesFetched && carouselIndex >= activities.length - 1) {
            nextButton.classList.add('disabled-button')
        } else {
            nextButton.classList.remove('disabled-button')
        }
    }, [carouselIndex, activities])

    useEffect(() => {
        const carousel = document.querySelector('.activities-carousel-visible')
        carousel.style.bottom = `${(carouselIndex - 1) * (isUserMobile ? 215 : 225)}px`;
    }, [carouselIndex])

    useEffect(() => {
        const handleCarouselScroll = (e) => {
            const scrollDelta = e.deltaY;
            const maxIndex = activities.length - 1;

            if (scrollDelta > 0 && carouselIndex < maxIndex) {
                setCarouselIndex(carouselIndex + 1);
            } else if (scrollDelta < 0 && carouselIndex > 0) {
                setCarouselIndex(carouselIndex - 1);
            }
        };

        const carouselElement = document.querySelector('.activities-carousel');

        if (carouselElement) {
            carouselElement.addEventListener('wheel', handleCarouselScroll);
            return () => {
                carouselElement.removeEventListener('wheel', handleCarouselScroll);
            };
        }
    }, [carouselIndex, activities]);


    useEffect(() => {
        if (isUserMobile) {

            const handleCarouselTouchStart = (e) => {
                setTouchStartY(e.touches[0].clientY);
            };

            const handleCarouselTouchMove = (e) => {
                if (touchStartY !== null) {
                    const touchMoveY = e.touches[0].clientY;
                    const deltaY = touchStartY - touchMoveY;
                    const maxIndex = activities.length - 1;

                    if (Math.abs(deltaY) >= 20) {
                        if (deltaY > 0 && carouselIndex < maxIndex) {
                            setCarouselIndex(carouselIndex + 1);
                        } else if (deltaY < 0 && carouselIndex > 0) {
                            setCarouselIndex(carouselIndex - 1);
                        }
                        setTouchStartY(null);
                    }
                }
            };
            const carouselElement = document.querySelector('.activities-carousel');
            if (carouselElement) {
                carouselElement.addEventListener('touchstart', handleCarouselTouchStart);
                carouselElement.addEventListener('touchmove', handleCarouselTouchMove);
                return () => {
                    carouselElement.removeEventListener('touchstart', handleCarouselTouchStart);
                    carouselElement.removeEventListener('touchmove', handleCarouselTouchMove);
                };
            }
        }
    }, [carouselIndex, activities, touchStartY]);

    const scrollToTop = () => {
        window.scrollTo({
            top: '0',
            behavior: 'smooth',
        });
    };
    const scrollToActivities = () => {
        const filtersContainer = document.querySelector('.activity-search-filters');
        console.log(filtersContainer.offsetHeight)
        window.scrollTo({
            top: filtersContainer.offsetHeight + 140,
            behavior: 'smooth'
        });
    };
    const handleCarouselPrev = () => {
        if (carouselIndex > 0) {
            setCarouselIndex(carouselIndex - 1);
        }
    };

    const handleCarouselNext = () => {
        if (carouselIndex < activities.length - 1) {
            setCarouselIndex(carouselIndex + 1);
        }
    };

    async function getActivities() {
        const response = await fetch("http://localhost:8080/activities/future");
        const activitiesData = await response.json();

        if (isUserLogged) {
            let filteredActivities = filterActivitiesIfEnrolled(activitiesData)
            let sortedFilteredActivities = filteredActivities.sort(chronologicalSort)
            setActivities(sortedFilteredActivities)
        } else {
            let sortedActivities = activitiesData.sort(chronologicalSort)
            setActivities(sortedActivities);
        }
    }

    function filterActivitiesIfEnrolled(activities) {
        return activities
            .filter(activity => !activity.participants.map(participant => participant.userId).includes(userData.userId))
    }

    async function getAllCities() {
        const response = await fetch("http://localhost:8080/activities/cities");
        const cities = await response.json();
        cities.sort();
        setCities(cities);
    }

    async function getFilteredActivities() {
        if (isUserMobile) {
            scrollToActivities();
        }
        setCarouselIndex(0);

        let url = "http://localhost:8080/activities/future";

        if (selectedCity !== "" || activityType !== "") {
            url = "http://localhost:8080/activities/filter";
            if (selectedCity !== "") {
                url += `?city=${selectedCity}`;
            }
            if (activityType !== "") {
                url += selectedCity !== "" ? `&type=${activityType}` : `?type=${activityType}`;
            }
        }

        const response = await fetch(url);

        let filteredActivities = await response.json();

        if (dateFrom !== "") {
            filteredActivities = filteredActivities.filter(activity => activity.date >= dateFrom);
        }

        if (dateTo !== "") {
            filteredActivities = filteredActivities.filter(activity => activity.date <= dateTo);
        }

        let sortedFilteredActivities = filteredActivities.sort(chronologicalSort)
        setActivities(filterActivitiesIfEnrolled(sortedFilteredActivities));
    }

    function resetFilter() {
        setActivityType("");
        setSelectedCity("");
        setCityOptionsSuggestions("")
        setDateFrom("");
        setDateTo("");
        setChosenOption(null);
        getActivities();
    }

    const closeSelectCity = () => {
        setCityOptionsVisible(false);
    };

    useEffect(() => {
        const handleBodyClick = (event) => {
            if (!event.target.classList.contains('city-select')) {
                closeSelectCity();
            }
        };

        window.addEventListener("click", (event) => handleBodyClick(event));

        return () => {
            window.removeEventListener("click", (event) => handleBodyClick(event));
        };
    }, []);

    useEffect(() => {
        const cityOptionsSpace = document.querySelector(".city-options-field");
        cityOptionsSpace.style.height = cityOptionsVisible ? '100px' : '0px';
        cityOptionsSpace.style.border = cityOptionsVisible ? '1px solid yellowgreen' : 'none';
    }, [cityOptionsVisible])

    useEffect(() => {
        getActivities();
    }, [userData, isUserLogged]);

    const handleCityClick = (selectedCity) => {
        setCityOptionsSuggestions(selectedCity);
        setSelectedCity(selectedCity);
    };

    function chronologicalSort(a, b) {
        const aDateTime = new Date(`${a.date} ${a.time}`);
        const bDateTime = new Date(`${b.date} ${b.time}`);
        return aDateTime - bDateTime;
    }

    function manageModalDisplay() {
        setShowJoinedActivityModal(true);
        setTimeout(() => {
            setShowJoinedActivityModal(false);
        }, 3000)
    }

    const enrollUserToActivity = (activityId) => {
        manageModalDisplay();
        fetch(`http://localhost:8080/users/enroll/${userData.userId}/${activityId}`, {
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
            .then(() => {
                setActivities(activities.filter(activity => activity.activityId !== activityId));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handleChosenOption = (option) => {
        if (chosenOption === option) {
            setChosenOption(null);
            setActivityType("");
        } else {
            setChosenOption(option);
            setActivityType(option);
        }
    };
    return (
        <div className="activity-search-page">
            <Modal
                isOpen={showJoinedActivityModal}
                onRequestClose={() => setShowJoinedActivityModal(false)}
                style={ModalStyles.smallModalStyles}
                className="activity-added-modal"
                appElement={document.querySelector("#root") || undefined}
            >
                You've successfully joined an activity!
            </Modal>
            <div className="activity-search-filters">
                <h2>Activity search filters</h2>
                <div className="choose-activity">
                    <h4>Select activity type</h4>
                    <div className="choose-activity-container">
                        <div className={`${chosenOption === 'RUNNING' ? 'search-activity-add' : 'search-activity'}`}
                             onClick={() => handleChosenOption('RUNNING')}
                        >
                            <FontAwesomeIcon icon={faPersonRunning} size="xl"/>
                            <p>Running</p>
                        </div>
                        <div className={`${chosenOption === 'WALKING' ? 'search-activity-add' : 'search-activity'}`}
                             onClick={() => handleChosenOption('WALKING')}
                        >
                            <FontAwesomeIcon icon={faPersonWalking} size="xl"/>
                            <p>Walking</p>
                        </div>
                        <div className={`${chosenOption === 'SKATING' ? 'search-activity-add' : 'search-activity'}`}
                             onClick={() => handleChosenOption('SKATING')}
                        >
                            <FontAwesomeIcon icon={faPersonSkating} size="xl"/>
                            <p>Skating</p>
                        </div>
                        <div className={`${chosenOption === 'CYCLING' ? 'search-activity-add' : 'search-activity'}`}
                             onClick={() => handleChosenOption('CYCLING')}
                        >
                            <FontAwesomeIcon icon={faPersonBiking} size="xl"/>
                            <p>Cycling</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="select-city">
                        <h4>
                            Select city
                        </h4>
                        <input type="text" value={cityOptionsSuggestions}
                               placeholder={isInputActive ? '' : 'Type...'}
                               onChange={(event) => {
                                   setCityOptionsSuggestions(event.target.value);
                                   setCityOptionsVisible(true);
                               }}
                               className="city-select"
                               onClick={() => {
                                   setCityOptionsVisible(true);
                                   setInputActive(true);
                               }}
                               onBlur={() => {
                                   setInputActive(false);
                               }}/>
                        <div className="city-options-field">
                            {cityOptionsVisible &&
                                <div className="city-options">
                                    {cities.filter(city => city.toString().toLowerCase().includes(cityOptionsSuggestions.toLocaleLowerCase())).map(city =>
                                        <div onClick={() => handleCityClick(city)} key={city}>
                                            {city}
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="date-filters">
                    <h4>Select date</h4>
                    <div className="date-from-filter">
                        <div>
                            <label htmlFor="dateFrom">Date from:</label>
                        </div>
                        <input
                            value={dateFrom}
                            type="date"
                            id="dateFrom"
                            name="dateFrom"
                            min={today}
                            onChange={(e) => {
                                setDateFrom(e.target.value)
                                if (e.target.value > dateTo && dateTo !== "") {
                                    setDateTo("")
                                }
                            }}
                        />
                    </div>
                    <div className="date-to-filter">
                        <div>
                            <label htmlFor="dateTo">Date to:</label>
                        </div>
                        <input
                            value={dateTo}
                            type="date"
                            id="dateTo"
                            name="dateTo"
                            min={dateFrom !== "" ? dateFrom : today}
                            onChange={(e) => setDateTo(e.target.value)}/>
                    </div>
                </div>

                <div className="filter-buttons">
                    <button className="filter-button" onClick={() => getFilteredActivities()}>Search</button>
                    <button className="reset-filters-button" onClick={() => resetFilter()}>Reset filters</button>
                </div>
            </div>
            <div className="found-activities">
                <button className="scroll-to-top-button" onClick={() => scrollToTop()}>
                    <FontAwesomeIcon icon={faChevronUp}/>
                </button>
                <div className="activities-carousel">
                    <div className="activities-carousel-visible">
                        {
                            activities.length > 0 ?
                                <div>
                                    {activities.map((activity, index) => (
                                        <div
                                            className={index === carouselIndex ? 'active-card' : 'non-active-card'}
                                            key={activity.activityId}
                                        >
                                            <SearchActivityCard
                                                activity={activity}
                                                handleJoinActivity={() => enrollUserToActivity(activity.activityId)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                :
                                <div>No activities found for requested criteria</div>
                        }
                    </div>
                    <div className="manage-searched-buttons">
                        <button className="search-button-prev disabled-button" onClick={handleCarouselPrev}>
                            <FontAwesomeIcon
                                icon={faAngleUp}/></button>
                        <button className="search-button-next" onClick={handleCarouselNext}><FontAwesomeIcon
                            icon={faAngleDown}/></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchPage;