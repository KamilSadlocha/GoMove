import './AboutUsPage.css'
import {useEffect, useRef, useState} from "react";
import testPhoto from '../../assets/images/cycling.jpg';
import DominikPhoto from '../../assets/images/Dominik.png';
import MichalPhoto from '../../assets/images/Michal.png';
import KamilPhoto from '../../assets/images/Kamil.jpg';
import JakubPhoto from '../..//assets/images/Jakub_Szczygiel.jpeg';
import IgnacyPhoto from '../../assets/images/Ignacy.jpg';
import emailjs from '@emailjs/browser';
import Modal from "react-modal";
import ModalStyles from "../../ModalStyles";

const arrayOfOwners = [
    {
        id: 1,
        name: "Dominik Mrozik",
        desc: "Hi, I'm Dominik, and I absolutely love road and gravel biking. For me, cycling is not just a hobby, it is an important part of my life. Biking gives me that perfect mix of freedom and challenge that I can't get enough of.\n" + "\n" + "I firmly believe that the discipline and consistency developed through regular training on the bike can have an effect into every aspect of life. Whether it's conquering a challenging hill climb or tackling a demanding project, I've learned that sticking with it and staying dedicated are the keys to success.",
        photo: DominikPhoto
    },
    {
        id: 2,
        name: "Kamil Sadłocha",
        desc: "My name is Kamil and my passion is mountain trips and discovering previously unexplored landscapes. Apart from learning programming and designing applications, I play retro games and learn the history of their creation. Additionally, I am an explorer of the musical world, often searching Spotify for original and intriguing sounds.",
        photo: KamilPhoto

    },
    {
        id: 3,
        name: "Ignacy Gąsiorowski",
        desc: "Hello, I'm Ignacy. I'm 20-year-old graduate of a music school, specializing in the cello. Outside the world of music, my diverse interests include programming, rock climbing, mountain hiking, and immersing myself in a wide range of musical genres. I have a deep love for outdoor activities, which made creating this app all the more entertaining for me.",
        photo: IgnacyPhoto
    },
    {
        id: 4,
        name: "Michał Jeleniewski",
        desc: "Hi! I'm Michał. I'm 19-year-old full-stack developer and student of law and economy. Besides programming, I'm keen on martial arts and calisthenics. In my opinion being psychically active is key to long and satisfying life, so I'm glad that I've got the chance of encouraging others to do so!",
        photo: MichalPhoto
    },
    {
        id: 5,
        name: "Jakub Szczygieł",
        desc: "\n" +
            "As a Full-Stack Developer, I possess a broad knowledge and skill set for creating comprehensive software solutions. My experience allows me to craft innovative products on both the front-end and back-end. I am ready to work in a dynamic team environment and contribute to technical advancements. My programming skills and passion serve as a strong foundation for further growth in this field. Additionally, I have a strong interest in sports, particularly football, and enjoy hiking in the mountains.",
        photo: JakubPhoto
    }
]

function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

const emailJSServiceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const emailJSTemplateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const emailJSPublicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;


function AboutUsPage() {
    const [creators, setCreators] = useState(shuffleArray(arrayOfOwners));

    const form = useRef();

    const [showEmailSentModal, setShowEmailSentModal] = useState(false)


    const [formData, setFormData] = useState({
        user_name: "",
        user_email: "",
        message: "",
    });

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                emailJSServiceId,
                emailJSTemplateId,
                form.current,
                emailJSPublicKey
            )
            .then(
                (result) => {
                    console.log(result.text);
                    setFormData({
                        user_name: "",
                        user_email: "",
                        message: "",
                    });
                    setShowEmailSentModal(true);
                    setTimeout(() => {
                        setShowEmailSentModal(false)
                    }, 3000)
                },
                (error) => {
                    console.log(error.text);
                    alert("Email sending failed. Please try again later.");
                }
            );
    };


    useEffect(() => {
        const handleScroll = () => {
            creators.forEach(creator => {
                const element = document.getElementById(creator.id.toString());
                const rect = element.getBoundingClientRect();
                if (creator === creators[0]) {
                    element.classList.add('visible');
                }
                if (rect.top < window.innerHeight) {
                    element.classList.add('visible');
                } else {
                    element.classList.remove('visible');
                }
            });
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [creators]);

    return (
        <div className="about-us-page">
            <div className="title-section">
                <h1>About GoMove</h1>
                <p>GoMove is an innovative project that inspires people to actively spend time outdoors in groups.
                    Our
                    platform makes it easy to organize sports and recreational meetings with friends and individuals
                    who
                    share similar interests. Whether you're into jogging, cycling, or any other outdoor activity,
                    GoMove is the place that helps you find company for shared outdoor adventures. Join us today and
                    embrace an active lifestyle together with friends!
                </p>
            </div>
            <hr/>
            <div className="creators">
                {creators.map((creator) => (
                    <div className="creator" id={creator.id} key={creator.id}>
                        <div className="img">
                            <img src={creator.photo} alt="ourPhoto"/>
                        </div>
                        <div className="content">
                            <div className="link">
                                <h1>{creator.name}</h1>
                                <p>{creator.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <hr/>
            <div className="contact">
                <div className="contact-container">
                    <div className="title">
                        <p>Contact</p>
                        <p>Submit the form below to get in touch with Us!</p>
                    </div>
                    <div className="message">
                        <form ref={form} onSubmit={sendEmail}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="user_name"
                                value={formData.user_name}
                                onChange={(e) =>
                                    setFormData({...formData, user_name: e.target.value})
                                }
                                required={true}
                                minLength={8}
                                maxLength={64}
                            />
                            <label>Email</label>
                            <input
                                type="email"
                                name="user_email"
                                value={formData.user_email}
                                onChange={(e) =>
                                    setFormData({...formData, user_email: e.target.value})
                                }
                                required={true}
                                minLength={8}
                                maxLength={64}
                            />
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({...formData, message: e.target.value})
                                }
                                style={{resize: "none"}}
                                required={true}
                                minLength={8}
                                maxLength={1024}
                            />
                            <input className="contact-btn" type="submit" value="Send"/>
                        </form>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={showEmailSentModal}
                onRequestClose={() => setShowEmailSentModal(false)}
                style={ModalStyles.smallModalStyles}
                appElement={document.querySelector("#root") || undefined}
                className="email-sent-modal">
                <h3>Email sent</h3>
            </Modal>
        </div>
    );
}

export default AboutUsPage;