import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import './AdditionalUserInfoForm.css'
import Modal from "react-modal";
import additionalProfileInfoModalStyles from "../../ModalStyles";
import {useRef} from 'react';
import {Context} from "../../App";
import {convertBase64, updateInfo} from "../functions";
import blankProfilePicture from "../../assets/images/blank-profile-picture.jpg"

function AdditionalUserInfoForm() {
    const userData = useContext(Context).userData;
    const [additionalInfo, setAdditionalInfo] = useState({
        city: "",
        preferredActivity: null,
        description: "",
        selectedImage: ""
    })
    const navigate = useNavigate();
    const uploadImageRef = useRef(null);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const base64 = await convertBase64(file);
        updateInfo(setAdditionalInfo, "selectedImage", base64);
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        userData.description = additionalInfo.description;
        userData.city = additionalInfo.city;
        userData.preferredActivity = additionalInfo.preferredActivity;
        if (additionalInfo.selectedImage) {
            userData.userPhoto = additionalInfo.selectedImage.split(",")[1];
        }

        fetch(`http://localhost:8080/users/update/${localStorage.getItem("userId")}`, {
            headers: {Authorization: localStorage.getItem("jwt"), "Content-Type": "application/json"},
            method: "PATCH",
            body: JSON.stringify({
                "city": additionalInfo.city,
                "preferredActivity": additionalInfo.preferredActivity,
                "description": additionalInfo.description,
                "userPhoto": additionalInfo.selectedImage.split(",")[1]
            })
        }).then(response => {
            if (response.status === 200) {
                console.log("Update info successful");
                navigate(`/profile/${userData.userId}`)
            } else {
                console.log("something went wrong")
            }
        })
    }

    return (
        <div className="additional-info">
            <Modal
                isOpen={true}
                style={additionalProfileInfoModalStyles}
                className="additional-info-modal"
            >
                <h4 className="additional-info-title">Please fill this form, so we can provide you more
                    personalized activities</h4>
                <form className="additional-info-form" onSubmit={handleSubmit}>
                    <div className="form-container">
                        <div>
                            <div>
                                <button className="custom-file-button" type="button" onClick={() => uploadImageRef.current.click()}>
                                    <img className='profile-picture' alt='profile picture'
                                         src={additionalInfo.selectedImage ? additionalInfo.selectedImage : blankProfilePicture}></img>
                                    <div className='change-photo-button'>
                                        Click to change
                                    </div>
                                </button>
                                <input
                                    ref={uploadImageRef}

                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    onChange={handleImageUpload}
                                    style={{display: 'none'}}
                                />
                            </div>
                        </div>
                        <div className="additional-info-form-right-side">
                            <div className="city-field">
                                <label className="city-label">City</label>
                                <textarea
                                    className="city-input"
                                    id="city"
                                    value={additionalInfo.city}
                                    onChange={e => updateInfo(setAdditionalInfo, "city", e.target.value)}
                                ></textarea>
                            </div>
                            <div className="profile-description-field">
                                <label className="profile-description-label">Description</label>
                                <textarea className="profile-description-input"
                                    id="description"
                                    value={additionalInfo.description}
                                    onChange={e => updateInfo(setAdditionalInfo, "description", e.target.value)}>
                                </textarea>
                            </div>
                            <div className="preferred-activity-field">
                                <label className="preferred-activity-label">Preferred activity</label>
                                <select
                                    className="preferred-activity-select"
                                    id="preferred-activity"
                                    defaultValue="Select"
                                    style={{color: additionalInfo.preferredActivity ? 'black' : 'grey'}}
                                    onChange={e => updateInfo(setAdditionalInfo, "preferredActivity", e.target.value)}
                                >
                                    <option hidden value="Select">Select</option>
                                    <option style={{color: 'black'}} value="SKATING">Skating</option>
                                    <option style={{color: 'black'}} value="CYCLING">Cycling</option>
                                    <option style={{color: 'black'}} value="WALKING">Walking</option>
                                    <option style={{color: 'black'}} value="RUNNING">Running</option>
                                </select>
                            </div>
                            <div className='additional-info-submit-btn-container'>
                                <button className="additional-info-submit-btn" type="submit">Update</button>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
        ;
}

export default AdditionalUserInfoForm;