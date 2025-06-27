import React, { useEffect } from 'react';
import '../styles/landing.css';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("usertype");
    if (userType === 'freelancer') navigate("/freelancer");
    else if (userType === 'client') navigate("/client");
    else if (userType === 'admin') navigate("/admin");
  }, [navigate]);

  return (
    <div className="landing-container">
      <div className="landing-navbar">
        <h2 className="logo">Job <span>Hunt</span></h2>
        <button className="signin-btn" onClick={() => navigate('/authenticate')}>Sign In</button>
      </div>

      <div className="landing-hero">
        <div className="landing-content">
          <h1 className="headline">Where Talent Meets Opportunity</h1>
          <p className="subtext">
            Join SB Works, the premier freelancing platform tailored to connect experts with meaningful work. Showcase your skills, grow your network, and land the job you deserve.
          </p>
          <button className="cta-btn" onClick={() => navigate('/authenticate')}>Get Started</button>
        </div>
        <div className="landing-image" />
      </div>
    </div>
  );
};

export default Landing;
