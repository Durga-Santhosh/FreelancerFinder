import React, { useEffect, useState } from 'react';
import '../../styles/client/ClientApplications.css';
import axios from 'axios';

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:6001/fetch-applications");
      const filtered = res.data.filter(app => app.clientId === localStorage.getItem('userId'));
      setApplications(filtered);
      setDisplayApplications(filtered.reverse());

      const uniqueTitles = [...new Set(filtered.map(app => app.title))];
      setProjectTitles(uniqueTitles);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.get(`http://localhost:6001/approve-application/${id}`);
      alert("Application approved!");
      fetchApplications();
    } catch {
      alert("Operation failed!");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.get(`http://localhost:6001/reject-application/${id}`);
      alert("Application rejected!");
      fetchApplications();
    } catch {
      alert("Operation failed!");
    }
  };

  const handleFilterChange = (value) => {
    if (value === '') {
      setDisplayApplications(applications.reverse());
    } else {
      setDisplayApplications(applications.filter(app => app.title === value).reverse());
    }
  };

  return (
    <div className="linkedin-applications">
      <div className="applications-header">
        <h2>Project Applications</h2>
        <select onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="">All Projects</option>
          {projectTitles.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </div>

      <div className="applications-list">
        {displayApplications.map((app) => (
          <div className="application-card" key={app._id}>
            <div className="application-card-top">
              <div className="section-left">
                <h4>{app.title}</h4>
                <p>{app.description}</p>
                <div className="tags">
                  {app.requiredSkills.map(skill => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <p className="budget">Budget: ₹{app.budget}</p>
              </div>
              <div className="section-right">
                <h5>Proposal</h5>
                <p>{app.proposal}</p>
                <div className="tags">
                  {app.freelancerSkills.map(skill => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <p className="budget">Proposed: ₹{app.bidAmount}</p>
                <div className="action-buttons">
                  {app.status === "Pending" ? (
                    <>
                      <button className="approve" onClick={() => handleApprove(app._id)}>Approve</button>
                      <button className="decline" onClick={() => handleReject(app._id)}>Decline</button>
                    </>
                  ) : (
                    <p className="status">Status: <strong>{app.status}</strong></p>
                  )}
                </div>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectApplications;
