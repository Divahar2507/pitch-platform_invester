import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, MoreVertical, Phone, Video, Image as ImageIcon } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Messages() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Fetch all messages and group them
    useEffect(() => {
        const fetchMessages = async () => {
            if (!user?.id) return;
            try {
                const res = await api.get(`/messages/${user.id}`);
                const allMsg = res.data;
                setMessages(allMsg);
                processConversations(allMsg);
            } catch (err) {
                console.error("Failed to load messages", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [user]);

    // Group messages by the "other" person
    const processConversations = (allMsg) => {
        const groups = {};
        allMsg.forEach(msg => {
            const isMe = msg.sender_id === user.id;
            const otherId = isMe ? msg.receiver_id : msg.sender_id;

            if (!groups[otherId]) {
                groups[otherId] = {
                    id: otherId,
                    name: `User ${otherId}`, // In real app, fetch name
                    lastMessage: msg.content,
                    time: msg.timestamp,
                    avatar: `https://ui-avatars.com/api/?name=${otherId}&background=random`,
                    messages: []
                };
            }
            groups[otherId].messages.push(msg);
            // Update last message if this one is newer
            // (Assuming api returns chrono desc, so first one encountered might be newest or oldest depending on sort)
        });

        // Convert to array and sort by time
        const sorted = Object.values(groups).sort((a, b) => new Date(b.time) - new Date(a.time));
        setConversations(sorted);

        // Select first chat if none selected
        if (sorted.length > 0 && !activeChat) {
            setActiveChat(sorted[0]);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const payload = {
                receiver_id: activeChat.id,
                content: newMessage
            };
            const res = await api.post('/messages/send', payload);

            // Optimistic update
            const sentMsg = { ...res.data, sender_id: user.id }; // Ensure ID matches

            const updatedConversations = conversations.map(c => {
                if (c.id === activeChat.id) {
                    return {
                        ...c,
                        messages: [sentMsg, ...c.messages], // Add to top if using flex-col-reverse or bottom otherwise
                        lastMessage: newMessage
                    };
                }
                return c;
            });

            setConversations(updatedConversations);
            // Also update active chat ref
            setActiveChat(prev => ({
                ...prev,
                messages: [sentMsg, ...prev.messages]
            }));

            setNewMessage('');
        } catch (err) {
            console.error("Failed to send", err);
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col max-w-7xl mx-auto">
            <Header title="Messages" />

            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex">
                {/* Sidebar List */}
                <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                    <div className="p-4 border-b border-slate-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading && <div className="p-4 text-center text-slate-500">Loading...</div>}
                        {!loading && conversations.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                <p>No messages yet.</p>
                                <Button size="sm" variant="outline" className="mt-2">Start a chat</Button>
                            </div>
                        )}
                        {conversations.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`w-full p-4 flex items-start gap-3 hover:bg-white transition-colors border-l-4 ${activeChat?.id === chat.id ? 'bg-white border-blue-600 shadow-sm' : 'border-transparent'
                                    }`}
                            >
                                <img src={chat.avatar} alt="" className="w-10 h-10 rounded-full" />
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`text-sm font-semibold truncate ${activeChat?.id === chat.id ? 'text-blue-900' : 'text-slate-900'}`}>
                                            {chat.name}
                                        </h4>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={activeChat.avatar} alt="" className="w-10 h-10 rounded-full" />
                                    <div>
                                        <h3 className="font-bold text-slate-900">{activeChat.name}</h3>
                                        <p className="text-xs text-green-500 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <button className="p-2 hover:bg-slate-100 rounded-full"><Phone size={20} /></button>
                                    <button className="p-2 hover:bg-slate-100 rounded-full"><Video size={20} /></button>
                                    <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical size={20} /></button>
                                </div>
                            </div>

                            {/* Messages Stream */}
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4 flex flex-col-reverse">
                                {activeChat.messages.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((msg, idx) => {
                                    const isMe = msg.sender_id === user.id;
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg.id || idx}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm ${isMe
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-slate-100 bg-white">
                                <form onSubmit={handleSend} className="flex items-center gap-3">
                                    <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                        <ImageIcon size={20} />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-slate-100 text-slate-900 placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                    <Button type="submit" className="rounded-xl px-4 aspect-square flex items-center justify-center">
                                        <Send size={18} />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Send size={32} />
                            </div>
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
