import React from 'react';
import './ErrorPage.css'

const ErrorPage = () => {
    const errorMessages = [
        "Houston, we have a problem",
        "404 Error: Humor not found",
        "Uh oh, it looks like you broke something",
        "The page is lost, but not forgotten",
        "Oh no! The gremlins took this page",
        "You must be lost, but don't worry, we'll find you!",
    ];
    const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];

    return (
        <div className="error-page">
            <h1>{randomMessage}</h1>
            <img src="https://media.giphy.com/media/10uJ0mCn4Ku5iI/giphy.gif" alt="404 error" />
            <p>Please check the URL or try again later.</p>
        </div>
    );
};

export default ErrorPage;