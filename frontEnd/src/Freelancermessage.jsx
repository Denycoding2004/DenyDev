import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  CheckCheck,
} from "lucide-react";
import Freelancerheader from "./Freelancerheader";
import socket from "./socket";
import API from "./API";

const FALLBACK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function Freelancermessage() {
  const freelancer = JSON.parse(localStorage.getItem("user"));
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  // =========================================================
  // AUTO SCROLL TO BOTTOM
  // =========================================================

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  useEffect(() => {
    if (selectedChat?.messages?.length) {
      scrollToBottom();
    }
  }, [selectedChat?.messages]);
  // =========================================================
  // CONNECT SOCKET, REGISTER THIS USER
  // =========================================================

  useEffect(() => {
    if (!freelancer?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", freelancer.id);
  }, []);

  // =========================================================
  // FETCH CONVERSATION LIST
  // =========================================================

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await API.get(`/conversations/${freelancer.id}`);

        if (res.data.success) {
          setConversations(res.data.conversations);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // =========================================================
  // OPEN A CONVERSATION, FETCH ITS FULL MESSAGE HISTORY
  // =========================================================

  const openChat = async (partnerId, partnerName) => {
    setSelectedChat({
      userId: partnerId,
      name: partnerName || "Client",
      messages: [],
    });

    try {
      const res = await API.get(`/messages/${freelancer.id}/${partnerId}`);

      if (res.data.success) {
        setSelectedChat((prev) =>
          prev ? { ...prev, messages: res.data.messages } : prev,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================================================
  // OPEN CHAT FROM URL — restores focus after a page reload
  // =========================================================

  useEffect(() => {
    if (!clientId) return;

    const known = conversations.find((c) => c.userId === clientId);

    openChat(clientId, known?.name);
  }, [clientId, conversations.length]);

  // =========================================================
  // LISTEN FOR INCOMING MESSAGES
  // =========================================================

  useEffect(() => {
    const handleReceive = (msg) => {
      const partnerId =
        msg.senderId === freelancer.id ? msg.receiverId : msg.senderId;

      setSelectedChat((prev) => {
        if (!prev) return prev;

        const belongsToThisChat =
          msg.senderId === prev.userId || msg.receiverId === prev.userId;

        if (!belongsToThisChat) return prev;

        return { ...prev, messages: [...(prev.messages || []), msg] };
      });

      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.userId === partnerId);

        if (existingIndex !== -1) {
          const updated = [...prev];
          const [chat] = updated.splice(existingIndex, 1);
          return [
            { ...chat, lastMessage: msg.text, time: msg.createdAt },
            ...updated,
          ];
        }

        return [
          {
            userId: partnerId,
            name: "New message",
            lastMessage: msg.text,
            time: msg.createdAt,
          },
          ...prev,
        ];
      });
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [freelancer.id]);

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedChat) return;

    socket.emit("sendMessage", {
      senderId: freelancer.id,
      receiverId: selectedChat.userId,
      text: message,
    });

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#10002b] text-white">
      <Freelancerheader />

      <main className="">
        <div className="h-[calc(100vh-190px)] min-h-[595px] flex bg-[#180936] border border-white/10 overflow-hidden shadow-2xl">
          {/* LEFT SIDE - CONVERSATIONS */}
          <div className="w-full md:w-[340px] lg:w-[380px] border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3 bg-[#10002b] border border-white/10 rounded-xl px-4 py-3">
                <Search size={19} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && (
                <p className="text-gray-500 text-sm text-center p-6">
                  Loading conversations...
                </p>
              )}

              {!loading && conversations.length === 0 && (
                <p className="text-gray-500 text-sm text-center p-6">
                  No conversations yet. Clients who message you will appear
                  here.
                </p>
              )}

              {conversations.map((chat) => (
                <button
                  key={chat.userId}
                  onClick={() => navigate(`/freelancermessage/${chat.userId}`)}
                  className={`w-full flex items-center gap-3 p-4 text-left border-b border-white/5 transition ${
                    selectedChat?.userId === chat.userId
                      ? "bg-purple-600/30 border-l-4 border-l-purple-500"
                      : "hover:bg-white/5"
                  }`}
                >
                  <img
                    src={FALLBACK_IMAGE}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500">
                        {chat.time
                          ? new Date(chat.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 truncate mt-1">
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - CHAT */}
          {/* MESSAGES */}
          {/* =========================================================
    RIGHT SIDE - CHAT
========================================================= */}

          <div className="flex-1 flex flex-col min-w-0">
            {/* CHAT HEADER */}
            {selectedChat ? (
              <div className="h-[72px] flex items-center justify-between px-6 border-b border-white/10 bg-[#1d0b3b]">
                <div className="flex items-center gap-3">
                  <img
                    src={FALLBACK_IMAGE}
                    alt={selectedChat.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-purple-500"
                  />

                  <div>
                    <h2 className="font-semibold">{selectedChat.name}</h2>

                    <p className="text-xs text-green-400 mt-1">Online</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition">
                    <Phone size={18} />
                  </button>

                  <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition">
                    <Video size={18} />
                  </button>

                  <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[72px] flex items-center px-6 border-b border-white/10">
                <p className="text-gray-500">Select a conversation</p>
              </div>
            )}

            {/* =========================================================
      MESSAGES AREA
  ========================================================= */}

            <div
              className="flex-1 overflow-y-auto p-6 space-y-5"
              id="message-container"
            >
              {!selectedChat && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400">
                      Select a conversation to start chatting
                    </p>
                  </div>
                </div>
              )}

              {selectedChat &&
                (!selectedChat.messages ||
                  selectedChat.messages.length === 0) && (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 text-sm">
                      No messages yet. Start the conversation.
                    </p>
                  </div>
                )}

              {selectedChat &&
                (selectedChat.messages || []).map((msg, index) => {
                  const isFreelancer =
                    String(msg.senderId) === String(freelancer.id);

                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${
                        isFreelancer ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-3 ${
                          isFreelancer
                            ? "bg-purple-600 rounded-2xl rounded-br-md"
                            : "bg-[#29134d] border border-white/10 rounded-2xl rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-6 break-words">
                          {msg.text}
                        </p>

                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            isFreelancer ? "text-purple-200" : "text-gray-500"
                          }`}
                        >
                          <span className="text-[11px]">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>

                          {isFreelancer && <CheckCheck size={14} />}
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* =====================================================
        IMPORTANT: SCROLL TARGET
    ===================================================== */}

              <div ref={messagesEndRef} />
            </div>

            {/* =========================================================
      MESSAGE INPUT
  ========================================================= */}

            {selectedChat && (
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-white/10 bg-[#1d0b3b]"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition"
                  >
                    <Paperclip size={19} />
                  </button>

                  <div className="flex-1 flex items-center bg-[#10002b] border border-white/10 rounded-xl px-4">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent outline-none py-3 text-white placeholder-gray-500"
                    />

                    <button
                      type="button"
                      className="text-gray-400 hover:text-white transition"
                    >
                      <Smile size={19} />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="w-11 h-11 flex items-center justify-center bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded-xl transition"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="md:hidden flex flex-1 items-center justify-center text-gray-400">
            {selectedChat ? "Chat open" : "Select a conversation"}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Freelancermessage;
