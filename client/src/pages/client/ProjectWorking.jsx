import React, { useContext, useEffect, useState } from 'react';
import '../../styles/client/ProjectWorking.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';

const ProjectWorking = () => {
  const { socket } = useContext(GeneralContext);
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [clientId, setClientId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(id);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState(null);

  useEffect(() => {
    fetchProject(id);
    joinSocketRoom();
    fetchChats();
    socket.on("message-from-user", () => fetchChats());
  }, [socket, id]);

  const joinSocketRoom = async () => {
    await socket.emit("join-chat-room", { projectId: id, freelancerId: "" });
  };

  const fetchProject = async (id) => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-project/${id}`);
      setProject(res.data);
      setProjectId(res.data._id);
      setClientId(res.data.clientId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveSubmission = async () => {
    try {
      await axios.get(`http://localhost:6001/approve-submission/${id}`);
      fetchProject(id);
      alert("Submission approved!!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSubmission = async () => {
    try {
      await axios.get(`http://localhost:6001/reject-submission/${id}`);
      fetchProject(id);
      alert("Submission rejected!!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessageSend = async () => {
    socket.emit("new-message", {
      projectId: id,
      senderId: localStorage.getItem("userId"),
      message,
      time: new Date(),
    });
    setMessage("");
    fetchChats();
  };

  const fetchChats = async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-chats/${id}`);
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return project ? (
    <div className="linkedin-project-page">
      <div className="linkedin-project-main">
        <div className="linkedin-project-info">
          <h2>{project.title}</h2>
          <p>{project.description}</p>

          <div className="linkedin-section">
            <h4>Required Skills</h4>
            <div className="linkedin-tags">
              {project.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="linkedin-section">
            <h4>Budget</h4>
            <p>₹{project.budget}</p>
          </div>

          {project.freelancerId && (
            <div className="linkedin-submission">
              <h3>Submission</h3>
              {project.submission ? (
                <>
                  <p><strong>Project Link:</strong> <a href={project.projectLink} target="_blank" rel="noopener noreferrer">{project.projectLink}</a></p>
                  <p><strong>Manual Link:</strong> <a href={project.manulaLink} target="_blank" rel="noopener noreferrer">{project.manulaLink}</a></p>
                  <p><strong>Description:</strong> {project.submissionDescription}</p>
                  {project.submissionAccepted ? (
                    <p className="approved">Project completed!</p>
                  ) : (
                    <div className="linkedin-buttons">
                      <button onClick={handleApproveSubmission} className="approve">Approve</button>
                      <button onClick={handleRejectSubmission} className="decline">Reject</button>
                    </div>
                  )}
                </>
              ) : (
                <p>No submissions yet!</p>
              )}
            </div>
          )}
        </div>

        <div className="linkedin-chat-section">
          <h3>Chat with Freelancer</h3>
          <hr />
          {project.freelancerId ? (
            <div className="chat-body">
              <div className="chat-messages">
                {chats && chats.messages.map((msg, i) => (
                  <div key={i} className={msg.senderId === localStorage.getItem("userId") ? "chat-msg mine" : "chat-msg other"}>
                    <p>{msg.text}</p>
                    <span>{msg.time.slice(5, 10)} {msg.time.slice(11, 19)}</span>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleMessageSend}>Send</button>
              </div>
            </div>
          ) : (
            <p className="info-text">Chat will be enabled once the project is assigned.</p>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default ProjectWorking;
