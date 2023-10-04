import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import AboutUsPage from "./Pages/AboutUsPage/AboutUsPage";
import HomePage from "./Pages/HomePage/HomePage";
import SearchPage from "./Pages/SearchPage/SearchPage";
import ActivityPage from "./Pages/ActivityPage/ActivityPage";
import AddActivity from "./components/AddActivity/AddActivity";
import Profile from "./components/Profile/Profile";
import AdditionalUserInfoForm from "./components/AdditionalUserInfoForm/AdditionalUserInfoForm";
import UpdateUserInfoForm from "./components/UpdateUserInfoForm/UpdateUserInfoForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <HomePage/>
            },
            {
                path: "/about",
                element: <AboutUsPage/>
            },
            {
                path: "/search",
                element: <SearchPage/>
            },
            {
                path: "/profile/:userId",
                element: <Profile/>
            },

            {
                path: "/activity-page/:activityId",
                element: <ActivityPage/>
            },

            {
                path: "/add-activity",
                element: <AddActivity/>
            },
            {
                path: "/additional-info-form",
                element:<AdditionalUserInfoForm/>
            },
            {
                path: "/update-info",
                element:<UpdateUserInfoForm/>
            }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

