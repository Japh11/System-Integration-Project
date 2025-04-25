import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ChatApi from "../services/ChatApi";
import logo from "../assets/IskoLAIR_Logo.png";
import tempProfile from "../assets/temp-profile.jpg";
import "../pages/css/ScholarDashboard.css";
import "../pages/css/Chat.css";

import ScholarNavbar from "../components/ScholarNavbar";
import ScholarHeader from "../components/ScholarHeader";
import StaffNavbar from "../components/StaffNavbar";
import StaffHeader from "../components/StaffHeader";

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const bottomRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_ISKOLAIR_API_URL;

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!role || !token) {
      setErrorMessage("Authentication token or role is missing");
      return;
    }

    let id = null;
    let firstName = null;
    let lastName = null;

    if (role === "STAFF") {
      id = localStorage.getItem("staffId");
      firstName = localStorage.getItem("staffFirstName");
      lastName = localStorage.getItem("staffLastName");
    } else if (role === "SCHOLAR") {
      id = localStorage.getItem("scholarId");
      firstName = localStorage.getItem("scholarFirstName");
      lastName = localStorage.getItem("scholarLastName");
    }

    if (!id) {
      setErrorMessage("User ID not found");
      return;
    }

    const user = {
      id: id.toString(),
      role,
      firstName,
      lastName,
    };

    setCurrentUser(user);
    fetchContacts(user.id, role);
    ChatApi.connect(user.id, handleIncomingMessage, () => {}, console.error);

    return () => ChatApi.disconnect();
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchContacts = async (userId, role) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/contacts?userId=${userId}&role=ROLE_${role}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Fetch profile pictures for each contact
      const contactsWithPictures = await Promise.all(
        response.data.map(async (contact) => {
          try {
            console.log(`Fetching profile picture for role: ${contact.role}, id: ${contact.id}`);
            const profilePictureResponse = await axios.get(
              `${API_URL}/api/${contact.role.toLowerCase()}/${contact.id}/profile-picture`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return { ...contact, profilePicture: profilePictureResponse.data.url };
          } catch (error) {
            console.error(`Error fetching profile picture for ${contact.id}:`, error);
            return { ...contact, profilePicture: tempProfile }; // Use default profile picture on error
          }
        })
      );
  
      setContacts(contactsWithPictures);
    } catch (error) {
      console.error("Error fetching contacts:", error.response?.data || error.message);
      setErrorMessage("Error fetching contacts.");
    }
  };

  const fetchMessages = async (senderId, recipientId, senderRole, recipientRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/messages?senderId=${senderId}&senderRole=${senderRole}&recipientId=${recipientId}&recipientRole=${recipientRole}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sorted = [...response.data].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sorted);
      setTimeout(scrollToBottom, 100); // wait for DOM to update
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const handleContactClick = async (user) => {
    setActiveContact(user);
    const recipientRole = user.role?.startsWith("ROLE_")
      ? user.role.replace("ROLE_", "")
      : user.role;
    await fetchMessages(currentUser.id, user.id.toString(), currentUser.role, recipientRole);
  };

  const handleIncomingMessage = (msg) => {
    setMessages((prev) => {
      const updated = [...prev, msg].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setTimeout(scrollToBottom, 100);
      return updated;
    });
  };

  const sendMessage = () => {
    if (!msgInput.trim()) return;

    const recipientRole = activeContact.role?.startsWith("ROLE_")
      ? activeContact.role.replace("ROLE_", "")
      : activeContact.role;

    const message = {
      senderId: currentUser.id,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      senderRole: currentUser.role,
      recipientId: activeContact.id.toString(),
      recipientName: `${activeContact.firstName} ${activeContact.lastName}`,
      recipientRole,
      content: msgInput.trim(),
      timestamp: new Date(),
    };

    ChatApi.sendMessage(message);
    setMessages((prev) => {
      const updated = [...prev, message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setTimeout(scrollToBottom, 100);
      return updated;
    });
    setMsgInput("");
  };

  if (!currentUser) return <div className="chat-wrapper">Loading chat...</div>;

  const isStaff = currentUser?.role?.toUpperCase() === "STAFF";

  return (
    <div className="chat-wrapper">
      {isStaff ? <StaffHeader /> : <ScholarHeader />}
      <div className="chat-body">
        {isStaff ? <StaffNavbar /> : <ScholarNavbar />}

        <div className="chat-container">
          <div className="contact-list">
            <h3>Contacts</h3>
            {contacts.length > 0 ? (
              contacts.map((user) => (
                <div
                key={user.id}
                className={`contact-item ${activeContact?.id === user.id ? "active" : ""}`}
                onClick={() => handleContactClick(user)}
              >
                <img
                  src={user.profilePicture || tempProfile}
                  alt="Profile"
                  className="contact-avatar"
                />
                <div className="contact-name">{user.firstName} {user.lastName}</div>
              </div>
              ))
            ) : (
              <p>No contacts available.</p>
            )}
          </div>

          <div className="chat-box">
            {activeContact ? (
              <>
                <div className="chat-header">
                  <img
                    src={activeContact?.profilePicture || tempProfile}
                    alt="Avatar"
                    className="chat-avatar"
                  />
                  <h4>{activeContact.firstName} {activeContact.lastName}</h4>
                </div>

                <div className="chat-history">
                  {messages
                    .filter((m) => m.content && m.content.trim() !== "")
                    .map((m, i) => {
                      const isSender =
                        m.senderId?.toString() === currentUser.id &&
                        m.senderRole?.toUpperCase() === currentUser.role?.toUpperCase();

                      const time = new Date(m.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <React.Fragment key={i}>
                          <div className={`chat-bubble ${isSender ? "sent" : "received"}`}>
                            <div className="bubble-content">{m.content}</div>
                          </div>
                          <div className={`timestamp ${isSender ? "align-right" : "align-left"}`}>
                            {time}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  <div ref={bottomRef} />
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </>
            ) : (
              <div className="chat-empty">Select a contact to start chatting.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
