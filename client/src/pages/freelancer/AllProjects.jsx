import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/AllProjects.css';

const AllProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayprojects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-projects');
      setProjects(response.data);
      setDisplayProjects(response.data.reverse());

      const skills = [];
      response.data.forEach(project => {
        project.skills.forEach(skill => {
          if (!skills.includes(skill)) {
            skills.push(skill);
          }
        });
      });
      setAllSkills(skills);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter(size => size !== value));
    }
  };

  useEffect(() => {
    if (categoryFilter.length > 0) {
      setDisplayProjects(
        projects.filter(project => categoryFilter.every(skill => project.skills.includes(skill))).reverse()
      );
    } else {
      setDisplayProjects(projects.reverse());
    }
  }, [categoryFilter]);

  return (
    <div className="all-projects-page">
      <div className="project-filters">
        <h3>Filter by Skills</h3>
        <hr />
        <div className="filters">
          {allSkills.map((skill) => (
            <div className="form-check" key={skill}>
              <input
                className="form-check-input"
                type="checkbox"
                value={skill}
                id={`skill-${skill}`}
                onChange={handleCategoryCheckBox}
              />
              <label className="form-check-label" htmlFor={`skill-${skill}`}>
                {skill}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="projects-list">
        <h2>All Projects</h2>
        <hr />
        {displayprojects.map((project) => (
          <div className="project-card" key={project._id} onClick={() => navigate(`/project/${project._id}`)}>
            <div className="project-header">
              <h3>{project.title}</h3>
              <p>{String(project.postedDate).slice(0, 24)}</p>
            </div>
            <p className="project-budget">₹ {project.budget}</p>
            <p className="project-desc">{project.description}</p>
            <div className="project-skills">
              {project.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
            <div className="project-meta">
              <span>{project.bids.length} bids</span>
              <span>
                ₹{' '}
                {project.bids.length > 0
                  ? project.bidAmounts.reduce((acc, curr) => acc + curr, 0)
                  : 0}{' '}
                (avg bid)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
