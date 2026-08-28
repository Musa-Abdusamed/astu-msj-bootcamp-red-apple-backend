import React, { useState, useEffect, useRef } from 'react';
import { sharedService } from '../../api/sharedService';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, X, Plus } from 'lucide-react';

export default function Messaging() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const messagesEndRef = useRef(null);
  
  // New Message Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchInbox();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchInbox = async () => {
    try {
      const data = await sharedService.getInbox();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (otherUser) => {
    setSelectedUser(otherUser);
    setLoadingChat(true);
    try {
      const data = await sharedService.getConversation(otherUser._id);
      setMessages(data.messages || []);
      
      // Mark unread messages as read
      const unreadMessages = (data.messages || []).filter(
        (m) => m.recipient?._id === user?._id || m.recipient === user?._id && !m.read
      );
      
      if (unreadMessages.length > 0) {
        await Promise.all(unreadMessages.map((m) => sharedService.markMessageRead(m._id)));
        fetchInbox(); // Refresh unread count in sidebar
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const res = await sharedService.sendMessage({
        recipient: selectedUser._id,
        content: newMessage
      });
      // The backend returns the new message in res.message, populated with sender/recipient.
      setMessages([...messages, res.message]);
      setNewMessage('');
      fetchInbox(); // Update latest message in sidebar
    } catch (err) {
      console.error(err);
    }
  };

  const openNewMessageModal = async () => {
    setIsModalOpen(true);
    try {
      const data = await sharedService.getUsers();
      // Exclude self
      setUsersList((data.data || []).filter((u) => u._id !== user?._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendNewMessage = async (e) => {
    e.preventDefault();
    if (!selectedRecipientId || !modalMessage.trim()) return;

    setSending(true);
    try {
      await sharedService.sendMessage({
        recipient: selectedRecipientId,
        content: modalMessage
      });
      
      setIsModalOpen(false);
      setModalMessage('');
      
      // Refresh inbox and select this user to open chat
      await fetchInbox();
      const recipientUser = usersList.find((u) => u._id === selectedRecipientId);
      if (recipientUser) {
        handleSelectConversation(recipientUser);
      }
      setSelectedRecipientId('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-500">Communicate with mentors, admins, and students</p>
        </div>
        <button 
          onClick={openNewMessageModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Message</span>
        </button>
      </div>

      <div className="flex bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-slate-100 bg-slate-50 flex flex-col h-full">
          <div className="p-5 border-b border-slate-200/60 font-bold text-slate-800 shrink-0">
            Conversations
          </div>
          
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">No conversations yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {conversations.map((conv) => {
                  const isActive = selectedUser?._id === conv.otherUser._id;
                  // Handle cases where sender is populated
                  const latestSenderId = (conv.latestMessage.sender?._id || conv.latestMessage.sender);
                  
                  return (
                    <div 
                      key={conv.otherUser._id} 
                      onClick={() => handleSelectConversation(conv.otherUser)}
                      className={`p-4 cursor-pointer transition flex gap-3 ${
                        isActive ? 'bg-indigo-50/50' : 'hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                        {conv.otherUser.fullName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-bold text-slate-900 text-sm truncate pr-2">
                            {conv.otherUser.fullName}
                          </h4>
                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                          {latestSenderId === user?._id ? 'You: ' : ''}
                          {conv.latestMessage.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Main conversation area */}
        <div className="w-2/3 flex flex-col h-full bg-white relative">
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <MessageSquare className="w-8 h-8 text-indigo-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Your Messages</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs">Select a conversation from the sidebar or start a new one to begin chatting.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {selectedUser.fullName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedUser.fullName}</h3>
                  <p className="text-xs text-slate-500 capitalize">{selectedUser.role}</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {loadingChat ? (
                  <div className="text-center text-slate-400 text-sm mt-10">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm mt-10">Say hello! 👋</div>
                ) : (
                  messages.map((msg, index) => {
                    const senderId = (msg.sender?._id || msg.sender).toString();
                    const isMe = senderId === user?._id;
                    return (
                      <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px] ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-br-sm shadow-sm' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-xs'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">New Message</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendNewMessage} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">To:</label>
                <select 
                  value={selectedRecipientId}
                  onChange={(e) => setSelectedRecipientId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-medium text-slate-800"
                  required
                >
                  <option value="" disabled>Select a recipient...</option>
                  <optgroup label="Mentors">
                    {usersList.filter((u) => u.role === 'mentor').map((u) => (
                      <option key={u._id} value={u._id}>{u.fullName}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Admins">
                    {usersList.filter((u) => u.role === 'admin').map((u) => (
                      <option key={u._id} value={u._id}>{u.fullName}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Students">
                    {usersList.filter((u) => u.role === 'student').map((u) => (
                      <option key={u._id} value={u._id}>{u.fullName} ({u.userId})</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message:</label>
                <textarea
                  value={modalMessage}
                  onChange={(e) => setModalMessage(e.target.value)}
                  rows="4"
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 resize-none transition"
                  required
                ></textarea>
              </div>
              
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !selectedRecipientId || !modalMessage.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {sending ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
