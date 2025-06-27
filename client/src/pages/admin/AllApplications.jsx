import React, { useEffect, useState } from 'react';
import '../../styles/admin/allApplications.css';
import axios from 'axios';

const AllApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-applications');
      setApplications(response.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-applications-page">
      <h2 className="section-title">All Applications</h2>
      <div className="user-applications-body">
        {applications.map((application, index) => (
          <div className="application-card" key={index}>
            <div className="application-header">
              <h3>{application.title}</h3>
              <p>{application.description}</p>
            </div>
            <div className="application-content">
              <div className="application-section">
                <h4>Project Details</h4>
                <p><strong>Client:</strong> {application.clientName}</p>
                <p><strong>Email:</strong> {application.clientEmail}</p>
                <p><strong>Budget:</strong> ₹ {application.budget}</p>
                <div className="skills-list">
                  {application.requiredSkills.map((skill, i) => (
                    <span className="skill-tag" key={i}>{skill}</span>
                  ))}
                </div>
              </div>
              <div className="application-section">
                <h4>Freelancer Proposal</h4>
                <p>{application.proposal}</p>
                <p><strong>Name:</strong> {application.freelancerName}</p>
                <p><strong>Email:</strong> {application.freelancerEmail}</p>
                <p><strong>Bid:</strong> ₹ {application.bidAmount}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`status-tag ${application.status === 'Accepted' ? 'accepted' : ''}`}
                  >
                    {application.status}
                  </span>
                </p>
                <div className="skills-list">
                  {application.freelancerSkills.map((skill, i) => (
                    <span className="skill-tag alt" key={i}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApplications;
