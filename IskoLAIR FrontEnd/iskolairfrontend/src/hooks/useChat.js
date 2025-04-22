import { useEffect, useState } from "react";
import axios from "axios";
import ChatApi from "../services/ChatApi";

const useChat = () => {
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
      setErrorMessage("Authentication token or role is missing");
      return;
    }

    let id = null, firstName = null, lastName = null;
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

    const user = { id: id.toString(), role, firstName, lastName };
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(response.data);
    } catch (error) {
      setErrorMessage("Error fetching contacts.");
    }
  };

  const fetchMessages = async (senderId, recipientId, senderRole, recipientRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/messages?senderId=${senderId}&senderRole=${senderRole}&recipientId=${recipientId}&recipientRole=${recipientRole}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sorted = [...response.data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sorted);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const handleContactClick = async (user) => {
    setActiveContact(user);
    const recipientRole = user.role?.replace("ROLE_", "");
    await fetchMessages(currentUser.id, user.id.toString(), currentUser.role, recipientRole);
  };

  const handleIncomingMessage = (msg) => {
    setMessages((prev) => [...prev, msg].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
  };

  const sendMessage = () => {
    if (!msgInput.trim()) return;

    const recipientRole = activeContact.role?.replace("ROLE_", "");
    const message = {
      senderId: currentUser.id,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      senderRole: currentUser.role,
      recipientId: activeContact.id.toString(),
      recipientName: `${activeContact.firstName} ${activeContact.lastName}`,
      recipientRole,
      content: msgInput,
      timestamp: new Date(),
    };

    ChatApi.sendMessage(message);
    setMessages((prev) => [...prev, message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    setMsgInput("");
  };

  return {
    contacts,
    currentUser,
    activeContact,
    messages,
    msgInput,
    errorMessage,
    setMsgInput,
    handleContactClick,
    sendMessage,
  };
};

export default useChat;
