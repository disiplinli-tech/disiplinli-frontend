import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, Check, CheckCheck } from 'lucide-react';
import API from '../api';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(location.state?.userId || null);
  const [selectedName, setSelectedName] = useState(location.state?.userName || '');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const role = localStorage.getItem('role');

  // Sohbet listesini yükle
  useEffect(() => {
    loadConversations();
  }, []);

  // Seçili kullanıcı değişince mesajları yükle
  useEffect(() => {
    if (selectedUser) {
      loadMessages();
      // 3 saniyede bir yeni mesaj kontrolü
      pollRef.current = setInterval(loadMessages, 3000);
      return () => clearInterval(pollRef.current);
    }
  }, [selectedUser]);

  // Mesaj gelince aşağı kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await API.get('/api/chat/conversations/');
      setConversations(res.data);

      // Öğrenci ise ve tek koç varsa otomatik seç
      if (role === 'student' && res.data.length === 1 && !selectedUser) {
        setSelectedUser(res.data[0].user_id);
        setSelectedName(res.data[0].name);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedUser) return;
    try {
      const res = await API.get(`/api/chat/messages/${selectedUser}/`);
      setMessages(res.data);
      // Sohbet listesini de güncelle (okunmamış badge)
      loadConversations();
    } catch (err) {
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await API.post('/api/chat/send/', {
        receiver_id: selectedUser,
        message: newMessage.trim()
      });
      setNewMessage('');
      loadMessages();
    } catch (err) {
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Mesajları tarihe göre grupla
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(m => {
      if (!groups[m.date]) groups[m.date] = [];
      groups[m.date].push(m);
    });
    return groups;
  };

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 max-w-[100vw] overflow-hidden">
      {/* Sol: Sohbet Listesi */}
      <div className={`${selectedUser ? 'hidden md:flex' : 'flex'}
        flex-col w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0`}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-[#075e54]">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <MessageCircle className="text-white" size={22} />
            <h2 className="text-lg font-semibold text-white">Mesajlar</h2>
          </div>
        </div>

        {/* Sohbet Listesi */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <MessageCircle size={40} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Henüz sohbet yok</p>
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.user_id}
                onClick={() => {
                  setSelectedUser(conv.user_id);
                  setSelectedName(conv.name);
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100
                  hover:bg-gray-50 transition-colors
                  ${selectedUser === conv.user_id ? 'bg-[#f0f2f5]' : ''}`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#dfe5e7]
                  flex items-center justify-center text-gray-500 font-bold text-sm flex-shrink-0">
                  {conv.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-sm">{conv.name}</span>
                    <span className="text-xs text-gray-400">{conv.last_message_time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500 truncate">
                      {conv.is_mine && <span className="text-gray-400">Sen: </span>}
                      {conv.last_message}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="bg-[#25d366] text-white text-xs rounded-full w-5 h-5
                        flex items-center justify-center flex-shrink-0 ml-2">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sağ: Mesaj Alanı */}
      <div className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-col flex-1 min-w-0`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-3 bg-[#075e54] text-white shadow-sm">
              <button
                onClick={() => { setSelectedUser(null); setMessages([]); }}
                className="md:hidden text-white/80 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-9 h-9 rounded-full bg-white/20
                flex items-center justify-center text-white font-bold text-sm">
                {selectedName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{selectedName}</h3>
              </div>
            </div>

            {/* Mesajlar */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-[#efeae2]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c9b99a\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>

              {Object.entries(grouped).map(([date, msgs]) => (
                <div key={date}>
                  {/* Tarih ayırıcı */}
                  <div className="flex items-center justify-center my-3">
                    <span className="px-3 py-1 bg-white/80 text-gray-600 text-[11px] rounded-lg shadow-sm font-medium">
                      {date}
                    </span>
                  </div>

                  {msgs.map(msg => (
                    <div key={msg.id} className={`flex mb-1.5 ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative max-w-[75%] px-3 py-2 shadow-sm
                        ${msg.is_mine
                          ? 'bg-[#d9fdd3] text-gray-800 rounded-xl rounded-tr-sm'
                          : 'bg-white text-gray-800 rounded-xl rounded-tl-sm'}`}>
                        {/* Gönderen ismi (karşı taraf için) */}
                        {!msg.is_mine && msg.sender_name && (
                          <p className="text-xs font-semibold text-orange-600 mb-0.5">{msg.sender_name}</p>
                        )}
                        <p className="text-[13px] whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                        <div className={`flex items-center justify-end gap-1 -mb-0.5 mt-0.5`}>
                          <span className="text-[10px] text-gray-500">{msg.time}</span>
                          {msg.is_mine && (
                            msg.is_read
                              ? <CheckCheck size={14} className="text-blue-500" />
                              : <Check size={14} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Mesaj Gönder */}
            <div className="p-2 bg-[#f0f0f0]">
              <div className="flex items-center gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Mesaj yaz..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 bg-white border-0 rounded-full text-sm
                    focus:outline-none resize-none shadow-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-[#075e54] hover:bg-[#064e46] disabled:bg-gray-300
                    text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Sohbet seçilmemiş */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle size={64} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Bir sohbet seçin</p>
            <p className="text-sm mt-1">Sol taraftan bir kişi seçerek mesajlaşmaya başlayın</p>
          </div>
        )}
      </div>
    </div>
  );
}