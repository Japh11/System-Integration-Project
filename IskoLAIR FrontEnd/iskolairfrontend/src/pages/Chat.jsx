import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatApi from "../services/ChatApi";

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!role || !token) {
      console.error("❌ Missing role or token");
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
      console.error("❌ User ID not found in localStorage");
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

  const fetchContacts = async (userId, role) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/api/contacts?userId=${userId}&role=ROLE_${role}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContacts(response.data);
    } catch (error) {
      console.error("❌ Error fetching contacts:", error);
      setErrorMessage("Error fetching contacts. Please try again.");
    }
  };

  const fetchMessages = async (senderId, recipientId, senderRole, recipientRole) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/api/messages?senderId=${senderId}&senderRole=${senderRole}&recipientId=${recipientId}&recipientRole=${recipientRole}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sorted = [...response.data].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setMessages(sorted);
    } catch (error) {
      console.error("❌ Failed to fetch chat messages", error);
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
    setMessages((prev) =>
      [...prev, msg].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    );
  };

  const sendMessage = () => {
    if (!msgInput.trim()) return;

    const recipientRole = activeContact.role?.startsWith("ROLE_")
      ? activeContact.role.replace("ROLE_", "")
      : activeContact.role;

    const message = {
      senderId: currentUser.id,
      senderName: `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim(),
      senderRole: currentUser.role,
      recipientId: activeContact.id.toString(),
      recipientName: `${activeContact.firstName} ${activeContact.lastName}`,
      recipientRole: recipientRole,
      content: msgInput,
      timestamp: new Date(),
    };

    ChatApi.sendMessage(message);
    setMessages((prev) =>
      [...prev, message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    );
    setMsgInput("");
  };

  return (

    

    <div style={{ display: "flex", gap: "30px" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3>Contacts ({currentUser.role})</h3>
        {contacts.length > 0 ? (
          contacts.map((user) => (
            <div
              key={user.id}
              onClick={() => handleContactClick(user)}
              style={{ cursor: "pointer", padding: "5px" }}
            >
              {user.firstName} {user.lastName} ({user.role})
            </div>
          ))
        ) : (
          <p>No contacts available.</p>
        )}
      </div>

      <div style={{ width: "70%", padding: "10px" }}>
        {activeContact ? (
          <>
            <h4>
              Chatting with {activeContact.firstName} {activeContact.lastName}
            </h4>
            <div
              style={{
                height: "300px",
                overflowY: "scroll",
                border: "1px solid gray",
                padding: "10px",
              }}
            >
              {messages.map((m, i) => {
                const isSender =
                  m.senderId?.toString() === currentUser.id &&
                  m.senderRole?.toUpperCase() === currentUser.role?.toUpperCase();

                return (
                  <div
                    key={i}
                    style={{
                      textAlign: isSender ? "right" : "left",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: isSender ? "#d1f0d1" : "#f1f1f1",
                        maxWidth: "70%",
                        wordWrap: "break-word",
                      }}
                    >
                      <b>{m.senderName}:</b>
                      <br />
                      {m.content}
                    </div>
                  </div>
                );
              })}
            </div>
            <input
              type="text"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              style={{ width: "70%", marginTop: "10px" }}
            />
            <button onClick={sendMessage}>Send</button>
          </>
        ) : (
          <p>Select a contact to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
