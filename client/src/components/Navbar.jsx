import React, { useContext } from 'react';
import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const usertype = localStorage.getItem('usertype');
  const { logout } = useContext(GeneralContext);

  const renderLinks = () => {
    switch (usertype) {
      case 'freelancer':
        return (
          <>
            <p onClick={() => navigate('/freelancer')}>Dashboard</p>
            <p onClick={() => navigate('/all-projects')}>All Projects</p>
            <p onClick={() => navigate('/my-projects')}>My Projects</p>
            <p onClick={() => navigate('/myApplications')}>Applications</p>
            <p onClick={logout}>Logout</p>
          </>
        );
      case 'client':
        return (
          <>
            <p onClick={() => navigate('/client')}>Dashboard</p>
            <p onClick={() => navigate('/new-project')}>New Project</p>
            <p onClick={() => navigate('/project-applications')}>Applications</p>
            <p onClick={logout}>Logout</p>
          </>
        );
      case 'admin':
        return (
          <>
            <p onClick={() => navigate('/admin')}>Home</p>
            <p onClick={() => navigate('/all-users')}>All Users</p>
            <p onClick={() => navigate('/admin-projects')}>Projects</p>
            <p onClick={() => navigate('/admin-applications')}>Applications</p>
            <p onClick={logout}>Logout</p>
          </>
        );
      default:
        return null;
    }
  };

  if (!usertype) return null;

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h3>
          Job <span>Portal</span>{usertype === 'admin' && <small> (Admin)</small>}
        </h3>
      </div>
      <div className="nav-options">
        {renderLinks()}
      </div>
    </div>
  );
};

export default Navbar;
