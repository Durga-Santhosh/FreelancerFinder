import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/freelancer/ProjectData.css';
import { GeneralContext } from '../../context/GeneralContext';
import { ToastContainer, toast } from 'react-toastify';

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();

  const [project, setProject] = useState();
  const [clientId, setClientId] = useState('');
  const [freelancerId, setFreelancerId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(params['id']);
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState();

  useEffect(() => {
    fetchProject(params['id']);
    joinSocketRoom();
    fetchChats();
  }, []);

  useEffect(() => {
    socket.on("message-from-user", () => {
      fetchChats();
    });
  }, [socket]);

  const fetchProject = async (id) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-project/${id}`);
      setProject(response.data);
      setProjectId(response.data._id);
      setClientId(response.data.clientId);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-chats/${params['id']}`);
      setChats(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const joinSocketRoom = async () => {
    socket.emit("join-chat-room", {
      projectId: params['id'],
      freelancerId: localStorage.getItem("userId"),
    });
  };

  const handleBidding = async () => {
    try {
      await axios.post("http://localhost:6001/make-bid", {
        clientId,
        freelancerId,
        projectId,
        proposal,
        bidAmount,
        estimatedTime,
      });
      setProposal('');
      setBidAmount(0);
      setEstimatedTime(0);
      toast.success("Bid posted successfully!");
    } catch (err) {
      toast.error("Bid posting failed! Try again.");
      
    }
  };

  const handleProjectSubmission = async () => {
    try {
      await axios.post("http://localhost:6001/submit-project", {
        clientId,
        freelancerId,
        projectId,
        projectLink,
        manualLink,
        submissionDescription,
      });
      setProjectLink('');
      setManualLink('');
      setSubmissionDescription('');
      toast.success("Project submitted successfully!");
    } catch (err) {
      toast.error("Project submission failed! Try again.");
    }
  };

  const handleMessageSend = async () => {
    socket.emit("new-message", {
      projectId: params['id'],
      senderId: localStorage.getItem("userId"),
      message,
      time: new Date(),
    });
    fetchChats();
    setMessage("");
  };

  return (
    project && (
      <div className="project-data-page">
        <div className="project-data-container">
          <div className="project-data">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <span>
              <h5>Required skills</h5>
              <div className="required-skills">
                {project.skills.map((skill) => (
                  <p key={skill}>{skill}</p>
                ))}
              </div>
            </span>
            <span>
              <h5>Budget</h5>
              <h6>&#8377; {project.budget}</h6>
            </span>
          </div>

          {project.status === "Available" && (
            <div className="project-form-body">
              <h4>Send proposal</h4>
              <span>
                <div className="form-floating">
                  <label>Budget</label>
                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Budget"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                </div>
                <div className="form-floating">
                  <label>Estimated time (days)</label>
                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Estimated time (days)"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                  />
                </div>
              </span>
              <div className="form-floating">
                <label>Describe your proposal</label>
                <textarea
                  className="form-control mb-3"
                  placeholder="Describe your proposal"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
              </div>
              {!project.bids.includes(localStorage.getItem('userId')) ? (
                <button className='btn btn-success' onClick={handleBidding}>Post Bid</button>
              ) : (
                <button className='btn btn-primary' disabled>Already bidded</button>
              )}
            </div>
          )}

          {project.freelancerId === localStorage.getItem('userId') && (
            <div className="project-form-body">
              <h4>Submit the project</h4>
              {project.submissionAccepted ? (
                <p>Project completed</p>
              ) : (
                <>
                  <div className="form-floating">
                    <label>Project link</label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Project link"
                      value={projectLink}
                      onChange={(e) => setProjectLink(e.target.value)}
                    />
                  </div>
                  <div className="form-floating">
                    <label>Manual link</label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Manual link"
                      value={manualLink}
                      onChange={(e) => setManualLink(e.target.value)}
                    />
                  </div>
                  <div className="form-floating">
                    <label>Describe your work</label>
                    <textarea
                      className="form-control mb-3"
                      placeholder="Describe your work"
                      value={submissionDescription}
                      onChange={(e) => setSubmissionDescription(e.target.value)}
                    />
                  </div>
                  {project.submission ? (
                    <button className="btn btn-secondary" disabled>Already submitted</button>
                  ) : (
                    <button className="btn btn-success" onClick={handleProjectSubmission}>
                      Submit project
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="project-chat-container">
          <h4>Chat with the client</h4>
          <hr />
          {project.freelancerId === localStorage.getItem('userId') ? (
            <div className="chat-body">
              {chats && (
                <div className="chat-messages">
                  {chats.messages.map((message, index) => (
                    <div
                      className={
                        message.senderId === localStorage.getItem("userId")
                          ? "my-message"
                          : "received-message"
                      }
                      key={index}
                    >
                      <div>
                        <p>{message.text}</p>
                        <h6>
                          {message.time.slice(5, 10)} - {message.time.slice(11, 19)}
                        </h6>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <hr />
              <div className="chat-input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter something..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleMessageSend}>Send</button>
              </div>
            </div>
          ) : (
            <i style={{ color: '#938f8f' }}>
              Chat will be enabled if the project is assigned to you!!
            </i>
          )}
        </div>
      </div>
    )
  );
};

export default ProjectData;
