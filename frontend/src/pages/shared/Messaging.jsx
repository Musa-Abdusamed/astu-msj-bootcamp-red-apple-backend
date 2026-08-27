import React, { useState, useEffect } from 'react';
import { sharedService } from '../../api/sharedService';
import { MessageSquare, AlertCircle } from 'lucide-react';

export default function Messaging() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      const data = await sharedService.getInbox();
      setMessages(data.messages || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-500">Communicate with mentors, admins, and students</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm">
          New Message
        </button>
      </div>

      <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden min-h-[600px]">
        {/* Sidebar for conversations */}
        <div className="w-1/3 border-r border-slate-100 bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-700">Inbox</div>
          {messages.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No messages yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map(msg => (
                <div key={msg._id} className={`p-4 hover:bg-white cursor-pointer transition ${!msg.read ? 'bg-indigo-50/50' : ''}`}>
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {msg.sender?.fullName || 'Unknown User'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 truncate">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Main conversation area */}
        <div className="w-2/3 flex flex-col items-center justify-center text-center p-8 bg-white">
          <MessageSquare className="w-16 h-16 text-indigo-100 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">Select a conversation</h3>
          <p className="text-slate-500 text-sm mt-2">Choose a message from the list to view the conversation or start a new one.</p>
        </div>
      </div>
    </div>
  );
}
