import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPersonBiking, faPersonRunning, faPersonSkating, faPersonWalking} from "@fortawesome/free-solid-svg-icons";
import runningPhoto from "../assets/images/running.jpg";
import cyclingPhoto from "../assets/images/cycling.jpg";
import walkingPhoto from "../assets/images/walking.jpg";
import skatingPhoto from "../assets/images/skating.jpg";
import React from "react";

export function iconSelector(activityType) {
    let iconToDisplay;
    switch (activityType) {
        case "RUNNING":
            iconToDisplay = <FontAwesomeIcon icon={faPersonRunning} size="2xl"/>
            break;
        case "CYCLING":
            iconToDisplay = <FontAwesomeIcon icon={faPersonBiking} size="2xl"/>
            break;
        case "WALKING":
            iconToDisplay = <FontAwesomeIcon icon={faPersonWalking} size="2xl"/>
            break;
        case "SKATING":
            iconToDisplay = <FontAwesomeIcon icon={faPersonSkating} size="2xl"/>
            break;
    }
    return iconToDisplay;
}

export function photoSelector(activityType) {
    let photoToDisplay;
    switch (activityType) {
        case "RUNNING":
            photoToDisplay = runningPhoto;
            break;
        case "CYCLING":
            photoToDisplay = cyclingPhoto;
            break;
        case "WALKING":
            photoToDisplay = walkingPhoto
            break;
        case "SKATING":
            photoToDisplay = skatingPhoto;
            break;
    }
    return photoToDisplay;
}

export function updateInfo(func, property, value) {
    const properties = property.split(".");
    func(prevInfo => {
        let currentObj = { ...prevInfo };
        let currentRef = currentObj;

        for (let i = 0; i < properties.length - 1; i++) {
            const prop = properties[i];
            currentRef[prop] = { ...currentRef[prop] };
            currentRef = currentRef[prop];
        }

        currentRef[properties[properties.length - 1]] = value;

        return currentObj;
    });
}

export function convertBase64(file)  {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}
