import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setChats
} from '../store/chatSlice.js';

const Home = () => {

  const dispatch = useDispatch();
  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const input = useSelector(state => state.chat.input);
  const isSending = useSelector(state => state.chat.isSending);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  // =========================
  // Load chats + setup socket
  // =========================
  useEffect(() => {

    axios.get("http://localhost:3000/auth/chat", { withCredentials: true })
      .then(response => {
        dispatch(setChats(response.data.chats.reverse()));
      });

    const tempSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    tempSocket.on("ai-response", (messagePayload) => {
      console.log("AI Response:", messagePayload);

      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          content: messagePayload.content  // backend sends "message"
        }
      ]);

      dispatch(sendingFinished());
    });

    setSocket(tempSocket);

    return () => tempSocket.disconnect();

  }, []);

  // =========================
  // Create new chat
  // =========================
  const handleNewChat = async () => {

    let title = window.prompt('Enter a title for the new chat:', '');
    if (title) title = title.trim();
    if (!title) return;

    const response = await axios.post(
      "http://localhost:3000/auth/chat",
      { title },
      { withCredentials: true }
    );

    getMessages(response.data.user._id);
    dispatch(startNewChat(response.data.user));
    setSidebarOpen(false);
  };

  // =========================
  // Send message
  // =========================
  const sendMessage = () => {

    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending || !socket) return;

    dispatch(sendingStarted());

    // Update UI immediately
    setMessages(prev => [
      ...prev,
      {
        type: 'user',
        content: trimmed
      }
    ]);

    dispatch(setInput(''));

    // Send to backend
    socket.emit("ai-message", {
      chat: activeChatId,
      message: trimmed   // IMPORTANT: backend expects "message"
    });
  };

  // =========================
  // Fetch messages
  // =========================
  const getMessages = async (chatId) => {

    const response = await axios.get(
      `http://localhost:3000/auth/chat/messages/${chatId}`,
      { withCredentials: true }
    );

    setMessages(
      response.data.messages.map(m => ({
        type: m.role === 'user' ? 'user' : 'ai',
        content: m.content
      }))
    );
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="chat-layout minimal">

      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewChat={handleNewChat}
      />

      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          dispatch(selectChat(id));
          setSidebarOpen(false);
          getMessages(id);
        }}
        onNewChat={handleNewChat}
        open={sidebarOpen}
      />

      <main className="chat-main" role="main">

        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="chip">Early Preview</div>
            <h1>ChatGPT Clone</h1>
            <p>
              Ask anything. Your chats stay in the sidebar so you can
              pick up where you left off.
            </p>
          </div>
        )}

        <ChatMessages messages={messages} isSending={isSending} />

        {activeChatId && (
          <ChatComposer
            input={input}
            setInput={(v) => dispatch(setInput(v))}
            onSend={sendMessage}
            isSending={isSending}
          />
        )}

      </main>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    </div>
  );
};

export default Home;