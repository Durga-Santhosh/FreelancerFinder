import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/client/client.css';
import { useNavigate } from 'react-router-dom';

const Client = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    await axios.get('http://localhost:6001/fetch-projects')
      .then((response) => {
        let pros = response.data.filter(pro => pro.clientId === localStorage.getItem('userId'));
        setProjects(pros);
        setDisplayProjects(pros.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilterChange = (status) => {
    if (status === "") {
      setDisplayProjects(projects);
    } else {
      const filterMap = {
        "Un Assigned": "Available",
        "In Progress": "Assigned",
        "Completed": "Completed"
      };
      setDisplayProjects(
        projects.filter(project => project.status === filterMap[status]).reverse()
      );
    }
  };

  return (
    <div className="client-container">
      <div className="client-header">
        <h2>My Projects</h2>
        <select className="filter-select" onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Un Assigned">Unassigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="client-projects">
        {displayProjects.map(project => (
          <div
            className="project-card"
            key={project._id}
            onClick={() => navigate(`/client-project/${project._id}`)}
          >
            <div className="project-card-head">
              <h3>{project.title}</h3>
              <span>{new Date(project.postedDate).toLocaleDateString()}</span>
            </div>
            <p className="project-desc">{project.description}</p>
            <div className="project-meta">
              <span className="budget">₹{project.budget}</span>
              <span className={`status status-${project.status.toLowerCase()}`}>{project.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Client;
