import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";

let stompClient = null;

const connect = (userId, onMessageReceived, onConnected, onError) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("❌ Cannot connect: JWT token not found");
    if (onError) onError("Missing token");
    return;
  }

  // Create SockJS WebSocket connection
  const socket = new SockJS(`${process.env.ISKOLAIR_API_URL || "http://localhost:8080"}/ws`); // Use environment variable for WebSocket endpoint


  // Initialize STOMP client
  stompClient = Stomp.over(socket);
  stompClient.debug = null; // disable noisy logs (or set to console.log to debug)

  stompClient.connect(
    { Authorization: `Bearer ${token}` }, // token in CONNECT headers
    (frame) => {
      console.log("✅ WebSocket connected:", frame);

      // 🔔 Subscribe to personal message queue
      stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
        if (onMessageReceived) {
          try {
            const payload = JSON.parse(message.body);
            onMessageReceived(payload);
          } catch (err) {
            console.error("❌ Failed to parse incoming message", err);
          }
        }
      });

      if (onConnected) onConnected();
    },
    (error) => {
      console.error("❌ WebSocket connection failed:", error);
      if (onError) onError(error);
    }
  );
};

const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.send("/app/chat", {}, JSON.stringify(message));
  } else {
    console.warn("❌ Cannot send: WebSocket is not connected");
  }
};

const disconnect = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("👋 WebSocket disconnected");
    });
    stompClient = null;
  }
};

// Fetch contacts (scholars and staff) excluding the current user, based on role
const fetchContacts = async (userId, role) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    
    const response = await axios.get(`http://localhost:8080/api/contacts?userId=${userId}&role=${role}`, {
      headers: {
        Authorization: `Bearer ${token}` // Ensure token is included
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error.response?.data || error.message);
    throw error;
  }
};

export default {
  connect,
  sendMessage,
  disconnect,
  fetchContacts
};
