import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/client/newProject.css';
import { ToastContainer, toast } from 'react-toastify';

const NewProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(0);
  const [skills, setSkills] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:6001/new-project", {
        title,
        description,
        budget,
        skills,
        clientId: localStorage.getItem('userId'),
        clientName: localStorage.getItem('username'),
        clientEmail: localStorage.getItem('email'),
      });
      toast.success("Project posted successfully!");
      navigate('/client');
    } catch (err) {
      toast.error(err.response.data.message || "Failed to post project");
    }
  };

  return (
    <div className="linkedin-new-project">
      <div className="form-card">
        <h2>Post a New Project</h2>

        <label>Project Title</label>
        <input
          type="text"
          placeholder="e.g. Build a responsive portfolio website"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          rows="6"
          placeholder="Describe your project details and expectations..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <div className="two-column">
          <div>
            <label>Budget (₹)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <div>
            <label>Required Skills</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleSubmit}>Post Project</button>
      </div>
    </div>
  );
};

export default NewProject;
