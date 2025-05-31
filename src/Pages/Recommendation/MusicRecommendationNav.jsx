import React, { useState } from 'react';
import "./MusicRecommendationNav.css";
import profile_img from '../../Assets/profile_img.png';
import caret_icon from '../../Assets/caret_icon.svg';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";

const MusicRecommendationNav = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            localStorage.removeItem("authToken");
            navigate("/signin");
          })
          .catch((error) => {
            console.error("Sign-out error:", error);
          });
    };

    return (
        <div className='navbar'>
            <div className="navbar-left">
                <ul> 
                    <li onClick={() => navigate("/")}>Home</li>
                    <li onClick={() => navigate("/Recommendation")}>Movies Recommendation</li>
                    {/* <li>Recommendation</li> */}
                </ul>
            </div>
            <div className="navbar-right">
            
                <div className="navbar-profile">
                    {/* Clickable profile area (navigates to /profile) */}
                    <div className="profile-clickable" onClick={() => navigate('/profile')}>
                        <img src={profile_img} alt="Profile" className='profile'/>
                        <img src={caret_icon} alt="Menu" />
                    </div>
                    
                    {/* Dropdown with Sign Out button */}
                    <div className="dropdown">
                        <button onClick={handleSignOut}>Sign Out</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicRecommendationNav;
