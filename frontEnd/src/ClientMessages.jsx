import { useState, useEffect, useRef } from "react";
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
import Clientheader from "./Clientheader";
import { useParams, useNavigate } from "react-router-dom";
import socket from "./socket";
import API from "./API";

const FALLBACK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function ClientMessages() {
  const client = JSON.parse(localStorage.getItem("user"));
  const { freelancerId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // =========================================================
  // CONNECT SOCKET, REGISTER THIS USER
  // =========================================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =========================================================
  // AUTO SCROLL WHEN MESSAGES CHANGE
  // =========================================================

  useEffect(() => {
    if (selectedChat?.messages?.length) {
      scrollToBottom();
    }
  }, [selectedChat?.messages]);
  useEffect(() => {
    if (!client?.id) return;

    socket.connect();
    socket.emit("register", client.id);

    return () => socket.disconnect();
  }, []);

  // =========================================================
  // FETCH CONVERSATION LIST
  // =========================================================

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await API.get(`/conversations/${client.id}`);

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
  // OPEN A CONVERSATION — from URL param OR clicking the list
  // =========================================================

  const openChat = async (partnerId, partnerName, partnerImage) => {
    setSelectedChat({
      userId: partnerId,
      name: partnerName || "Freelancer",
      image: partnerImage || FALLBACK_IMAGE,
      messages: [],
    });

    try {
      const res = await API.get(`/messages/${client.id}/${partnerId}`);

      if (res.data.success) {
        setSelectedChat((prev) =>
          prev ? { ...prev, messages: res.data.messages } : prev,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // when the URL has a freelancerId (came from "Chat" button, or a refresh)
  useEffect(() => {
    if (!freelancerId) return;

    // check if we already know this freelancer's name/image from the list
    const known = conversations.find((c) => c.userId === freelancerId);

    openChat(freelancerId, known?.name, known?.image);
  }, [freelancerId, conversations.length]);

  // =========================================================
  // LISTEN FOR INCOMING MESSAGES
  // =========================================================
  useEffect(() => {
    const handleReceive = (msg) => {
      // figure out who the "other person" in this message is
      const partnerId =
        msg.senderId === client.id ? msg.receiverId : msg.senderId;

      // update the open chat window, if this message belongs to it
      setSelectedChat((prev) => {
        if (!prev) return prev;

        const belongsToThisChat =
          msg.senderId === prev.userId || msg.receiverId === prev.userId;

        if (!belongsToThisChat) return prev;

        return { ...prev, messages: [...(prev.messages || []), msg] };
      });

      // update (or add) this conversation in the sidebar list
      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.userId === partnerId);

        if (existingIndex !== -1) {
          // move it to the top with updated preview
          const updated = [...prev];
          const [chat] = updated.splice(existingIndex, 1);
          return [
            { ...chat, lastMessage: msg.text, time: msg.createdAt },
            ...updated,
          ];
        }

        // brand-new conversation — we don't know the partner's name yet,
        // so fall back to "New message" until next full conversations fetch
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
  }, [client.id]);

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedChat) return;

    socket.emit("sendMessage", {
      senderId: client.id,
      receiverId: selectedChat.userId,
      text: message,
    });

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#10002b] text-white">
      <Clientheader />

      <main className="mt-1">
        <div className="h-[calc(100vh-190px)] min-h-[700px] flex bg-[#180936] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
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
                  No conversations yet. Click "Chat" on a freelancer's profile
                  to start one.
                </p>
              )}

              {conversations.map((chat) => (
                <button
                  key={chat.userId}
                  onClick={() => navigate(`/clientmessages/${chat.userId}`)}
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
          <div className="hidden md:flex flex-1 flex-col">
            {!selectedChat && (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            )}

            {selectedChat && (
              <>
                {/* CHAT HEADER */}
                <div className="h-[82px] px-5 flex items-center justify-between border-b border-white/10 bg-[#1b0a3d]">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedChat.image}
                      alt={selectedChat.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div>
                      <h2 className="font-bold text-lg">{selectedChat.name}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/10 transition">
                      <Phone size={19} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition">
                      <Video size={19} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition">
                      <MoreVertical size={19} />
                    </button>
                  </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  {(!selectedChat.messages ||
                    selectedChat.messages.length === 0) && (
                    <p className="text-gray-500 text-sm text-center">
                      No messages yet. Say hello!
                    </p>
                  )}

                  {(selectedChat.messages || []).map((msg, index) => {
                    const isClient = msg.senderId === client.id;

                    return (
                      <div
                        key={msg._id || index}
                        className={`flex ${
                          isClient ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isClient
                              ? "bg-purple-600 rounded-2xl rounded-br-md"
                              : "bg-[#29134d] border border-white/10 rounded-2xl rounded-bl-md"
                          } px-4 py-3`}
                        >
                          <p className="text-sm leading-6">{msg.text}</p>

                          <div
                            className={`flex items-center justify-end gap-1 mt-1 ${
                              isClient ? "text-purple-200" : "text-gray-500"
                            }`}
                          >
                            <span className="text-[11px]">
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )
                                : ""}
                            </span>

                            {isClient && <CheckCheck size={14} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* ALWAYS KEEP FOCUS AT BOTTOM */}
                  <div ref={messagesEndRef} />
                </div>
                {/* MESSAGE INPUT */}
                <div className="p-4 border-t border-white/10 bg-[#1b0a3d]">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-3"
                  >
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-white transition"
                    >
                      <Paperclip size={21} />
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
                        <Smile size={20} />
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 p-3 rounded-xl transition"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </>
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

export default ClientMessages;
