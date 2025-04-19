import { useState, useEffect, useRef, useCallback } from "react";
import { socket } from "../socket";
import { BASE_URL, token } from "../config";
import { useNavigate } from "react-router-dom";

const ChatModal = ({ chat, currentUser, onClose }) => {
const navigate=useNavigate();
  // console.log(currentUser);
  console.log(chat);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const chatId = chat?.chat?._id || chat?._id;

  const chatPartner = (chat.chat.participants)?.find(
    (u) => String(u.user._id) !== String(currentUser._id)
  );

  // console.log(currentUser._id);
  // console.log(chatPartner);

  useEffect(() => {
    if (!chatId || !currentUser?._id) return;

    // Join user and chat room
    socket.emit("setup", currentUser._id);
    socket.emit("join chat", chatId);

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/message/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchMessages();

    socket.on("message received", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off("message received");
      socket.emit("leave chat", chatId); // Optional: handle room cleanup
    };
  }, [chatId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: input, chatId }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      socket.emit("new message", newMsg);
      setInput("");
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleVideoButton=useCallback((e)=>{
e.preventDefault();
socket.emit("room:join",{chatId,id:currentUser._id});
  },[chatId, socket]);

  const handleJoinRoom=useCallback((data)=>{
const {chatId, id}=data;
// console.log(chatId);\
const roomId=chatId;
navigate(`/video/${roomId}`);
  },[navigate]);

  useEffect(()=>{
   
    socket.on("room:join",handleJoinRoom);
      return ()=>{
        socket.off("room:join",handleJoinRoom);
      }},[socket]);
    
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Chat with {chatPartner.user.name}
        </h2>
        <div className="max-h-80 overflow-y-auto border rounded p-3 bg-gray-50 mb-3">
          {messages.map((msg) => (
            <div key={msg._id} className="mb-2">
              <span className="font-semibold text-blue-700">{msg.sender?.name}:</span>{" "}
              <span>{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            className="flex-grow border p-2 rounded"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={sendMessage}
          >
            Send
          </button>
          <button
  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  onClick={handleVideoButton}
>
  🎥 Video Call
</button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
